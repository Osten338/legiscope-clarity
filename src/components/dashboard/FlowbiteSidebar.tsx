
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart, FileText, Bell, CheckSquare, Bot } from 'lucide-react';

// Import the specific components from flowbite-react instead of the top-level Sidebar
import { Sidebar } from 'flowbite-react';

export function FlowbiteSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar aria-label="Dashboard sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item 
            href="#"
            icon={LayoutDashboard}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={BarChart}
            onClick={() => navigate('/risk-assessment')}
          >
            Risk Assessment
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={FileText}
            onClick={() => navigate('/documents')}
          >
            Documents
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={Bell}
            onClick={() => navigate('/alerts')}
          >
            Alerts
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={CheckSquare}
            onClick={() => navigate('/compliance-checklist')}
          >
            Compliance
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={FileText}
            onClick={() => navigate('/documentation')}
          >
            Documentation
          </Sidebar.Item>
          <Sidebar.Item 
            href="#"
            icon={Bot}
            onClick={() => navigate('/compliance-chat')}
          >
            AI Assistant
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
