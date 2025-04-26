
import React from "react";
import { TextGenerateEffect } from "../ui/text-generate-effect";

interface ChatMessageFormatterProps {
  content: string;
  role: "assistant" | "user";
}

export function ChatMessageFormatter({ content, role }: ChatMessageFormatterProps) {
  // For user messages, render directly without animation
  if (role !== "assistant") {
    return <div className="whitespace-pre-wrap text-white">{content}</div>;
  }

  // Format the assistant's message for better readability
  const formattedContent = content
    // Replace heading indicators with proper styling and space above
    .replace(/^(APPLICABLE LEGISLATION|RELEVANT LEGAL ELEMENTS|APPLICATION TO QUESTION|LIMITATIONS|EXECUTIVE SUMMARY):/gm, 
      '<strong class="text-lg block mt-4 mb-0 text-white">$1:</strong>')
    
    // Replace numbered list items with properly formatted numbers and reduced spacing
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="mb-1 text-white">$1. $2</div>')
    
    // Format bullet points consistently with reduced spacing
    .replace(/^\s*-\s+(.+)$/gm, '<div class="ml-4 mb-1 text-white">• $1</div>')
    
    // Remove any remaining Markdown-style bold formatting
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    
    // Reduce paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([^\n])\n\n([^\n])/g, '$1<br/>$2')
    .replace(/([^\n])\n([^\n])/g, '$1<br/>$2')
    
    // Format legal references consistently
    .replace(/\bArticle\s+(\d+[a-z]?)\s+of\s+([^,.]+)/gi, "$2, Article $1");
  
  return (
    <div className="prose prose-sage max-w-none text-left text-sm text-white">
      <TextGenerateEffect 
        words={formattedContent} 
        filter={false}
        duration={0.5}
        className="text-white"
      />
    </div>
  );
}
