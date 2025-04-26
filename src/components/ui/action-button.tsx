
import { cn } from "@/lib/utils";

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function ActionButton({ icon, label, onClick, disabled }: ActionButtonProps) {
    return (
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
}
