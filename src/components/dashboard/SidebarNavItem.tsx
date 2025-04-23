
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarNavItemProps {
  to: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isActive: boolean;
}

export const SidebarNavItem = ({ to, icon: Icon, children, isActive }: SidebarNavItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "group flex gap-x-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-neutral-400 hover:bg-muted hover:text-neutral-200"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            isActive
              ? "text-primary"
              : "text-neutral-400 group-hover:text-neutral-300"
          )}
        />
        {children}
      </Link>
    </li>
  );
};
