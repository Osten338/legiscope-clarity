import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeProvider } from "next-themes";
import LoadingScreen from "./components/LoadingScreen";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import Assessment from "./pages/Assessment";
import Analysis from "./pages/Analysis";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Legislation from "./pages/Legislation";
import ComplianceChecklist from "./pages/ComplianceChecklist";
import RiskAssessment from "./pages/RiskAssessment";
import RiskAssessmentLanding from "./pages/RiskAssessmentLanding";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Documents from "./pages/Documents";
import ComplianceChat from "./pages/ComplianceChat";
import AdminTools from "./pages/AdminTools";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      meta: {
        onError: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          console.error("Mutation error:", error);
        }
      }
    }
  },
});

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth error:", error);
          setAuthError(error.message);
        }
        
        setSession(session);
        setLoading(false);
        
        setTimeout(() => setAppInitialized(true), 1500);
      } catch (err) {
        console.error("Failed to initialize session:", err);
        setAuthError("Failed to connect to authentication service");
        setLoading(false);
        setAppInitialized(true);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!appInitialized) {
    return <LoadingScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 border border-red-100">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Connection Error</h2>
          <p className="text-slate-700 mb-4">
            We're having trouble connecting to our services. This could be due to:
          </p>
          <ul className="list-disc pl-5 mb-6 text-slate-600 space-y-1">
            <li>Network connectivity issues</li>
            <li>Authentication service unavailability</li>
            <li>Browser privacy settings blocking required connections</li>
          </ul>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-sage-600 text-white py-2 px-4 rounded-md hover:bg-sage-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<Index />} />
                  <Route
                    path="/assessment"
                    element={
                      session ? (
                        <Assessment />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/analysis/:id"
                    element={
                      session ? (
                        <Analysis />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      session ? (
                        <Dashboard />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/documentation"
                    element={
                      session ? (
                        <Documentation />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/documents"
                    element={
                      session ? (
                        <Documents />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/legislation/:id"
                    element={
                      session ? (
                        <Legislation />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/compliance-checklist"
                    element={
                      session ? (
                        <ComplianceChecklist />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/compliance-chat"
                    element={
                      session ? (
                        <ComplianceChat />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/risk-assessment"
                    element={
                      session ? (
                        <RiskAssessmentLanding />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/risk-assessment/:view"
                    element={
                      session ? (
                        <RiskAssessment />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      session ? (
                        <Alerts />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      session ? (
                        <Settings />
                      ) : (
                        <Navigate to="/auth" replace={true} />
                      )
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      !session ? (
                        <Auth />
                      ) : (
                        <Navigate to="/dashboard" replace={true} />
                      )
                    }
                  />
                  <Route path="/admin" element={<AdminTools />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
