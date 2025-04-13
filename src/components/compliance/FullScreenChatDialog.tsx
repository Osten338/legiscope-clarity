
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, ChevronDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface RetrievedContext {
  content: string;
  similarity: number;
}

interface FullScreenChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FullScreenChatDialog({
  open,
  onOpenChange,
}: FullScreenChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retrievedContext, setRetrievedContext] = useState<RetrievedContext[]>([]);
  const [showContext, setShowContext] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = window.innerWidth <= 640;

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const formatMessageContent = (content: string) => {
    if (!content) return "";
    // Replace double line breaks with proper paragraph breaks
    return content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

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
            checklistItem: "General compliance question", // Generic topic for the fullscreen chat
          },
        }
      );

      if (error) throw error;

      // Calculate response time
      const endTime = performance.now();
      const responseTimeMs = Math.round(endTime - startTime);

      // Store retrieved context
      if (data.retrievedContext) {
        setRetrievedContext(data.retrievedContext);
      }

      // Store the interaction in the database
      const { data: userData } = await supabase.auth.getUser();
      const { error: dbError } = await supabase.from("ai_responses").insert({
        user_query: content,
        checklist_item: "General compliance question",
        legal_analysis: "", // Add empty string for required fields
        practical_implementation: "", // Add empty string for required fields
        risk_assessment: "", // Add empty string for required fields
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

  const DialogComponent = isMobile ? Drawer : Dialog;
  const DialogContentComponent = isMobile ? DrawerContent : DialogContent;

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="h-[90vh]">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-sage-600 mr-2" />
                  <h2 className="font-medium text-sage-900">Compliance Buddy</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {renderChatContent()}
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-4xl w-[90vw] h-[85vh] flex flex-col p-0 gap-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-sage-600 mr-2" />
                <h2 className="font-medium text-sage-900">Compliance Buddy</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {renderChatContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );

  function renderChatContent() {
    return (
      <>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 mt-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-sage-400" />
                  <p className="text-lg font-medium mb-2">
                    How can I help with compliance today?
                  </p>
                  <p className="text-sm text-slate-400 max-w-md mx-auto">
                    Ask me about specific regulations, compliance requirements, or how to implement particular legal obligations for your business.
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[90%]",
                        message.role === "assistant"
                          ? "bg-sage-50 text-sage-900 prose prose-sm max-w-none whitespace-pre-line"
                          : "bg-sage-600 text-white"
                      )}
                    >
                      {message.role === "assistant" ? formatMessageContent(message.content) : message.content}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-sage-50 rounded-lg px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-sage-600" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {retrievedContext.length > 0 && (
          <Collapsible 
            open={showContext} 
            onOpenChange={setShowContext}
            className="mx-4 mb-2 border rounded-md"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full flex items-center justify-between p-2 h-auto"
              >
                <span className="flex items-center text-xs font-medium">
                  <Bot className="h-3.5 w-3.5 mr-1.5" />
                  Knowledge Sources
                </span>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform", 
                    showContext ? "transform rotate-180" : ""
                  )} 
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-2 pb-2">
              <div className="space-y-2 text-xs">
                {retrievedContext.map((ctx, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 bg-sage-50 rounded border border-sage-100 relative"
                  >
                    <Badge 
                      variant="outline" 
                      className="absolute top-1 right-1 text-[10px] px-1 py-0"
                    >
                      {Math.round(ctx.similarity * 100)}%
                    </Badge>
                    <p className="pr-12">{ctx.content}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="border-t p-4">
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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about compliance requirements..."
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
      </>
    );
  }
}
