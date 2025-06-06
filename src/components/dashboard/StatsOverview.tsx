
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, Clock } from "lucide-react";

interface StatsOverviewProps {
  totalRegulations: number;
  completedRegulations: number;
  upcomingDeadlines: number;
}

export const StatsOverview = ({ 
  totalRegulations, 
  completedRegulations, 
  upcomingDeadlines 
}: StatsOverviewProps) => {
  const completionRate = totalRegulations > 0 
    ? Math.round((completedRegulations / totalRegulations) * 100) 
    : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Regulations</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRegulations}</div>
          <p className="text-xs text-muted-foreground">Regulations tracked</p>
        </CardContent>
      </Card>
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedRegulations}</div>
          <p className="text-xs text-muted-foreground">
            {completionRate}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Next 30 days</p>
        </CardContent>
      </Card>
    </div>
  );
};
