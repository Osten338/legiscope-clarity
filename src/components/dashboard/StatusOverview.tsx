
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";

const statusIcons = {
  compliant: { icon: CheckCircle2, class: "text-green-500" },
  in_progress: { icon: Clock, class: "text-amber-500" },
  not_compliant: { icon: AlertTriangle, class: "text-red-500" },
  under_review: { icon: HelpCircle, class: "text-blue-500" },
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    compliant: "Compliant",
    in_progress: "In Progress",
    not_compliant: "Not Compliant",
    under_review: "Under Review",
  };
  return statusMap[status] || status;
};

interface StatusOverviewProps {
  savedRegulations: any[];
}

export const StatusOverview = ({ savedRegulations }: StatusOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Object.entries(statusIcons).map(([status, { icon: Icon, class: colorClass }]) => {
        const count = savedRegulations?.filter(reg => reg.status === status).length || 0;
        return (
          <Card key={status} className="bg-white border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Icon className={cn("w-4 h-4", colorClass)} />
                <span className="font-medium text-slate-600">{getStatusText(status)}</span>
              </CardDescription>
              <CardTitle className="text-2xl font-serif">{count}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
