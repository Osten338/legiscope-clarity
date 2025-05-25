
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

// Define raw database types to match the actual database schema
interface RawChecklistItem {
  id: string;
  regulation_id: string;
  created_at: string;
  updated_at: string;
  importance: number | null;
  description: string;
  category: string | null;
  estimated_effort: string | null;
  expert_verified: boolean | null;
  task: string | null;
  best_practices: string | null;
  department: string | null;
  parent_id: string | null;
  is_subtask: boolean | null;
}

interface RawResponse {
  checklist_item_id: string;
  status: string;
  justification: string | null;
}

interface RegulationData {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
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

  // Helper function to fetch saved regulations
  const fetchSavedRegulations = async (userId: string): Promise<string[]> => {
    const { data: savedRegs, error } = await supabase
      .from("saved_regulations")
      .select("regulation_id")
      .eq("user_id", userId);
      
    if (error) throw error;
    
    if (!savedRegs || savedRegs.length === 0) {
      console.log("No saved regulations found for user:", userId);
      return [];
    }
    
    return savedRegs.map(r => r.regulation_id);
  };

  // Helper function to fetch regulations basic info
  const fetchRegulations = async (regulationIds: string[]): Promise<RegulationData[]> => {
    const { data: regulationsData, error } = await supabase
      .from("regulations")
      .select("id, name, description, motivation, requirements")
      .in("id", regulationIds);

    if (error) {
      console.error("Error fetching regulations:", error);
      toast("Failed to load regulations");
      throw error;
    }

    return (regulationsData || []) as RegulationData[];
  };

  // Helper function to fetch checklist items with explicit column selection
  const fetchChecklistItems = async (regulationId: string): Promise<RawChecklistItem[]> => {
    const { data, error } = await supabase
      .from("checklist_items")
      .select(`
        id,
        regulation_id,
        created_at,
        updated_at,
        importance,
        description,
        category,
        estimated_effort,
        expert_verified,
        task,
        best_practices,
        department,
        parent_id,
        is_subtask
      `)
      .eq("regulation_id", regulationId);

    if (error) {
      console.error("Error fetching checklist items:", error);
      throw error;
    }
    
    return (data || []) as RawChecklistItem[];
  };

  // Helper function to fetch responses
  const fetchResponses = async (userId: string, itemIds: string[]): Promise<RawResponse[]> => {
    if (itemIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from("checklist_item_responses")
      .select("checklist_item_id, status, justification")
      .eq("user_id", userId)
      .in("checklist_item_id", itemIds);

    if (error) {
      console.error("Error fetching responses:", error);
      throw error;
    }
    
    return (data || []) as RawResponse[];
  };

  // Helper function to process items into the expected format
  const processChecklistItems = (
    allItems: RawChecklistItem[], 
    responses: RawResponse[]
  ): ChecklistItemType[] => {
    const mainItems = allItems.filter(item => !item.is_subtask);
    const subtaskItems = allItems.filter(item => item.is_subtask);
    
    return mainItems.map(item => {
      // Find subtasks for this item
      const itemSubtasks: SimpleSubtask[] = subtaskItems
        .filter(subtask => subtask.parent_id === item.id)
        .map(subtask => {
          const subtaskResponse = responses.find(r => r.checklist_item_id === subtask.id);
          
          return {
            id: subtask.id,
            description: subtask.description,
            is_subtask: true as const,
            response: subtaskResponse ? {
              status: subtaskResponse.status as ResponseStatus,
              justification: subtaskResponse.justification || undefined,
            } : undefined,
          };
        });

      // Find response for main item
      const response = responses.find(r => r.checklist_item_id === item.id);
      
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
          justification: response.justification || undefined,
        } : undefined,
      };
    });
  };

  const { data: regulations, isLoading, error, refetch } = useQuery({
    queryKey: ["regulations", userId],
    queryFn: async (): Promise<RegulationType[]> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        // Step 1: Get saved regulations
        const regulationIds = await fetchSavedRegulations(user.id);
        if (regulationIds.length === 0) return [];
        
        // Step 2: Get regulations basic info
        const regulationsData = await fetchRegulations(regulationIds);
        if (!regulationsData || regulationsData.length === 0) return [];

        // Step 3: Process each regulation
        const result: RegulationType[] = [];
        
        for (const regulation of regulationsData) {
          try {
            // Get all checklist items for this regulation
            const allItems = await fetchChecklistItems(regulation.id);
            
            // Get all item IDs for responses
            const allItemIds = allItems.map(item => item.id);
            
            // Get responses
            const responses = await fetchResponses(user.id, allItemIds);
            
            // Process items
            const processedItems = processChecklistItems(allItems, responses);

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
