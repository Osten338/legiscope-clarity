
export type DocumentViewType = "all" | "policies" | "procedures" | "templates";

export interface DocumentViewProps {
  currentView: DocumentViewType;
  onViewChange: (view: DocumentViewType) => void;
  documents: any[];
}
