
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChecklistItemType, ResponseStatus } from "@/components/dashboard/types";
import { RawChecklistItem, RawResponse, RegulationData } from "./types";

// Helper function to fetch saved regulations
export const fetchSavedRegulations = async (userId: string): Promise<string[]> => {
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
export const fetchRegulations = async (regulationIds: string[]): Promise<RegulationData[]> => {
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

// Helper function to fetch checklist items with only essential columns
export const fetchChecklistItems = async (regulationId: string): Promise<RawChecklistItem[]> => {
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
      expert_verified
    `)
    .eq("regulation_id", regulationId);

  if (error) {
    console.error("Error fetching checklist items:", error);
    throw error;
  }
  
  return (data || []) as RawChecklistItem[];
};

// Helper function to fetch responses
export const fetchResponses = async (userId: string, itemIds: string[]): Promise<RawResponse[]> => {
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
export const processChecklistItems = (
  allItems: RawChecklistItem[], 
  responses: RawResponse[]
): ChecklistItemType[] => {
  // Process all items as main items since we're not handling subtasks for now
  return allItems.map(item => {
    // Find response for item
    const response = responses.find(r => r.checklist_item_id === item.id);
    
    return {
      id: item.id,
      description: item.description,
      importance: item.importance,
      category: item.category,
      estimated_effort: item.estimated_effort,
      expert_verified: item.expert_verified,
      task: null, // Set to null since this column doesn't exist in database
      best_practices: null, // Set to null since this column doesn't exist in database
      department: null, // Set to null since this column doesn't exist in database
      parent_id: null, // Set to null for now
      is_subtask: false, // Default to false for all items
      subtasks: undefined, // No subtasks for now since we're not handling parent-child relationships
      response: response ? {
        status: response.status as ResponseStatus,
        justification: response.justification || undefined,
      } : undefined,
    };
  });
};
