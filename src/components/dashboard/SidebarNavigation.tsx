
import { BarChart, Bell, CheckSquare, FileText, LayoutDashboard, Bot, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { SidebarNavItem } from "./SidebarNavItem";

export const SidebarNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/risk-assessment", icon: BarChart, label: "Risk Assessment" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/alerts", icon: Bell, label: "Alerts" },
    { to: "/compliance-checklist", icon: CheckSquare, label: "Compliance Checklist" },
    { to: "/documentation", icon: FileText, label: "Documentation" },
    { to: "/compliance-chat", icon: Bot, label: "Compliance Chat" },
  ];

  return (
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
  );
};
