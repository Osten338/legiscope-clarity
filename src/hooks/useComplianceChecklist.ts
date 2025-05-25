
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChecklistItemType, SubtaskType, RawChecklistItem, ResponseStatus } from "@/components/dashboard/types";

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
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
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
        
        const { data: regulations, error: regulationsError } = await supabase
          .from("regulations")
          .select("*")
          .in("id", savedRegs.map(r => r.regulation_id));

        if (regulationsError) {
          console.error("Error fetching regulations:", regulationsError);
          toast("Failed to load regulations");
          throw regulationsError;
        }

        // Process regulations sequentially to avoid complex type mappings
        const regulationsWithItems: RegulationType[] = [];
        
        for (const regulation of regulations) {
          // First, get all main checklist items (not subtasks) for this regulation
          const { data: mainItems, error: mainItemsError } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("regulation_id", regulation.id)
            .eq("is_subtask", false);

          if (mainItemsError) {
            console.error(`Error fetching main checklist items for regulation ${regulation.id}:`, mainItemsError);
            continue;
          }

          // Get all subtasks for this regulation
          const { data: subtasks, error: subtasksError } = await supabase
            .from("checklist_items")
            .select("*")
            .eq("regulation_id", regulation.id)
            .eq("is_subtask", true);

          if (subtasksError) {
            console.error(`Error fetching subtasks for regulation ${regulation.id}:`, subtasksError);
          }

          // Group subtasks by parent_id
          const subtasksByParent: Record<string, RawChecklistItem[]> = {};
          (subtasks || []).forEach((subtask: RawChecklistItem) => {
            if (subtask.parent_id) {
              if (!subtasksByParent[subtask.parent_id]) {
                subtasksByParent[subtask.parent_id] = [];
              }
              subtasksByParent[subtask.parent_id].push(subtask);
            }
          });

          // Get user responses for these checklist items
          const allItemIds = [
            ...(mainItems || []).map(item => item.id),
            ...(subtasks || []).map(subtask => subtask.id)
          ];

          const { data: responses, error: responsesError } = await supabase
            .from("checklist_item_responses")
            .select("*")
            .eq("user_id", user.id)
            .in("checklist_item_id", allItemIds);

          if (responsesError) {
            console.error(`Error fetching responses for regulation ${regulation.id}:`, responsesError);
          }

          // Transform main items with their subtasks
          const itemsWithResponses: ChecklistItemType[] = (mainItems || []).map((item: RawChecklistItem) => {
            const response = responses?.find((r) => r.checklist_item_id === item.id);
            
            // Find subtasks for this main task
            const itemSubtasks: SubtaskType[] = (subtasksByParent[item.id] || []).map(subtask => {
              const subtaskResponse = responses?.find((r) => r.checklist_item_id === subtask.id);
              
              return {
                id: subtask.id,
                description: subtask.description,
                is_subtask: true,
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

          // Create the regulation object
          const regulationWithItems: RegulationType = {
            id: regulation.id,
            name: regulation.name,
            description: regulation.description,
            motivation: regulation.motivation,
            requirements: regulation.requirements,
            checklist_items: itemsWithResponses,
          };

          regulationsWithItems.push(regulationWithItems);
        }

        console.log("Fetched regulations with items:", regulationsWithItems);
        return regulationsWithItems;
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
