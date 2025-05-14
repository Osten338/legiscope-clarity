
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { SavedRegulation } from "./types";
import { DataTable } from "./DataTable";

interface UrgentTasksTableProps {
  savedRegulations: SavedRegulation[];
}

export const UrgentTasksTable = ({ savedRegulations }: UrgentTasksTableProps) => {
  // Filter for regulations that have upcoming deadlines and are not compliant yet
  const urgentTasks = savedRegulations
    .filter(reg => 
      reg.next_review_date && 
      new Date(reg.next_review_date) > new Date() && 
      reg.status !== "compliant"
    )
    .sort((a, b) => {
      // Sort by closest deadline first
      if (a.next_review_date && b.next_review_date) {
        return new Date(a.next_review_date).getTime() - new Date(b.next_review_date).getTime();
      }
      return 0;
    });

  return (
    <Card className="border shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-xl font-semibold">Urgent Tasks</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <DataTable savedRegulations={urgentTasks} />
      </CardContent>
    </Card>
  );
};
