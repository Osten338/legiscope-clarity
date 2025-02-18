import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Folder, 
  Calendar, 
  FileText, 
  BarChart, 
  Settings,
  X,
  Bell,
  CheckSquare
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const location = useLocation();
  
  return (
    <div className="fixed flex h-full w-72 flex-col gap-y-5 overflow-y-auto border-r border-slate-200 bg-white px-6 pb-4">
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
              <li>
                <Link
                  to="/dashboard"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/dashboard"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <LayoutDashboard
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/dashboard"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/risk-assessment"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname.includes("/risk-assessment")
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <BarChart
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname.includes("/risk-assessment")
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Risk Assessment
                </Link>
              </li>
              <li>
                <Link
                  to="/documents"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/documents"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <FileText
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/documents"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Documents
                </Link>
              </li>
              <li>
                <Link
                  to="/alerts"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/alerts"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <Bell
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/alerts"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Alerts
                </Link>
              </li>
              <li>
                <Link
                  to="/compliance-checklist"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/compliance-checklist"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <CheckSquare
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/compliance-checklist"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Compliance Checklist
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/analysis"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <BarChart
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/analysis"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Analysis
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className={cn(
                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold",
                    location.pathname === "/documentation"
                      ? "bg-slate-50 text-indigo-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  )}
                >
                  <FileText
                    className={cn(
                      "h-6 w-6 shrink-0",
                      location.pathname === "/documentation"
                        ? "text-indigo-600"
                        : "text-slate-400 group-hover:text-indigo-600"
                    )}
                  />
                  Documentation
                </Link>
              </li>
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
