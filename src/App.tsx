
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Analysis from "./pages/Analysis";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComplianceChecklist from "./pages/ComplianceChecklist";
import ComplianceOverviewPage from "./pages/ComplianceOverview";
import RegulationsAdmin from "./pages/Admin/RegulationsAdmin";
import ChecklistEditor from "./pages/Admin/ChecklistEditor";
import GdprPreset from "./pages/Admin/GdprPreset";
import NoMatch from "./pages/NoMatch";
import Alerts from "./pages/Alerts";
import LegislationPage from "./pages/LegislationPage";
import Documentation from "./pages/Documentation";
import ComplianceChat from "./pages/ComplianceChat";
import ComplianceCalendar from "./pages/ComplianceCalendar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/ui/use-theme";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/legislation" element={<LegislationPage />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/compliance-chat" element={<ComplianceChat />} />
              <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
              <Route path="/compliance-overview" element={<ComplianceOverviewPage />} />
              <Route path="/compliance-checklist" element={<ComplianceChecklist />} />
              
              {/* Admin routes */}
              <Route path="/admin/regulations" element={<RegulationsAdmin />} />
              <Route path="/admin/regulations/:id/checklist" element={<ChecklistEditor />} />
              <Route path="/admin/regulations/gdpr-preset" element={<GdprPreset />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
          <Toaster />
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
