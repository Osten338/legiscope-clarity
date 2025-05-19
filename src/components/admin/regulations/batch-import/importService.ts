
import { supabase } from "@/integrations/supabase/client";

export async function importChecklist(regulationId: string, items: any[]) {
  console.log("importChecklist called with:", { regulationId, itemCount: items.length });
  
  // Check if we have any items to import
  if (items.length === 0) {
    throw new Error("No items found. Please enter valid checklist items.");
  }

  // Get session to verify we're authenticated
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No active session found");
    throw new Error("Authentication required. Please sign in to import checklist items.");
  }

  // Process the items to handle both simple text items and structured items
  const checklistItems = items.map(item => {
    // Check if item is a string (old format) or an object (new format)
    if (typeof item === 'string') {
      // Legacy format - just description
      return {
        regulation_id: regulationId,
        description: item,
        importance: 3, // Medium importance by default
        category: "general",
        is_subtask: false
      };
    } else {
      // New format with full structure
      const mainTask = {
        regulation_id: regulationId,
        description: item.description || "",
        task: item.task || "",
        best_practices: item.best_practices || "",
        department: item.department || "",
        importance: item.importance || 3,
        category: item.category || "general",
        is_subtask: item.is_subtask === true,
        parent_id: item.parent_id || null,
        subtasks: Array.isArray(item.subtasks) ? JSON.stringify(item.subtasks) : "[]"
      };
      
      return mainTask;
    }
  });

  console.log("Preparing to insert items:", checklistItems.length);

  // Insert the main items
  const { data, error } = await supabase
    .from("checklist_items")
    .insert(checklistItems)
    .select();

  if (error) {
    console.error("Supabase error during import:", error);
    throw new Error(`Import failed: ${error.message}`);
  }

  // Process subtasks for each main task that has them
  let subtaskCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    const mainTask = data[i];
    const originalItem = items[i];
    
    // Skip string items or items without subtasks
    if (typeof originalItem === 'string' || !originalItem.subtasks || !Array.isArray(originalItem.subtasks) || originalItem.subtasks.length === 0) {
      continue;
    }
    
    // Create subtask items linked to their parent
    const subtasks = originalItem.subtasks.map((subtask: any) => ({
      regulation_id: regulationId,
      description: typeof subtask === 'string' ? subtask : (subtask.description || ""),
      task: typeof subtask === 'string' ? subtask : (subtask.task || ""),
      best_practices: typeof subtask === 'string' ? "" : (subtask.best_practices || ""),
      department: typeof subtask === 'string' ? "" : (subtask.department || ""),
      parent_id: mainTask.id,
      is_subtask: true,
      importance: typeof subtask === 'string' ? 3 : (subtask.importance || 3),
      category: typeof subtask === 'string' ? "general" : (subtask.category || "general")
    }));
    
    if (subtasks.length > 0) {
      const { error: subtaskError } = await supabase
        .from("checklist_items")
        .insert(subtasks);
        
      if (subtaskError) {
        console.error("Error inserting subtasks:", subtaskError);
        // Continue with other tasks even if some subtasks fail
      } else {
        subtaskCount += subtasks.length;
      }
    }
  }

  console.log("Import successful, inserted main items:", data?.length, "and subtasks:", subtaskCount);
  return data?.length + subtaskCount || 0;
}
