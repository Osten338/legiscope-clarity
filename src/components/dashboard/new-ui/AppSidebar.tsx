import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar-new";
import {
  Home,
  FileText,
  FileSearch,
  Bell,
  Bot,
  Settings,
  Calendar,
  LayoutDashboard,
  Clipboard
} from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: <Bell className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Legislation",
    href: "/legislation",
    icon: <FileSearch className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Documentation",
    href: "/documentation",
    icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "AI Assistant",
    href: "/compliance-chat",
    icon: <Bot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Compliance Overview",
    href: "/compliance-overview",
    icon: <Clipboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Compliance Calendar",
    href: "/compliance-calendar",
    icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
];

const Logo = () => {
  return (
    <Link
      to="/dashboard"
      className="font-normal flex space-x-2 items-center text-lg text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre text-lg">
        Compliance Hub
      </span>
    </Link>
  );
};

export function AppSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(true);
  
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                link={{
                  ...link,
                  href: link.href,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Settings",
              href: "/settings",
              icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
