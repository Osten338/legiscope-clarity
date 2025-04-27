"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
    FileText,
    ShieldCheck,
    Book,
    ClipboardCheck,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    Loader2,
} from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { ActionButton } from "./action-button";
import { ScrollArea } from "./scroll-area";
import { ChatMessageFormatter } from "../compliance/ChatMessageFormatter";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const {
    textareaRef,
    adjustHeight
  } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200
  });

  const sendMessage = async (text: string, checklistItem?: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setValue("");
    adjustHeight(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('compliance-buddy-chat', {
        body: { 
          messages: [...messages, userMessage],
          checklistItem
        }
      });

      if (error) throw error;

      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        sendMessage(value);
      }
    }
  };

  const handleActionClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8 bg-neutral-100 min-h-screen">
            <h1 className="text-4xl font-bold text-black dark:text-white">
                Compliance Assistant
            </h1>

            <div className="w-full">
                <ScrollArea className="h-[400px] rounded-t-xl border border-b-0 border-neutral-300 bg-white p-4">
                    <div className="space-y-4 pb-4">
                        {messages.map((message, i) => (
                            <div key={i} className={cn(
                                "flex w-full",
                                message.role === "assistant" ? "justify-start" : "justify-end"
                            )}>
                                <div className={cn(
                                    "rounded-lg px-4 py-2 max-w-[80%]",
                                    message.role === "assistant" 
                                        ? "bg-neutral-800 text-white" 
                                        : "bg-blue-600 text-white"
                                )}>
                                    <ChatMessageFormatter 
                                        content={message.content} 
                                        role={message.role} 
                                    />
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-neutral-800 rounded-lg px-4 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="relative bg-white rounded-b-xl border border-t-0 border-neutral-300">
                    <div className="overflow-y-auto">
                        <Textarea 
                            ref={textareaRef}
                            value={value}
                            onChange={e => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about compliance..."
                            disabled={isLoading}
                            className={cn(
                                "w-full px-4 py-3",
                                "resize-none",
                                "bg-transparent",
                                "border-none",
                                "text-white text-sm",
                                "focus:outline-none",
                                "focus-visible:ring-0 focus-visible:ring-offset-0",
                                "placeholder:text-neutral-500 placeholder:text-sm",
                                "min-h-[60px]"
                            )}
                            style={{
                                overflow: "hidden"
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2">
                            <button 
                                type="button" 
                                className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
                                disabled={isLoading}
                            >
                                <Paperclip className="w-4 h-4 text-white" />
                                <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
                                    Attach
                                </span>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                type="button" 
                                className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
                                disabled={isLoading}
                            >
                                <PlusIcon className="w-4 h-4" />
                                Project
                            </button>
                            <button 
                                type="button"
                                onClick={() => value.trim() && sendMessage(value)}
                                disabled={!value.trim() || isLoading}
                                className={cn(
                                    "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
                                    value.trim() ? "bg-white text-black" : "text-zinc-400"
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ArrowUpIcon className={cn(
                                        "w-4 h-4",
                                        value.trim() ? "text-black" : "text-zinc-400"
                                    )} />
                                )}
                                <span className="sr-only">Send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3 mt-4">
                    <ActionButton
                        icon={<FileText className="w-4 h-4" />}
                        label="Policy Review"
                        onClick={() => handleActionClick("Can you help me review our company policies for compliance gaps?")}
                        disabled={isLoading}
                    />
                    <ActionButton
                        icon={<ShieldCheck className="w-4 h-4" />}
                        label="Compliance Check"
                        onClick={() => handleActionClick("Can you help me check our compliance status with current regulations?")}
                        disabled={isLoading}
                    />
                    <ActionButton
                        icon={<Book className="w-4 h-4" />}
                        label="Regulation Guidance"
                        onClick={() => handleActionClick("Can you provide guidance on recent regulatory changes that might affect us?")}
                        disabled={isLoading}
                    />
                    <ActionButton
                        icon={<ClipboardCheck className="w-4 h-4" />}
                        label="Risk Assessment"
                        onClick={() => handleActionClick("Can you help me assess potential compliance risks in our operations?")}
                        disabled={isLoading}
                    />
                    <ActionButton
                        icon={<CircleUserRound className="w-4 h-4" />}
                        label="Privacy Consultation"
                        onClick={() => handleActionClick("Can you help me understand privacy requirements and best practices?")}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </div>;
}
