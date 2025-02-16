
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Settings, BookOpen, Shield, AlertCircle, FileText, LucideIcon, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarTrigger
} from "@/components/ui/sidebar";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

export const Sidebar = () => {
  const location = useLocation();
  
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: CheckSquare, label: "Compliance Checklist", path: "/compliance-checklist" },
    { icon: Shield, label: "Risk Assessment", path: "/risk-assessment" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: BookOpen, label: "Documentation", path: "/documentation" },
    { icon: AlertCircle, label: "Alerts", path: "/alerts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      <SidebarTrigger>
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Menu className="h-5 w-5" />
        </div>
      </SidebarTrigger>
      
      <SidebarPrimitive className="border-r border-slate-200 bg-white shadow-sm">
        <SidebarContent>
          <div className="p-6">
            <h2 className="text-xl font-serif text-slate-900">Compliance Hub</h2>
          </div>
          <div className="space-y-1 p-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors font-serif",
                  location.pathname === item.path
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </SidebarContent>
      </SidebarPrimitive>
    </>
  );
};
