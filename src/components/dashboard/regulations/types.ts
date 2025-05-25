
// Simple interfaces to avoid type complexity
export interface SimpleChecklistItem {
  id: string;
  description: string;
  importance?: number | null;
  category?: string | null;
  estimated_effort?: string | null;
  expert_verified?: boolean | null;
  task?: string | null;
  best_practices?: string | null;
  department?: string | null;
  parent_id?: string | null;
  is_subtask: boolean;
  subtasks?: SimpleSubtask[];
}

export interface SimpleSubtask {
  id: string;
  description: string;
  is_subtask: true;
}
