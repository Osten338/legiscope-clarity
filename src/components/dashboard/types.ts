
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

// Define type for raw checklist items from database
export interface RawChecklistItem {
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
  is_subtask?: boolean;
  regulation_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Define a base interface for checklist items
export interface BaseChecklistItem {
  id: string;
  description: string;
  is_subtask: boolean;
}

// Define the allowed status values for responses
export type ResponseStatus = 'completed' | 'will_do' | 'will_not_do';

// Define the response type separately to avoid circular references
export interface ItemResponse {
  status: ResponseStatus;
  justification?: string;
}

// Subtask type - simpler version that doesn't reference the parent
export interface SubtaskType extends BaseChecklistItem {
  is_subtask: true;
  response?: ItemResponse;
}

// Main checklist item type with all properties
export interface ChecklistItemType extends BaseChecklistItem {
  importance?: number | null;
  category?: string | null;
  estimated_effort?: string | null;
  expert_verified?: boolean | null;
  task?: string | null;
  best_practices?: string | null;
  department?: string | null;
  parent_id?: string | null;
  is_subtask: boolean;
  subtasks?: SubtaskType[];
  response?: ItemResponse;
}
