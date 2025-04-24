
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart, FileText, Bell, CheckSquare, Bot } from 'lucide-react';

// Since we're having issues with the Flowbite Sidebar component,
// let's create our own sidebar component using Tailwind CSS
// which will give us more control

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
    <div className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ms-3">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
