
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Settings,
  BookOpen,
  Shield,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export const Sidebar = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FileText, label: "Legislation" },
    { icon: CheckSquare, label: "Compliance Checklist" },
    { icon: Shield, label: "Risk Assessment" },
    { icon: BookOpen, label: "Documentation" },
    { icon: AlertCircle, label: "Alerts" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-slate-800">Compliance Hub</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="space-y-1 p-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                item.active
                  ? "bg-sage-100 text-sage-900"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
