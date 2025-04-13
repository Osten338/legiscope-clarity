
import React from "react";

interface ChatMessageFormatterProps {
  content: string;
  role: "assistant" | "user";
}

export function ChatMessageFormatter({ content, role }: ChatMessageFormatterProps) {
  // Only format assistant messages
  if (role !== "assistant") {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Format the assistant's message for better readability
  const formattedContent = content
    // Replace heading indicators with proper styling
    .replace(/^(APPLICABLE LEGISLATION|RELEVANT LEGAL ELEMENTS|APPLICATION TO QUESTION|LIMITATIONS|EXECUTIVE SUMMARY):/gm, 
      '<strong class="text-lg block mt-4 mb-2">$1:</strong>')
    
    // Replace numbered list items with properly formatted numbers
    .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="mb-2">$1. $2</div>')
    
    // Format bullet points consistently
    .replace(/^\s*-\s+(.+)$/gm, '<div class="ml-4 mb-2">• $1</div>')
    
    // Remove any remaining Markdown-style bold formatting
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    
    // Create proper paragraph breaks
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([^\n])\n\n([^\n])/g, '$1<br/><br/>$2')
    .replace(/([^\n])\n([^\n])/g, '$1<br/>$2')
    
    // Format legal references consistently
    .replace(/\bArticle\s+(\d+[a-z]?)\s+of\s+([^,.]+)/gi, "$2, Article $1");
  
  return (
    <div
      className="prose prose-sage max-w-none text-left"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}
