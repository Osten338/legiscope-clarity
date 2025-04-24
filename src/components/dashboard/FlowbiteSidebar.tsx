
import { Sidebar } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart, FileText, Bell, CheckSquare, Bot } from 'lucide-react';

export function FlowbiteSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar aria-label="Dashboard sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item 
            icon={() => <LayoutDashboard className="w-5 h-5" />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <BarChart className="w-5 h-5" />}
            onClick={() => navigate('/risk-assessment')}
          >
            Risk Assessment
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <FileText className="w-5 h-5" />}
            onClick={() => navigate('/documents')}
          >
            Documents
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <Bell className="w-5 h-5" />}
            onClick={() => navigate('/alerts')}
          >
            Alerts
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <CheckSquare className="w-5 h-5" />}
            onClick={() => navigate('/compliance-checklist')}
          >
            Compliance
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <FileText className="w-5 h-5" />}
            onClick={() => navigate('/documentation')}
          >
            Documentation
          </Sidebar.Item>
          <Sidebar.Item 
            icon={() => <Bot className="w-5 h-5" />}
            onClick={() => navigate('/compliance-chat')}
          >
            AI Assistant
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
