
import { useState, useEffect } from "react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { UrgentTasksTable } from "@/components/dashboard/UrgentTasksTable";
import { ChatWidget } from "@/components/compliance/ChatWidget";

const Dashboard = () => {
  // Track initialization state
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  
  // Safely initialize the component without directly using useAuth
  useEffect(() => {
    // Short delay to ensure AuthProvider is fully mounted
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 300); // Increased delay to ensure auth is ready
    
    return () => clearTimeout(timer);
  }, []);

  // Render content that doesn't depend on auth context until we're ready
  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Initializing dashboard...</p>
      </div>
    );
  }

  // Now we can safely render the content that depends on auth context
  return <DashboardContent />;
};

// Extract the authenticated content to a separate component
// This ensures useAuth() is only called when we're sure the context is available
const DashboardContent = () => {
  const [renderStage, setRenderStage] = useState<'initial' | 'loading' | 'ready'>('initial');
  
  // Get dashboard data (which handles auth internally)
  const { savedRegulations, isLoading: dataLoading, authError } = useDashboardData();
  
  // Track the render stages and provide a smoother loading experience
  useEffect(() => {
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
  }, [dataLoading]);

  // If there's an auth error, show a more helpful error message
  if (authError) {
    return (
      <TopbarLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-red-500 text-2xl mb-4">Authentication Error</div>
          <p className="text-gray-700 mb-4">Unable to verify your authentication status.</p>
          <p className="text-sm text-gray-500 mb-4">{authError.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => window.location.href = "/auth"}
          >
            Go to Login
          </button>
          <button
            className="mt-2 text-sm text-primary hover:underline"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
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
