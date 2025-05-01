
import { useEffect } from "react";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { useDashboardData } from "@/components/dashboard/useDashboardData";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { UrgentTasksTable } from "@/components/dashboard/UrgentTasksTable";

const Dashboard = () => {
  const { savedRegulations, isLoading, refetch } = useDashboardData();

  useEffect(() => {
    refetch();
  }, [refetch]);

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
          
          <div className="mt-8">
            <UrgentTasksTable savedRegulations={savedRegulations || []} />
          </div>
        </div>
      </div>
    </TopbarLayout>
  );
};

export default Dashboard;
