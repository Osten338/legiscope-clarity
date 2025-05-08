
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

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Login />} />
          <Route path="/analysis/:id" element={<Analysis />} />
          
          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Dashboard />} />
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
  );
}

export default App;
