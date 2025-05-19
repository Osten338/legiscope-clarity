
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ChecklistItemType {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimated_effort?: string;
  expert_verified?: boolean;
  task?: string;
  best_practices?: string;
  department?: string;
  parent_id?: string | null;
  is_subtask: boolean;
  response?: {
    status: 'completed' | 'will_do' | 'will_not_do';
    justification?: string;
  };
  subtasks?: ChecklistItemType[];
}

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

        const regulationsWithItems = await Promise.all(
          regulations.map(async (regulation) => {
            // First, get all checklist items for this regulation
            const { data: allChecklistItems, error: itemsError } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id);

            if (itemsError) {
              console.error(
                `Error fetching checklist items for regulation ${regulation.id}:`,
                itemsError
              );
              return {
                ...regulation,
                checklist_items: [],
              };
            }

            // Get user responses for these checklist items
            const { data: responses, error: responsesError } = await supabase
              .from("checklist_item_responses")
              .select("*")
              .eq("user_id", user.id)
              .in(
                "checklist_item_id",
                allChecklistItems?.map((item) => item.id) || []
              );

            if (responsesError) {
              console.error(
                `Error fetching responses for regulation ${regulation.id}:`,
                responsesError
              );
            }

            // Add is_subtask and parent_id fields with type assertion
            const typedItems = allChecklistItems?.map(item => ({
              ...item,
              is_subtask: !!item.is_subtask,
              parent_id: item.parent_id || null
            })) || [];

            // Identify main tasks (not subtasks) and subtasks
            const mainTasks = typedItems.filter(item => {
              // Ensure is_subtask exists and is a boolean, default to false if undefined
              return item.is_subtask === false || item.is_subtask === undefined || item.is_subtask === null;
            });
            
            const subtasks = typedItems.filter(item => {
              // Ensure is_subtask is explicitly true
              return item.is_subtask === true;
            });
            
            // Map responses to checklist items
            const itemsWithResponses: ChecklistItemType[] = mainTasks.map((item) => {
              const response = responses?.find(
                (r) => r.checklist_item_id === item.id
              );
              
              // Find subtasks for this main task
              const itemSubtasks = subtasks.filter(
                subtask => subtask.parent_id === item.id
              ).map(subtask => {
                const subtaskResponse = responses?.find(
                  (r) => r.checklist_item_id === subtask.id
                );
                
                return {
                  ...subtask,
                  is_subtask: true, // Ensure is_subtask is explicitly set
                  response: subtaskResponse
                    ? {
                        status: subtaskResponse.status,
                        justification: subtaskResponse.justification,
                      }
                    : undefined,
                };
              });
              
              return {
                ...item,
                is_subtask: false, // Ensure is_subtask is explicitly set
                parent_id: item.parent_id || null, // Ensure parent_id exists, even if null
                subtasks: itemSubtasks.length > 0 ? itemSubtasks : undefined,
                response: response
                  ? {
                      status: response.status,
                      justification: response.justification,
                    }
                  : undefined,
              };
            });

            return {
              ...regulation,
              checklist_items: itemsWithResponses || [],
            };
          })
        );

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
