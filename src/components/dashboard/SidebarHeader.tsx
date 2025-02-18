
import { X } from "lucide-react";

interface SidebarHeaderProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const SidebarHeader = ({ mobile, onClose }: SidebarHeaderProps) => {
  if (!mobile) {
    return (
      <div className="flex h-16 shrink-0 items-center">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-auto"
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 shrink-0 items-center justify-between">
      <img
        alt="Your Company"
        src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
        className="h-8 w-auto"
      />
      {onClose && (
        <button
          type="button"
          className="text-slate-600 hover:text-slate-700"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};
