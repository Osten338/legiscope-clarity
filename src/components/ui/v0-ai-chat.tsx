
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/compliance/ChatHeader";
import { ChatMessageList } from "@/components/compliance/ChatMessageList";
import { ChatInput } from "@/components/compliance/ChatInput";
import { ChatQuickActions } from "@/components/compliance/ChatQuickActions";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (text: string, checklistItem?: string) => {
    if (!text.trim()) return;

    // Add user message to chat
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

  const handleSend = () => {
    if (value.trim()) {
      sendMessage(value);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 space-y-8 bg-white min-h-screen">
      <ChatHeader />

      <div className="w-full">
        <ChatMessageList messages={messages} isLoading={isLoading} />
        
        <ChatInput 
          value={value} 
          onChange={setValue}
          onSend={handleSend}
          isLoading={isLoading}
          handleKeyDown={handleKeyDown}
        />

        <ChatQuickActions 
          onActionClick={handleActionClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
