
import { useState, useEffect } from "react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { UrgentTasksTable } from "@/components/dashboard/UrgentTasksTable";
import { ChatWidget } from "@/components/compliance/ChatWidget";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { savedRegulations, isLoading: dataLoading } = useDashboardData();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [renderStage, setRenderStage] = useState<'initial' | 'loading' | 'ready'>('initial');
  
  // Track the render stages and provide a smoother loading experience
  useEffect(() => {
    // Initial stage - show quick loading screen
    const initialTimer = setTimeout(() => {
      setIsInitialLoad(false);
      
      // If still loading, move to loading stage
      if (authLoading || dataLoading || !isAuthenticated || !user) {
        setRenderStage('loading');
      } else {
        setRenderStage('ready');
      }
    }, 400); // Short delay for initial render
    
    // If still in loading stage after 2 seconds, show proper loading UI
    const loadingTimer = setTimeout(() => {
      if (renderStage !== 'ready') {
        setRenderStage('loading');
      }
    }, 2000);
    
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(loadingTimer);
    };
  }, [authLoading, dataLoading, isAuthenticated, user, renderStage]);
  
  // When auth and data loading are complete, move to ready stage
  useEffect(() => {
    if (!authLoading && !dataLoading && isAuthenticated && user) {
      setRenderStage('ready');
    }
  }, [authLoading, dataLoading, isAuthenticated, user]);

  // Calculate stats only if data is available
  const upcomingDeadlines = savedRegulations?.filter(reg => 
    reg.next_review_date && new Date(reg.next_review_date) > new Date()
  ).length || 0;

  const completedRegulations = savedRegulations?.filter(reg => 
    reg.status === "compliant"
  ).length || 0;

  const totalRegulations = savedRegulations?.length || 0;
  
  // Show loading state if not ready yet
  if (renderStage !== 'ready') {
    return (
      <TopbarLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
          {renderStage === 'loading' && process.env.NODE_ENV === 'development' && (
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Auth state: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
              <p>User: {user ? 'Available' : 'Not available'}</p>
              <p>Auth loading: {authLoading ? 'Yes' : 'No'}</p>
              <p>Data loading: {dataLoading ? 'Yes' : 'No'}</p>
            </div>
          )}
        </div>
      </TopbarLayout>
    );
  }

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
