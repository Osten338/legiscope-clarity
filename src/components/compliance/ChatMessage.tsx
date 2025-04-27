
import React from "react";
import { cn } from "@/lib/utils";
import { ChatMessageFormatter } from "./ChatMessageFormatter";

interface ChatMessageProps {
  content: string;
  role: "assistant" | "user";
}

export function ChatMessage({ content, role }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex w-full",
      role === "assistant" ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "rounded-lg px-4 py-2 max-w-[80%]",
        role === "assistant" 
          ? "bg-neutral-800 text-white" 
          : "bg-blue-600 text-white"
      )}>
        <ChatMessageFormatter 
          content={content} 
          role={role} 
        />
      </div>
    </div>
  );
}
