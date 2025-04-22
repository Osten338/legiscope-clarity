
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
          "group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-neutral-100 text-brand"
            : "text-neutral-700 hover:bg-neutral-50 hover:text-brand"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            isActive
              ? "text-brand"
              : "text-neutral-400 group-hover:text-brand"
          )}
        />
        {children}
      </Link>
    </li>
  );
};
