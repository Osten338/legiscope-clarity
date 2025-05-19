
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import AuthGuard from "@/components/auth/AuthGuard";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Dashboard from "@/pages/Dashboard";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import Assessment from "@/pages/Assessment"; 
import ComplianceOverview from "@/pages/ComplianceOverview";
import ComplianceChat from "@/pages/ComplianceChat";
import Documentation from "@/pages/Documentation";
import Alerts from "@/pages/Alerts";
import Documents from "@/pages/Documents";
import Legislation from "@/pages/Legislation";
import Settings from "@/pages/Settings";
import ComplianceCalendar from "@/pages/ComplianceCalendar";
import AdminTools from "@/pages/AdminTools";
import Pricing from "@/pages/Pricing";
import ComplianceChecklist from "@/pages/ComplianceChecklist";
import RegulationsAdmin from "@/pages/Admin/RegulationsAdmin";
import ChecklistEditor from "@/pages/Admin/ChecklistEditor";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  // Apply saved theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/documentation" element={<Documentation />} />
          
          {/* Protected routes that require authentication */}
          <Route element={<AuthGuard />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/compliance-overview" element={<ComplianceOverview />} />
            <Route path="/compliance-chat" element={<ComplianceChat />} />
            <Route path="/compliance-checklist" element={<ComplianceChecklist />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/legislation" element={<Legislation />} />
            <Route path="/compliance-calendar" element={<ComplianceCalendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-tools" element={<AdminTools />} />
            <Route path="/admin/regulations" element={<RegulationsAdmin />} />
            <Route path="/admin/regulations/:regulationId/checklist" element={<ChecklistEditor />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
