
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ChatMessageListProps {
  children: React.ReactNode
  className?: string
  scrollToBottomOnNewMessages?: boolean
}

export function ChatMessageList({
  children,
  className,
  scrollToBottomOnNewMessages = true,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollToBottomOnNewMessages && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [children, scrollToBottomOnNewMessages])

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-2 p-4 overflow-y-auto bg-gray-100/80 backdrop-blur-sm", 
        className
      )}
    >
      {children}
    </div>
  )
}

ChatMessageList.displayName = "ChatMessageList"
