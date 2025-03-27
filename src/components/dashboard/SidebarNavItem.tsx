
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
          "group flex gap-x-3 rounded-md p-2 text-sm font-medium",
          isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0",
            isActive
              ? "text-slate-900"
              : "text-slate-500 group-hover:text-slate-900"
          )}
        />
        {children}
      </Link>
    </li>
  );
};
