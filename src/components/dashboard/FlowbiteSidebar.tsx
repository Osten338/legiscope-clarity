
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart, FileText, Bell, CheckSquare, Bot } from 'lucide-react';
import { Sidebar } from 'flowbite-react';
import { type CustomFlowbiteTheme } from 'flowbite-react';

// Create simple nav items array for cleaner rendering
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

  return (
    <Sidebar aria-label="Dashboard sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {navItems.map((item) => (
            <Sidebar.Item 
              key={item.path}
              href="#"
              icon={item.icon}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
