
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Settings, BookOpen, Shield, AlertCircle, FileText, LucideIcon, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarTrigger,
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
      <SidebarPrimitive>
        <SidebarContent className="border-r border-slate-200 bg-white shadow-sm h-full transition-all duration-300 flex flex-col">
          <SidebarTrigger className="self-end p-2 hover:bg-slate-100 rounded-lg mt-2 mr-2">
            <ChevronRight className="h-5 w-5 text-slate-500" />
          </SidebarTrigger>
          
          <div className="p-4">
            <h2 className="text-xl font-serif text-slate-900 truncate">Compliance Hub</h2>
          </div>
          
          <div className="space-y-1 p-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors font-serif",
                  "hover:bg-slate-50 hover:text-slate-900",
                  location.pathname === item.path
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </SidebarContent>
      </SidebarPrimitive>
    </>
  );
};
