
import React from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  return (
    <ScrollArea className="h-[400px] rounded-t-xl border border-b-0 border-neutral-300 bg-neutral-100 p-4">
      <div className="space-y-4 pb-4">
        {messages.map((message, i) => (
          <ChatMessage 
            key={i} 
            role={message.role} 
            content={message.content} 
          />
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
  );
}
