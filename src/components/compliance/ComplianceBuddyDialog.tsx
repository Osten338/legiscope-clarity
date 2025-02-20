
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ComplianceBuddyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checklistItem: {
    description: string;
  };
}

export function ComplianceBuddyDialog({
  open,
  onOpenChange,
  checklistItem,
}: ComplianceBuddyDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      
      const newMessages = [...messages, { role: "user" as const, content }];
      setMessages(newMessages);
      setInput("");

      const { data, error } = await supabase.functions.invoke(
        "compliance-buddy-chat",
        {
          body: {
            messages: newMessages,
            checklistItem: checklistItem.description,
          },
        }
      );

      if (error) throw error;

      // Calculate response time
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);

      // Store the interaction in the database
      const { data: userData } = await supabase.auth.getUser();
      const { error: dbError } = await supabase.from("ai_responses").insert({
        user_query: content,
        checklist_item: checklistItem.description,
        legal_analysis: data.legalAnalysis || "Not provided",
        practical_implementation: data.practicalSteps || "Not provided",
        risk_assessment: data.riskAssessment || "Not provided",
        combined_response: data.reply,
        response_time_ms: responseTimeMs,
        model_version: "gpt-4o-mini",
        user_id: userData.user?.id
      });

      if (dbError) {
        console.error("Error storing AI response:", dbError);
      }

      setMessages([...newMessages, { role: "assistant" as const, content: data.reply }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!fixed !bottom-4 !right-4 !translate-x-0 !translate-y-0 !top-auto !left-auto max-w-[400px] h-[500px] flex flex-col !rounded-lg border border-sage-200 shadow-lg bg-white data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sage-600" />
            Compliance Buddy
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat with Compliance Buddy about compliance requirements
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-slate-500 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-sage-400" />
                <p>
                  Hi! I'm your Compliance Buddy. Ask me anything about how to meet
                  this requirement:
                </p>
                <p className="mt-2 text-sm text-sage-600 font-medium">
                  "{checklistItem.description}"
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-sage-50 text-sage-900 prose prose-sm max-w-none"
                        : "bg-sage-600 text-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="border-t pt-4 mt-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading) {
                sendMessage(input.trim());
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this requirement..."
              className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
