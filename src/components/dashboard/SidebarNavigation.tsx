
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  FileText, 
  Calendar, 
  Archive, 
  GraduationCap, 
  BarChart 
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/legislation", icon: BookOpen, label: "Regulations" },
    { to: "/compliance-checklist", icon: ClipboardList, label: "Compliance" },
    { to: "/documents", icon: FileText, label: "Reports" },
    { to: "/tasks", icon: Calendar, label: "Tasks" },
  ];

  const organizationItems = [
    { to: "/audit-schedule", icon: Calendar, label: "Audit Scheduling" },
    { to: "/document-vault", icon: Archive, label: "Document Vault" },
    { to: "/training", icon: GraduationCap, label: "Training Library" },
    { to: "/risk-assessment", icon: BarChart, label: "Analytics" },
  ];

  return (
    <div className="space-y-8">
      <ul role="list" className="-mx-2 space-y-1">
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            isActive={
              item.to === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.includes(item.to)
            }
          >
            {item.label}
          </SidebarNavItem>
        ))}
      </ul>
      
      <div>
        <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          SPIENCS
        </h3>
        <ul role="list" className="-mx-2 mt-2 space-y-1">
          {organizationItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              isActive={location.pathname.includes(item.to)}
            >
              {item.label}
            </SidebarNavItem>
          ))}
        </ul>
      </div>
    </div>
  );
};
