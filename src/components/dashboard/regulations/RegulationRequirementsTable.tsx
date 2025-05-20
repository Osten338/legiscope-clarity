
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RegulationListItem, ChecklistItemType, SubtaskType, RawChecklistItem } from "../types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

interface RegulationRequirementsTableProps {
  regulation: RegulationListItem;
}

export const RegulationRequirementsTable = ({
  regulation,
}: RegulationRequirementsTableProps) => {
  const [requirementItems, setRequirementItems] = useState<ChecklistItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoading(true);
      
      try {
        if (regulation && regulation.regulations) {
          console.log("Fetching checklist items for regulation:", regulation.regulations.id);
          
          // First fetch parent checklist items (not subtasks)
          const { data: mainItems, error: mainError } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("regulation_id", regulation.regulations.id)
            .eq("is_subtask", false);
            
          if (mainError) {
            console.error("Error fetching main checklist items:", mainError);
            throw mainError;
          }
          
          console.log("Main items fetched:", mainItems);
          
          // Fetch subtasks in a separate query
          const { data: subtaskItems, error: subtaskError } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("regulation_id", regulation.regulations.id)
            .eq("is_subtask", true);
            
          if (subtaskError) {
            console.error("Error fetching subtasks:", subtaskError);
            throw subtaskError;
          }
          
          console.log("Subtask items fetched:", subtaskItems);
          
          // Group subtasks by parent_id
          const subtasksByParent: Record<string, RawChecklistItem[]> = {};
          (subtaskItems || []).forEach(subtask => {
            if (subtask.parent_id) {
              if (!subtasksByParent[subtask.parent_id]) {
                subtasksByParent[subtask.parent_id] = [];
              }
              subtasksByParent[subtask.parent_id].push(subtask);
            }
          });
          
          // Map main items with their subtasks
          const transformedData: ChecklistItemType[] = (mainItems || []).map(item => {
            const itemSubtasks = subtasksByParent[item.id] || [];
            
            // Transform subtasks into SubtaskType
            const mappedSubtasks: SubtaskType[] = itemSubtasks.map(subtask => ({
              id: subtask.id || '',
              description: subtask.description || '',
              is_subtask: true
            }));
            
            return {
              id: item.id || '',
              description: item.description || '',
              importance: item.importance || null,
              category: item.category || null,
              estimated_effort: item.estimated_effort || null,
              expert_verified: item.expert_verified || null,
              task: item.task || null,
              best_practices: item.best_practices || null,
              department: item.department || null,
              parent_id: item.parent_id || null,
              is_subtask: false,
              subtasks: mappedSubtasks.length > 0 ? mappedSubtasks : undefined
            };
          });
          
          console.log("Transformed data with subtasks:", transformedData);
          setRequirementItems(transformedData);
        }
      } catch (error) {
        console.error("Failed to fetch requirements:", error);
        // Fallback to sample data if there's an error
        setRequirementItems([
          {
            id: "req-1",
            description: "Implement appropriate technical measures",
            task: "Data Protection Implementation",
            best_practices: "Use industry-standard encryption",
            department: "IT Security",
            importance: 5,
            category: "Security",
            estimated_effort: "1-2 weeks",
            expert_verified: true,
            is_subtask: false,
            subtasks: [
              { 
                id: "sub-1", 
                description: "Implement encryption for data at rest",
                is_subtask: true
              },
              {
                id: "sub-2",
                description: "Implement encryption for data in transit",
                is_subtask: true
              }
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequirements();
  }, [regulation]);

  // Helper function for displaying importance badges
  const getImportanceBadge = (importance?: number | null) => {
    if (!importance) return null;
    
    const colors = {
      1: "bg-slate-100 text-slate-600 border-slate-200",
      2: "bg-blue-100 text-blue-600 border-blue-200",
      3: "bg-green-100 text-green-600 border-green-200",
      4: "bg-amber-100 text-amber-600 border-amber-200",
      5: "bg-red-100 text-red-600 border-red-200",
    };
    
    const labels = {
      1: "Low",
      2: "Medium-Low",
      3: "Medium",
      4: "Medium-High",
      5: "High",
    };
    
    return (
      <Badge 
        variant="outline" 
        className={colors[importance as keyof typeof colors]}
      >
        {labels[importance as keyof typeof labels]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 text-center py-8 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto"></div>
        <div className="mt-2">Loading requirements...</div>
      </div>
    );
  }

  if (!requirementItems.length) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 text-center py-8 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        No specific requirements found for this regulation.
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
            <TableHead className="w-[40px] font-medium text-gray-900 dark:text-gray-100"></TableHead>
            <TableHead className="w-[120px] font-medium text-gray-900 dark:text-gray-100">Priority</TableHead>
            <TableHead className="w-[150px] font-medium text-gray-900 dark:text-gray-100">Category</TableHead>
            <TableHead className="font-medium text-gray-900 dark:text-gray-100">Task</TableHead>
            <TableHead className="font-medium text-gray-900 dark:text-gray-100">Department</TableHead>
            <TableHead className="w-[120px] font-medium text-gray-900 dark:text-gray-100">Est. Effort</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirementItems.map((item, index) => (
            <>
              <TableRow 
                key={`row-${item.id}`}
                className={cn(
                  "transition-colors cursor-pointer",
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                )}
                onClick={() => toggleRow(item.id)}
              >
                <TableCell className="p-2">
                  {item.subtasks && item.subtasks.length > 0 ? (
                    expandedRows[item.id] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  ) : null}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getImportanceBadge(item.importance)}
                    {item.expert_verified && (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {item.category || "General"}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300 font-medium">
                  {item.task || item.description}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {item.department || "Not assigned"}
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">
                  {item.estimated_effort || "Varies"}
                </TableCell>
              </TableRow>
              
              {expandedRows[item.id] && (
                <TableRow key={`expanded-${item.id}`} className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  <TableCell colSpan={6} className="p-0">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <div className="space-y-3">
                        {item.task && item.description && item.task !== item.description && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                          </div>
                        )}
                        
                        {item.best_practices && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Practices:</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.best_practices}</p>
                          </div>
                        )}
                        
                        {item.subtasks && item.subtasks.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              Subtasks <Badge className="bg-blue-100 text-blue-600 border-0">{item.subtasks.length}</Badge>
                            </h4>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                              {item.subtasks.map((subtask) => (
                                <li key={subtask.id} className="text-sm text-gray-600 dark:text-gray-400">
                                  {subtask.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
