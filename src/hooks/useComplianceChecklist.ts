
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChecklistItemType, RawChecklistItem, ResponseStatus, SimpleSubtask } from "@/components/dashboard/types";

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
        
        // Fetch saved regulations first
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
        
        // Fetch regulations data with simplified query
        const regulationIds = savedRegs.map(r => r.regulation_id);
        
        // Get regulations first
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

        // Process each regulation separately to avoid complex joins
        const result: RegulationType[] = [];
        
        for (const regulation of regulationsData) {
          try {
            // Get checklist items for this regulation
            const { data: checklistItems, error: checklistError } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id)
              .eq("is_subtask", false);

            if (checklistError) {
              console.error(`Error fetching checklist items for regulation ${regulation.id}:`, checklistError);
              continue;
            }

            // Get subtasks separately
            const { data: subtasks, error: subtasksError } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id)
              .eq("is_subtask", true);

            if (subtasksError) {
              console.error(`Error fetching subtasks for regulation ${regulation.id}:`, subtasksError);
            }

            // Get responses
            const allItemIds = [
              ...(checklistItems || []).map(item => item.id),
              ...(subtasks || []).map(subtask => subtask.id)
            ];

            let responses: any[] = [];
            if (allItemIds.length > 0) {
              const { data: responsesData, error: responsesError } = await supabase
                .from("checklist_item_responses")
                .select("checklist_item_id, status, justification")
                .eq("user_id", user.id)
                .in("checklist_item_id", allItemIds);

              if (responsesError) {
                console.error(`Error fetching responses for regulation ${regulation.id}:`, responsesError);
              } else {
                responses = responsesData || [];
              }
            }

            // Transform data with simpler type operations
            const processedItems: ChecklistItemType[] = (checklistItems || []).map((item: any) => {
              const response = responses.find((r: any) => r.checklist_item_id === item.id);
              
              // Find subtasks for this item
              const itemSubtasks: SimpleSubtask[] = (subtasks || [])
                .filter((subtask: any) => subtask.parent_id === item.id)
                .map((subtask: any) => {
                  const subtaskResponse = responses.find((r: any) => r.checklist_item_id === subtask.id);
                  
                  return {
                    id: subtask.id,
                    description: subtask.description,
                    is_subtask: true as const,
                    response: subtaskResponse ? {
                      status: subtaskResponse.status as ResponseStatus,
                      justification: subtaskResponse.justification,
                    } : undefined,
                  };
                });
              
              return {
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
              };
            });

            // Create regulation object
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
            // Continue with other regulations even if one fails
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

  // Debug tab changes
  useEffect(() => {
    console.log("ComplianceChecklist: Active tab changed to:", activeTab);
  }, [activeTab]);

  // Use a stable reference with useCallback
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
