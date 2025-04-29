
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
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8 ml-[max(2rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Regulations</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRegulations}</div>
          <p className="text-xs text-muted-foreground">Regulations tracked</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedRegulations}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((completedRegulations / totalRegulations) * 100) || 0}% completion rate
          </p>
        </CardContent>
      </Card>
      <Card>
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
