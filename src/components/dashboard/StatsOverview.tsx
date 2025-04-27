
import { Card } from "@/components/ui/card";
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
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="p-4 flex items-center space-x-4">
        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Activity className="h-4 w-4 text-blue-700" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Regulations</p>
          <h3 className="text-2xl font-bold">{totalRegulations}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-700" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Completed</p>
          <h3 className="text-2xl font-bold">{completedRegulations}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center space-x-4">
        <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
          <Clock className="h-4 w-4 text-orange-700" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
          <h3 className="text-2xl font-bold">{upcomingDeadlines}</h3>
        </div>
      </Card>
    </div>
  );
};
