
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"

interface ChatBubbleProps {
  children: React.ReactNode
  variant?: "sent" | "received"
  className?: string
}

interface ChatBubbleMessageProps {
  children?: React.ReactNode
  variant?: "sent" | "received"
  className?: string
  isLoading?: boolean
}

interface ChatBubbleAvatarProps {
  src?: string
  fallback?: string
  className?: string
}

export function ChatBubble({
  children,
  variant = "received",
  className,
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-2",
        variant === "sent" ? "justify-end" : "justify-start",
        className
      )}
    >
      {children}
    </div>
  )
}

ChatBubble.displayName = "ChatBubble"

export function ChatBubbleMessage({
  children,
  variant = "received",
  className,
  isLoading,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(
        "min-h-12 rounded-lg p-3",
        variant === "sent"
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground",
        className
      )}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-6">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        children
      )}
    </div>
  )
}

ChatBubbleMessage.displayName = "ChatBubbleMessage"

export function ChatBubbleAvatar({
  src,
  fallback,
  className,
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} /> : null}
      <AvatarFallback>{fallback || "?"}</AvatarFallback>
    </Avatar>
  )
}

ChatBubbleAvatar.displayName = "ChatBubbleAvatar"
