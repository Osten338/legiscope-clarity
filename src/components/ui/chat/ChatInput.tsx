
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, PlusIcon, Loader2, ArrowUpIcon } from "lucide-react";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSend, onKeyDown, isLoading }: ChatInputProps) {
  const {
    textareaRef,
    adjustHeight
  } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200
  });

  return (
    <div className="relative bg-neutral-900 rounded-b-xl border border-t-0 border-neutral-800">
      <div className="overflow-y-auto">
        <Textarea 
          ref={textareaRef}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            adjustHeight();
          }}
          onKeyDown={onKeyDown}
          placeholder="Ask about compliance..."
          disabled={isLoading}
          className={cn(
            "w-full px-4 py-3",
            "resize-none",
            "bg-transparent",
            "border-none",
            "text-white text-sm",
            "focus:outline-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-neutral-500 placeholder:text-sm",
            "min-h-[60px]"
          )}
          style={{
            overflow: "hidden"
          }}
        />
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            className="group p-2 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1"
            disabled={isLoading}
          >
            <Paperclip className="w-4 h-4 text-white" />
            <span className="text-xs text-zinc-400 hidden group-hover:inline transition-opacity">
              Attach
            </span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button" 
            className="px-2 py-1 rounded-lg text-sm text-zinc-400 transition-colors border border-dashed border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1"
            disabled={isLoading}
          >
            <PlusIcon className="w-4 h-4" />
            Project
          </button>
          <button 
            type="button"
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              "px-1.5 py-1.5 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center justify-between gap-1",
              value.trim() ? "bg-white text-black" : "text-zinc-400"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUpIcon className={cn(
                "w-4 h-4",
                value.trim() ? "text-black" : "text-zinc-400"
              )} />
            )}
            <span className="sr-only">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
