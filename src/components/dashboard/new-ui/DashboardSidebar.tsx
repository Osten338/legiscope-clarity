
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
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        subItem ? "pl-10" : "pl-3",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
      <span>{children}</span>
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
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-card transition-transform duration-300 ease-in-out dark:bg-gray-900 border-r border-border",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
      )}
    >
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">C</span>
          </div>
          {open && <span className="font-semibold">ComplianceOS</span>}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          <SidebarLink to="/dashboard" icon={LayoutDashboard} active={isActive("/dashboard")}>
            {open && "Dashboard"}
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
            {open && "Insights"}
          </SidebarLink>
          
          <SidebarLink to="/compliance-checklist" icon={CheckSquare} active={isActive("/compliance-checklist")}>
            {open && "Tasks"}
          </SidebarLink>
          
          <SidebarLink to="/documents" icon={FileText} active={isActive("/documents")}>
            {open && "Templates"}
          </SidebarLink>
          
          <SidebarLink to="/alerts" icon={Bell} active={isActive("/alerts")}>
            {open && "Alerts"}
          </SidebarLink>
          
          <SidebarLink to="/documentation" icon={BookOpen} active={isActive("/documentation")}>
            {open && "Knowledge Hub"}
          </SidebarLink>
        </nav>
      </div>
      
      {/* Footer/Settings */}
      <div className="border-t border-border p-2">
        <SidebarLink to="/settings" icon={Settings} active={isActive("/settings")}>
          {open && "Settings"}
        </SidebarLink>
      </div>
    </div>
  );
}
