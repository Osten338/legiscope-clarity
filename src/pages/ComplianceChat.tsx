import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { FullScreenChatDialog } from "@/components/compliance/FullScreenChatDialog";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare } from "lucide-react";

export default function ComplianceChat() {
  const [chatOpen, setChatOpen] = useState(true);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-sage-100 rounded-full">
              <Bot className="h-12 w-12 text-sage-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-semibold mb-2">Compliance Chat Assistant</h1>
          
          <p className="text-slate-600 mb-8">
            Get expert guidance on compliance requirements, regulatory obligations, and implementation strategies for your business.
          </p>
          
          <Button 
            size="lg" 
            className="gap-2" 
            onClick={() => setChatOpen(true)}
          >
            <MessageSquare className="h-5 w-5" />
            Start Chat
          </Button>
        </div>
      </div>
      
      <FullScreenChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
      />
    </DashboardLayout>
  );
}
