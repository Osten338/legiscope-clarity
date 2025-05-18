
import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItemVersionHistory } from "../admin/ChecklistItemVersionHistory";
import { Card } from "@/components/ui/card";

interface ChecklistItemWithVersionHistoryProps {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimatedEffort?: string;
  regulationId: string;
  regulationName: string;
  regulationDescription: string;
  expertVerified?: boolean;
  response?: {
    status: 'completed' | 'will_do' | 'will_not_do';
    justification?: string;
  };
}

export const ChecklistItemWithVersionHistory = (props: ChecklistItemWithVersionHistoryProps) => {
  return (
    <div className="space-y-2">
      <ChecklistItem {...props} />
      <ChecklistItemVersionHistory checklistItemId={props.id} />
    </div>
  );
};
