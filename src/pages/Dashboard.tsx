
import { useState, useEffect } from "react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { UrgentTasksTable } from "@/components/dashboard/UrgentTasksTable";
import { ChatWidget } from "@/components/compliance/ChatWidget";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [initState, setInitState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [hasLocalAuth, setHasLocalAuth] = useState(false);
  const navigate = useNavigate();
  
  // Check local storage for authentication indicators
  useEffect(() => {
    // Show fast feedback if we have local auth indicators
    const hasStoredAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    
    if (hasStoredAuth) {
      setHasLocalAuth(true);
      // Still proceed with full loading sequence
      setInitState('ready');
    } else {
      // Short delay to avoid flash
      const timer = setTimeout(() => {
        setInitState('ready');
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Early feedback for users with cached auth
  if (initState === 'loading' && !hasLocalAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return <DashboardContent />;
};

// Component for authenticated content
const DashboardContent = () => {
  // Track component-specific load state for smoother transitions
  const [renderStage, setRenderStage] = useState<'initial' | 'loading' | 'ready'>('initial');
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const navigate = useNavigate();
  
  // Get dashboard data (no direct auth.context dependency)
  const { 
    savedRegulations, 
    isLoading: dataLoading, 
    authError, 
    isInitializing 
  } = useDashboardData();
  
  // Track render stages for smoother loading experience
  useEffect(() => {
    if (isInitializing) {
      setRenderStage('initial');
      return;
    }
    
    // Initial stage - show quick loading screen
    const initialTimer = setTimeout(() => {
      if (dataLoading) {
        setRenderStage('loading');
      } else {
        setRenderStage('ready');
      }
    }, 400);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, [dataLoading, isInitializing]);

  // Auth error recovery logic
  const handleRetry = () => {
    setRecoveryAttempts(prev => prev + 1);
    
    // After several retries, force a redirect
    if (recoveryAttempts >= 2) {
      // Clear any auth state that may be causing problems
      sessionStorage.removeItem('auth:userId');
      sessionStorage.removeItem('auth:isAuthenticated');
      sessionStorage.removeItem('auth:lastChecked');
      sessionStorage.setItem('auth:breakingLoop', 'true');
      
      // Navigate to auth
      navigate('/auth');
    } else {
      // Just reload the page
      window.location.reload();
    }
  };

  // If there's an auth error, show a helpful error message
  if (authError) {
    return (
      <TopbarLayout>
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <div className="max-w-md text-center">
            <div className="text-red-500 text-2xl mb-4">Authentication Error</div>
            <p className="text-gray-700 mb-4">Unable to verify your authentication status.</p>
            <p className="text-sm text-gray-500 mb-4">{authError.message}</p>
            
            <div className="space-y-2">
              <Button 
                className="w-full"
                onClick={() => navigate('/auth', { replace: true })}
              >
                Go to Login
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRetry}
              >
                Retry {recoveryAttempts > 0 ? `(${recoveryAttempts})` : ''}
              </Button>
            </div>
          </div>
        </div>
      </TopbarLayout>
    );
  }
  
  // Show loading state if not ready yet
  if (renderStage !== 'ready') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        {renderStage === 'loading' && process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Data loading: {dataLoading ? 'Yes' : 'No'}</p>
            <p>Auth error: {authError ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    );
  }

  // Calculate stats only if data is available
  const upcomingDeadlines = savedRegulations?.filter(reg => 
    reg.next_review_date && new Date(reg.next_review_date) > new Date()
  ).length || 0;

  const completedRegulations = savedRegulations?.filter(reg => 
    reg.status === "compliant"
  ).length || 0;

  const totalRegulations = savedRegulations?.length || 0;

  return (
    <TopbarLayout>
      <div className="flex flex-col">
        <DashboardHeader />
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-6 pb-10 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Stats & Status */}
            <div className="lg:col-span-2 space-y-6">
              <StatsOverview 
                totalRegulations={totalRegulations}
                completedRegulations={completedRegulations}
                upcomingDeadlines={upcomingDeadlines}
              />
              
              <StatusOverview savedRegulations={savedRegulations || []} />
            </div>
            
            {/* Right column - Compliance chart */}
            <div>
              <ComplianceChart 
                completedRegulations={completedRegulations} 
                totalRegulations={totalRegulations}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <UrgentTasksTable savedRegulations={savedRegulations || []} />
          </div>
        </div>

        {/* Chat Widget */}
        <ChatWidget />
      </div>
    </TopbarLayout>
  );
};

export default Dashboard;
