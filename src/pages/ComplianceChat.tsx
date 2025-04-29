
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export default function ComplianceChat() {
  return (
    <TopbarLayout>
      <div className="flex flex-col h-full">
        <VercelV0Chat />
      </div>
    </TopbarLayout>
  );
}
