
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import ComplianceOverviewPage from '@/pages/ComplianceOverview';
import DocumentsPage from '@/pages/Documents';
import SettingsPage from '@/pages/Settings';
import AlertsPage from '@/pages/Alerts';
import ComplianceChecklistPage from '@/pages/ComplianceChecklist';
import DocumentationPage from '@/pages/Documentation';
import ComplianceChatPage from '@/pages/ComplianceChat';
import RiskAssessmentPage from '@/pages/RiskAssessment';
import Index from '@/pages/Index';
import { AppSidebar } from '@/components/dashboard/new-ui/AppSidebar';
import ComplianceCalendar from '@/pages/ComplianceCalendar';
import Contracts from '@/pages/Contracts';
import Regulations from '@/pages/Regulations';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background antialiased">
        <AppSidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compliance-overview" element={<ComplianceOverviewPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/compliance-checklist" element={<ComplianceChecklistPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/compliance-chat" element={<ComplianceChatPage />} />
            <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
            <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
            <Route path="/repository/contracts" element={<Contracts />} />
            <Route path="/repository/regulations" element={<Regulations />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
