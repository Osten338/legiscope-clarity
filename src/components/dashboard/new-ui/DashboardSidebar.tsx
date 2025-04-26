
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderGit,
  ChevronDown,
  BarChart3,
  CheckSquare,
  FileText,
  Settings,
  BookOpen,
  Bell
} from "lucide-react";

interface DashboardSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  active?: boolean;
  subItem?: boolean;
}

function SidebarLink({ to, icon: Icon, children, active, subItem }: SidebarLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative",
        subItem ? "pl-10" : "pl-3",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
      <span className="truncate">{children}</span>
    </Link>
  );
}

export function DashboardSidebar({ open, setOpen }: DashboardSidebarProps) {
  const location = useLocation();
  const [repositoryOpen, setRepositoryOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full bg-card transition-all duration-300 ease-in-out dark:bg-gray-900 border-r border-border",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Logo area */}
      <div className="flex h-full w-full flex-col">
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center shrink-0">
              <span className="font-bold text-primary-foreground">C</span>
            </div>
            {open && <span className="font-semibold">ComplianceOS</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            <SidebarLink 
              to="/dashboard" 
              icon={LayoutDashboard} 
              active={isActive("/dashboard")}
            >
              Dashboard
            </SidebarLink>

            <div className="py-0.5">
              <button
                onClick={() => setRepositoryOpen(!repositoryOpen)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive("/repository") 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <FolderGit className={cn(
                    "h-5 w-5 shrink-0", 
                    isActive("/repository") ? "text-primary" : "text-muted-foreground"
                  )} />
                  {open && <span>Repository</span>}
                </div>
                {open && (
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform", 
                      repositoryOpen && "transform rotate-180"
                    )} 
                  />
                )}
              </button>
              {open && repositoryOpen && (
                <div className="mt-1 space-y-1">
                  <SidebarLink 
                    to="/repository/contracts" 
                    icon={FileText} 
                    active={isActive("/repository/contracts")}
                    subItem
                  >
                    Contracts
                  </SidebarLink>
                  <SidebarLink 
                    to="/repository/regulations" 
                    icon={FileText} 
                    active={isActive("/repository/regulations")}
                    subItem
                  >
                    Regulations
                  </SidebarLink>
                </div>
              )}
            </div>

            <SidebarLink to="/risk-assessment" icon={BarChart3} active={isActive("/risk-assessment")}>
              Insights
            </SidebarLink>
            
            <SidebarLink to="/compliance-checklist" icon={CheckSquare} active={isActive("/compliance-checklist")}>
              Tasks
            </SidebarLink>
            
            <SidebarLink to="/documents" icon={FileText} active={isActive("/documents")}>
              Templates
            </SidebarLink>
            
            <SidebarLink to="/alerts" icon={Bell} active={isActive("/alerts")}>
              Alerts
            </SidebarLink>
            
            <SidebarLink to="/documentation" icon={BookOpen} active={isActive("/documentation")}>
              Knowledge Hub
            </SidebarLink>
          </div>
        </nav>
        
        {/* Footer/Settings */}
        <div className="border-t border-border p-2">
          <SidebarLink to="/settings" icon={Settings} active={isActive("/settings")}>
            Settings
          </SidebarLink>
        </div>
      </div>
    </div>
  );
}
