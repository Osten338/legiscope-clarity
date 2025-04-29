
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, FileText, MessageSquare, Calendar } from "lucide-react";

export const QuickActions = () => {
  return (
    <Card className="mb-8 ml-[max(2rem,calc(50vw-700px))] 2xl:ml-[max(8rem,calc(50vw-700px))]">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and actions to help manage your compliance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <PlusCircle className="h-5 w-5" />
            <span>Add Regulation</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <FileText className="h-5 w-5" />
            <span>Generate Report</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <MessageSquare className="h-5 w-5" />
            <span>AI Assistant</span>
          </Button>
          <Button variant="outline" className="h-24 flex flex-col gap-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Review</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
