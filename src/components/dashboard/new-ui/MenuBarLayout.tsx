
import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuBar } from "@/components/ui/menu-bar";
import {
  LayoutDashboard,
  FileSearch,
  FileText,
  Bell,
  Bot,
  Settings,
  Calendar,
  Clipboard
} from "lucide-react";

interface MenuBarLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: Bell,
    label: "Alerts",
    href: "/alerts",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: FileSearch,
    label: "Legislation",
    href: "/legislation",
    gradient:
      "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.06) 50%, rgba(109,40,217,0) 100%)",
    iconColor: "text-purple-500",
  },
  {
    icon: FileText,
    label: "Documentation",
    href: "/documentation",
    gradient:
      "radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.06) 50%, rgba(4,120,87,0) 100%)",
    iconColor: "text-emerald-500",
  },
  {
    icon: Bot,
    label: "AI Assistant",
    href: "/compliance-chat",
    gradient:
      "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500",
  },
  {
    icon: Clipboard,
    label: "Compliance",
    href: "/compliance-overview",
    gradient:
      "radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.06) 50%, rgba(180,83,9,0) 100%)",
    iconColor: "text-amber-500",
  },
  {
    icon: Calendar,
    label: "Calendar",
    href: "/compliance-calendar",
    gradient:
      "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(8,145,178,0.06) 50%, rgba(14,116,144,0) 100%)",
    iconColor: "text-cyan-500",
  },
];

export function MenuBarLayout({ children }: MenuBarLayoutProps) {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  
  useEffect(() => {
    // Set active menu item based on current path
    const currentPath = location.pathname;
    const currentItem = menuItems.find(item => 
      currentPath === item.href || currentPath.startsWith(item.href + "/")
    );
    
    if (currentItem) {
      setActiveItem(currentItem.label);
    }
  }, [location]);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    const item = menuItems.find(item => item.label === label);
    if (item) {
      window.location.href = item.href;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col w-full bg-background overflow-hidden">
      <header className="flex justify-center py-4 border-b">
        <MenuBar 
          items={menuItems} 
          activeItem={activeItem} 
          onItemClick={handleItemClick} 
          className="w-auto"
        />
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
