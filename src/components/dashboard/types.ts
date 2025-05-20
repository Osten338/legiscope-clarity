

export type ChecklistItem = {
  id: string;
  description: string;
};

export type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items?: ChecklistItem[];
  sanctions?: string;
  created_at?: string;
  updated_at?: string;
};

export type SavedRegulation = {
  id: string;
  regulation_id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  completion_date: string | null;
  notes: string | null;
  regulations: Regulation;
};

export type ViewType = "active" | "upcoming" | "tasks";
export type SortColumn = "name" | "description" | "status" | "progress" | "next_review_date";

export type RegulationListItem = {
  id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  regulations: {
    id: string;
    name: string;
    description: string;
  };
};

// Define a base type for common properties
export interface BaseChecklistItem {
  id: string;
  description: string;
  is_subtask: boolean;
}

// SubtaskType extends BaseChecklistItem but doesn't reference ChecklistItemType
export interface SubtaskType extends BaseChecklistItem {
  is_subtask: true;
}

// ChecklistItemType extends BaseChecklistItem and can contain subtasks
export interface ChecklistItemType extends BaseChecklistItem {
  importance?: number | null;
  category?: string | null;
  estimated_effort?: string | null;
  expert_verified?: boolean | null;
  task?: string | null;
  best_practices?: string | null;
  department?: string | null;
  parent_id?: string | null;
  is_subtask: boolean | null;
  subtasks?: SubtaskType[];
}
