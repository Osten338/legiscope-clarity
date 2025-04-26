
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";

export default function ComplianceChat() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <VercelV0Chat />
      </div>
    </DashboardLayout>
  );
}
