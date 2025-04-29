
import { useEffect } from "react";
import { MenuBarLayout } from "@/components/dashboard/new-ui";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useDashboardData } from "@/components/dashboard/useDashboardData";

const Dashboard = () => {
  const { savedRegulations, isLoading, refetch } = useDashboardData();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const upcomingDeadlines = savedRegulations?.filter(reg => 
    reg.next_review_date && new Date(reg.next_review_date) > new Date()
  ).length || 0;

  const completedRegulations = savedRegulations?.filter(reg => 
    reg.status === "completed"
  ).length || 0;

  const totalRegulations = savedRegulations?.length || 0;

  return (
    <MenuBarLayout>
      <div className="flex flex-col w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-5xl">
          <WelcomeSection />
          
          <StatsOverview 
            totalRegulations={totalRegulations}
            completedRegulations={completedRegulations}
            upcomingDeadlines={upcomingDeadlines}
          />

          <QuickActions />
        </div>
      </div>
    </MenuBarLayout>
  );
};

export default Dashboard;
