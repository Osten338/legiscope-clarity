
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    tooltip?: string;
}

export function ActionButton({ icon, label, onClick, disabled, tooltip }: ActionButtonProps) {
    const button = (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-full border border-neutral-800 text-neutral-400 hover:text-white transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 disabled:hover:text-neutral-400"
            )}
        >
            {icon}
            <span className="text-xs">{label}</span>
        </button>
    );

    if (tooltip) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {button}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return button;
}
