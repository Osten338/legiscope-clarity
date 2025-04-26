
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Message } from "./types";
import { TextGenerateEffect } from "../text-generate-effect";
import { ChatMessageFormatter } from "../../compliance/ChatMessageFormatter";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-4 pb-4">
      {messages.map((message, i) => (
        <div
          key={i}
          className={cn(
            "flex w-full",
            message.role === "assistant" ? "justify-start" : "justify-end"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-[80%]",
              message.role === "assistant" 
                ? "bg-neutral-800 text-white" 
                : "bg-blue-600 text-white"
            )}
          >
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
  );
}
