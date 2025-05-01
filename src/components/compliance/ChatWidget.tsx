
import { useState, FormEvent } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "@/components/ui/expandable-chat";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatInput } from "@/components/ui/chat-input";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('compliance-buddy-chat', {
        body: { 
          messages: [...messages, userMessage],
          checklistItem: "Dashboard inquiry"
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
    }
  };

  return (
    <ExpandableChat
      size="md"
      position="bottom-right"
      icon={<Bot className="h-6 w-6" />}
      className="z-50"
    >
      <ExpandableChatHeader className="flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-semibold">Compliance Assistant</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Ask me about compliance
        </span>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.length === 0 ? (
            <div className="text-center my-8 text-muted-foreground">
              <Bot className="mx-auto h-12 w-12 text-primary/40 mb-3" />
              <p className="text-sm">
                Ask me anything about your compliance requirements.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
              >
                {message.role === "assistant" && (
                  <ChatBubbleAvatar
                    className="h-8 w-8"
                    fallback="AI"
                  />
                )}
                <ChatBubbleMessage
                  variant={message.role === "user" ? "sent" : "received"}
                >
                  {message.content}
                </ChatBubbleMessage>
                {message.role === "user" && (
                  <ChatBubbleAvatar
                    className="h-8 w-8"
                    fallback="You"
                  />
                )}
              </ChatBubble>
            ))
          )}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="min-h-10 rounded-md border bg-background p-2"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  );
}
