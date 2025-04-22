
import { BarChart, Bell, CheckSquare, FileText, LayoutDashboard, Bot } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const SidebarNavigation = () => {
  const location = useLocation();
  const { open, animate } = useSidebar();

  const navigationItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 text-neutral-500" />, label: "Dashboard" },
    { href: "/risk-assessment", icon: <BarChart className="h-5 w-5 text-neutral-500" />, label: "Risk Assessment" },
    { href: "/documents", icon: <FileText className="h-5 w-5 text-neutral-500" />, label: "Documents" },
    { href: "/alerts", icon: <Bell className="h-5 w-5 text-neutral-500" />, label: "Alerts" },
    { href: "/compliance-checklist", icon: <CheckSquare className="h-5 w-5 text-neutral-500" />, label: "Compliance Checklist" },
    { href: "/documentation", icon: <FileText className="h-5 w-5 text-neutral-500" />, label: "Documentation" },
    { href: "/compliance-chat", icon: <Bot className="h-5 w-5 text-neutral-500" />, label: "Compliance Chat" },
  ];

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigationItems.map((item) => (
        <li key={item.href}>
          <Link
            to={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md p-2",
              location.pathname === item.href
                ? "bg-neutral-200 text-brand"
                : "text-neutral-700 hover:bg-neutral-200/50"
            )}
          >
            {item.icon}
            <motion.span
              animate={{
                display: animate ? (open ? "inline-block" : "none") : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="text-sm"
            >
              {item.label}
            </motion.span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
