
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Calendar, 
  FileText, 
  BarChart, 
  Settings,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Team", href: "/team", icon: Users },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Reports", href: "/reports", icon: BarChart },
];

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H" },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T" },
  { id: 3, name: "Workcation", href: "#", initial: "W" },
];

export const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
      {mobile && (
        <div className="flex h-16 shrink-0 items-center justify-between">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-8 w-auto"
          />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      )}
      {!mobile && (
        <div className="flex h-16 shrink-0 items-center">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-8 w-auto"
          />
        </div>
      )}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                        isActive
                          ? "bg-slate-50 text-indigo-600"
                          : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-6 w-6 shrink-0",
                          isActive
                            ? "text-indigo-600"
                            : "text-slate-400 group-hover:text-indigo-600"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-slate-400">
              Your teams
            </div>
            <ul role="list" className="-mx-2 mt-2 space-y-1">
              {teams.map((team) => (
                <li key={team.name}>
                  <Link
                    to={team.href}
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-[0.625rem] font-medium text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600"
                    >
                      {team.initial}
                    </span>
                    <span className="truncate">{team.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              to="/settings"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
            >
              <Settings
                className="h-6 w-6 shrink-0 text-slate-400 group-hover:text-indigo-600"
              />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
