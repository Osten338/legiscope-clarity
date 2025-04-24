
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
      <div className="py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.includes(item.path));
            
            return (
              <li key={item.path}>
                <div 
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center w-full p-2 text-base text-gray-900 rounded-lg cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 transition duration-75 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  <span className="ml-3">{item.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Sidebar>
  );
}
