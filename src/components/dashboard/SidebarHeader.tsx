
import { X } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const SidebarHeader = ({ mobile, onClose }: SidebarHeaderProps) => {
  if (!mobile) {
    return (
      <div className="flex h-16 shrink-0 items-center">
        <Icons.logo className="h-8 w-8 text-brand" />
      </div>
    );
  }

  return (
    <div className="flex h-16 shrink-0 items-center justify-between">
      <Icons.logo className="h-8 w-8 text-brand" />
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      )}
    </div>
  );
};
