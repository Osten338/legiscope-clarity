
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RegulationListItem } from "../types";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface RequirementItem {
  id: string;
  description: string;
  importance: number;
  category: string | null;
  estimated_effort: string | null;
}

interface RegulationRequirementsTableProps {
  regulation: RegulationListItem;
}

export const RegulationRequirementsTable = ({
  regulation,
}: RegulationRequirementsTableProps) => {
  const [requirementItems, setRequirementItems] = useState<RequirementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRequirements = async () => {
      setIsLoading(true);
      
      try {
        if (regulation && regulation.regulations) {
          // Fetch actual checklist items from the database
          const { data, error } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("regulation_id", regulation.regulations.id)
            .order("importance", { ascending: false });
            
          if (error) {
            console.error("Error fetching checklist items:", error);
            throw error;
          }
          
          setRequirementItems(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch requirements:", error);
        // Fallback to sample data if there's an error or no items
        if (regulation && regulation.regulations) {
          // Generate sample requirements based on the regulation
          const sampleRequirements: RequirementItem[] = [
            {
              id: "req-1",
              description: "Data Protection Measures",
              importance: 5,
              category: "Security",
              estimated_effort: "1-2 weeks",
            },
            {
              id: "req-2",
              description: "Documentation Requirements",
              importance: 4,
              category: "Documentation",
              estimated_effort: "1 week",
            },
            {
              id: "req-3",
              description: "Risk Assessment",
              importance: 4,
              category: "Risk Management",
              estimated_effort: "1-2 weeks",
            },
            {
              id: "req-4",
              description: "Staff Training",
              importance: 3,
              category: "Training",
              estimated_effort: "2-3 days",
            },
            {
              id: "req-5",
              description: "Incident Response Plan",
              importance: 4,
              category: "Security",
              estimated_effort: "1 week",
            }
          ];
          
          setRequirementItems(sampleRequirements);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRequirements();
  }, [regulation]);

  const getImportanceBadge = (importance?: number) => {
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
            <TableHead className="w-[120px] font-medium text-gray-900 dark:text-gray-100">Priority</TableHead>
            <TableHead className="w-[150px] font-medium text-gray-900 dark:text-gray-100">Category</TableHead>
            <TableHead className="font-medium text-gray-900 dark:text-gray-100">Requirement</TableHead>
            <TableHead className="w-[150px] font-medium text-gray-900 dark:text-gray-100">Est. Effort</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirementItems.map((item, index) => (
            <TableRow 
              key={item.id}
              className={cn(
                "transition-colors",
                index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
              )}
            >
              <TableCell className="font-medium">
                {getImportanceBadge(item.importance)}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {item.category || "General"}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {item.description}
              </TableCell>
              <TableCell className="text-gray-700 dark:text-gray-300">
                {item.estimated_effort || "Varies"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
