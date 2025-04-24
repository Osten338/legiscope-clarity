
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from 'flowbite-react';
import { LayoutDashboard, BarChart, FileText, Bell, CheckSquare, Bot } from 'lucide-react';

// Define the navigation items
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BarChart, label: "Risk Assessment", path: "/risk-assessment" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
  { icon: CheckSquare, label: "Compliance", path: "/compliance-checklist" },
  { icon: FileText, label: "Documentation", path: "/documentation" },
  { icon: Bot, label: "AI Assistant", path: "/compliance-chat" },
];

export function FlowbiteSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar aria-label="Dashboard sidebar" className="w-full h-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {navItems.map((item) => (
            <Sidebar.Item 
              key={item.path}
              icon={() => <item.icon className="w-5 h-5" />}
              onClick={() => handleNavigation(item.path)}
              active={location.pathname === item.path || 
                (item.path !== '/dashboard' && location.pathname.includes(item.path))}
              className="cursor-pointer"
            >
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
