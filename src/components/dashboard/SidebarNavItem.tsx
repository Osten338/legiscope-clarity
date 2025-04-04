
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
          "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
          isActive
            ? "bg-slate-50 text-indigo-600"
            : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
        )}
      >
        <Icon
          className={cn(
            "h-6 w-6 shrink-0",
            isActive
              ? "text-indigo-600"
              : "text-slate-400 group-hover:text-indigo-600"
          )}
        />
        {children}
      </Link>
    </li>
  );
};
