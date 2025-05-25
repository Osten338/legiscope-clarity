
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChecklistItemType, ResponseStatus, SimpleSubtask } from "@/components/dashboard/types";

// Define RegulationType separately to avoid circular references
export interface RegulationType {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItemType[];
}

export const useComplianceChecklist = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          console.log("Current user ID:", user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    
    getUserId();
  }, []);

  const { data: regulations, isLoading, error, refetch } = useQuery({
    queryKey: ["regulations", userId],
    queryFn: async (): Promise<RegulationType[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Get saved regulations
        const { data: savedRegs, error: savedError } = await supabase
          .from("saved_regulations")
          .select("regulation_id")
          .eq("user_id", user.id);
          
        if (savedError) {
          throw savedError;
        }
        
        if (!savedRegs || savedRegs.length === 0) {
          console.log("No saved regulations found for user:", user.id);
          return [];
        }
        
        const regulationIds = savedRegs.map(r => r.regulation_id);
        
        // Get regulations basic info
        const { data: regulationsData, error: regulationsError } = await supabase
          .from("regulations")
          .select("id, name, description, motivation, requirements")
          .in("id", regulationIds);

        if (regulationsError) {
          console.error("Error fetching regulations:", regulationsError);
          toast("Failed to load regulations");
          throw regulationsError;
        }

        if (!regulationsData) {
          return [];
        }

        // Process each regulation with simplified data handling
        const result: RegulationType[] = [];
        
        for (const regulation of regulationsData) {
          try {
            // Get main checklist items
            const { data: items } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id)
              .eq("is_subtask", false);

            // Get subtasks
            const { data: subtasks } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id)
              .eq("is_subtask", true);

            // Get responses for all items
            const allItemIds = [
              ...(items || []).map(item => item.id),
              ...(subtasks || []).map(subtask => subtask.id)
            ];

            let responses: any[] = [];
            if (allItemIds.length > 0) {
              const { data: responsesData } = await supabase
                .from("checklist_item_responses")
                .select("checklist_item_id, status, justification")
                .eq("user_id", user.id)
                .in("checklist_item_id", allItemIds);

              responses = responsesData || [];
            }

            // Build processed items with simpler operations
            const processedItems: ChecklistItemType[] = [];
            
            for (const item of items || []) {
              const response = responses.find(r => r.checklist_item_id === item.id);
              
              // Find subtasks for this item
              const itemSubtasks: SimpleSubtask[] = [];
              for (const subtask of subtasks || []) {
                if (subtask.parent_id === item.id) {
                  const subtaskResponse = responses.find(r => r.checklist_item_id === subtask.id);
                  
                  itemSubtasks.push({
                    id: subtask.id,
                    description: subtask.description,
                    is_subtask: true as const,
                    response: subtaskResponse ? {
                      status: subtaskResponse.status as ResponseStatus,
                      justification: subtaskResponse.justification,
                    } : undefined,
                  });
                }
              }
              
              processedItems.push({
                id: item.id,
                description: item.description,
                importance: item.importance,
                category: item.category,
                estimated_effort: item.estimated_effort,
                expert_verified: item.expert_verified,
                task: item.task,
                best_practices: item.best_practices,
                department: item.department,
                parent_id: item.parent_id,
                is_subtask: false,
                subtasks: itemSubtasks.length > 0 ? itemSubtasks : undefined,
                response: response ? {
                  status: response.status as ResponseStatus,
                  justification: response.justification,
                } : undefined,
              });
            }

            result.push({
              id: regulation.id,
              name: regulation.name,
              description: regulation.description,
              motivation: regulation.motivation,
              requirements: regulation.requirements,
              checklist_items: processedItems,
            });
          } catch (itemError) {
            console.error(`Error processing regulation ${regulation.id}:`, itemError);
            continue;
          }
        }

        console.log("Fetched regulations with items:", result);
        return result;
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    console.log("ComplianceChecklist: Active tab changed to:", activeTab);
  }, [activeTab]);

  const handleTabChange = useCallback((value: string) => {
    console.log("ComplianceChecklist: Tab change handler called with value:", value);
    setActiveTab(value);
  }, []);

  return {
    regulations,
    isLoading,
    error,
    activeTab,
    handleTabChange,
    refetch
  };
};
