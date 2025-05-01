
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}

export function ChatInput({ className, ...props }: ChatInputProps) {
  return (
    <Textarea
      className={cn(
        "w-full resize-none border-0 focus-visible:ring-0 bg-white/60 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

ChatInput.displayName = "ChatInput"
