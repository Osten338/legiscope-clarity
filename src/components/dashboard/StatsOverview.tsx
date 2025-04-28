
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
    </div>
  );
};

