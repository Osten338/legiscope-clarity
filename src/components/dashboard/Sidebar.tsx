
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  CheckSquare,
  Settings,
  BookOpen,
  Shield,
  AlertCircle,
  FileText,
  LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

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
    <div className="w-64 bg-gradient-to-b from-[#F6F6F7] to-white border-r border-[#FDE1D3] shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-serif text-[#403E43]">Compliance Hub</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="space-y-1 p-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-[#FDE1D3] text-[#403E43]"
                  : "text-[#8A898C] hover:bg-[#F1F0FB] hover:text-[#403E43]"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
