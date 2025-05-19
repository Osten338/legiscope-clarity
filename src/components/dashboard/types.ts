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
  checklist_items?: any[];
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
