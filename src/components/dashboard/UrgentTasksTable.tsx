
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavedRegulation } from "./types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
    })
    .slice(0, 5); // Only show top 5 most urgent tasks

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      in_progress: "bg-amber-500 hover:bg-amber-600",
      not_compliant: "bg-red-500 hover:bg-red-600",
      under_review: "bg-blue-500 hover:bg-blue-600",
    };

    const statusText = status.replace(/_/g, ' ');
    
    return (
      <Badge className={`${statusColors[status] || "bg-gray-500"} text-white capitalize`}>
        {statusText}
      </Badge>
    );
  };

  const getDaysRemaining = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-xl font-semibold">Urgent Tasks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {urgentTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Regulation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urgentTasks.map((task) => {
                const daysRemaining = task.next_review_date 
                  ? getDaysRemaining(task.next_review_date)
                  : 0;
                
                return (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">
                      {task.regulations?.name}
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>
                      {task.next_review_date && format(new Date(task.next_review_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className={`font-semibold ${daysRemaining <= 7 ? 'text-red-500' : ''}`}>
                          {daysRemaining}
                        </span>
                        <span className="text-muted-foreground">days</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">No urgent tasks found</h3>
            <p className="text-muted-foreground mt-1">
              All your regulations are either compliant or have no upcoming deadlines.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
