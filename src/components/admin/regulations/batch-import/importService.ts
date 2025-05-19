
import { supabase } from "@/integrations/supabase/client";

export async function importChecklist(regulationId: string, items: string[]) {
  console.log("importChecklist called with:", { regulationId, itemCount: items.length });
  
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

  console.log("Preparing to insert items:", checklistItems.length);

  // Get session to verify we're authenticated
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No active session found");
    throw new Error("Authentication required. Please sign in to import checklist items.");
  }

  // Insert the items
  const { data, error } = await supabase
    .from("checklist_items")
    .insert(checklistItems)
    .select();

  if (error) {
    console.error("Supabase error during import:", error);
    throw new Error(`Import failed: ${error.message}`);
  }

  console.log("Import successful, inserted items:", data?.length);
  return items.length;
}
