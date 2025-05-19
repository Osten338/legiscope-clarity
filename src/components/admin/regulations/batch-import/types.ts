
// Define shared types for the batch import components
export interface BatchImportProps {
  regulationId: string;
  onImportComplete: () => void;
}

export interface ParsedItemsState {
  items: string[];
  fileName: string | null;
}
