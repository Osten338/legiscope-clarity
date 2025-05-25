
import { ChecklistItemType, ResponseStatus } from "@/components/dashboard/types";

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
export interface RawChecklistItem {
  id: string;
  regulation_id: string;
  created_at: string;
  updated_at: string;
  importance: number | null;
  description: string;
  category: string | null;
  estimated_effort: string | null;
  expert_verified: boolean | null;
}

export interface RawResponse {
  checklist_item_id: string;
  status: string;
  justification: string | null;
}

export interface RegulationData {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
}
