
import { BarChart, Bell, CheckSquare, FileText, LayoutDashboard, Bot, Settings, Clipboard } from "lucide-react";
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
    { to: "/compliance-overview", icon: Clipboard, label: "Compliance Overview" },
    { to: "/documentation", icon: FileText, label: "Documentation" },
    { to: "/compliance-chat", icon: Bot, label: "AI Assistant" },
  ];

  return (
    <ul role="list" className="-mx-1 space-y-0.5 py-2">
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
