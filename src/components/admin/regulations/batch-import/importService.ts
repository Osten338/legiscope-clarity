
import { supabase } from "@/integrations/supabase/client";

export async function importChecklist(regulationId: string, items: string[]) {
  // Check if we have any items to import
  if (items.length === 0) {
    throw new Error("No items found. Please enter valid checklist items.");
  }

  // Prepare the items for batch insert
  const checklistItems = items.map(description => ({
    regulation_id: regulationId,
    description,
    // Default values
    importance: 3, // Medium importance by default
    category: "general"
  }));

  // Insert the items
  const { error } = await supabase
    .from("checklist_items")
    .insert(checklistItems);

  if (error) throw error;

  return items.length;
}
