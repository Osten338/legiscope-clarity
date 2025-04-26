
"use client";

import { useState } from "react";
import { ScrollArea } from "./scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessages } from "./chat/ChatMessages";
import { ChatInput } from "./chat/ChatInput";
import { ChatActions } from "./chat/ChatActions";
import { Message } from "./chat/types";

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (text: string, checklistItem?: string) => {
    if (!text.trim()) return;

    const userMessage = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setValue("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('compliance-buddy-chat', {
        body: { 
          messages: [...messages, userMessage],
          checklistItem
        }
      });

      if (error) throw error;

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

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-black dark:text-white">
        Compliance Assistant
      </h1>

      <div className="w-full">
        <ScrollArea className="h-[400px] rounded-t-xl border border-b-0 border-neutral-800 bg-neutral-900 p-4">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </ScrollArea>

        <ChatInput
          value={value}
          onChange={setValue}
          onSend={() => value.trim() && sendMessage(value)}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
        />

        <ChatActions onActionClick={handleActionClick} isLoading={isLoading} />
      </div>
    </div>
  );
}
