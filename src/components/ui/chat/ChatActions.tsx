
import { FileText, ShieldCheck, Book, ClipboardCheck, CircleUserRound } from "lucide-react";
import { ActionButton } from "../action-button";

interface ChatActionsProps {
  onActionClick: (prompt: string) => void;
  isLoading: boolean;
}

export function ChatActions({ onActionClick, isLoading }: ChatActionsProps) {
  return (
    <div className="flex items-center justify-center gap-3 mt-4">
      <ActionButton
        icon={<FileText className="w-4 h-4" />}
        label="Policy Review"
        onClick={() => onActionClick("Can you help me review our company policies for compliance gaps?")}
        disabled={isLoading}
      />
      <ActionButton
        icon={<ShieldCheck className="w-4 h-4" />}
        label="Compliance Check"
        onClick={() => onActionClick("Can you help me check our compliance status with current regulations?")}
        disabled={isLoading}
      />
      <ActionButton
        icon={<Book className="w-4 h-4" />}
        label="Regulation Guidance"
        onClick={() => onActionClick("Can you provide guidance on recent regulatory changes that might affect us?")}
        disabled={isLoading}
      />
      <ActionButton
        icon={<ClipboardCheck className="w-4 h-4" />}
        label="Risk Assessment"
        onClick={() => onActionClick("Can you help me assess potential compliance risks in our operations?")}
        disabled={isLoading}
      />
      <ActionButton
        icon={<CircleUserRound className="w-4 h-4" />}
        label="Privacy Consultation"
        onClick={() => onActionClick("Can you help me understand privacy requirements and best practices?")}
        disabled={isLoading}
      />
    </div>
  );
}
