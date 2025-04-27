
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  regulation: string;
  description: string;
  dueDate: string;
}

interface ComplianceTasksProps {
  tasks: Task[];
}

export const ComplianceTasks = ({ tasks }: ComplianceTasksProps) => {
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between mb-6">
          <CardTitle className="text-xl font-medium">Pending Tasks</CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarCheck className="h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </CardHeader>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {task.regulation}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
              <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <p>No pending tasks</p>
          </div>
        )}
      </div>
    </Card>
  );
};
