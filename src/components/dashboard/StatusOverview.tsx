
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusCards = {
  compliant: {
    icon: CheckCircle2,
    class: "text-brand",
    gradient: "bg-card/80 backdrop-blur-md",
    badge: "bg-emerald-500"
  },
  in_progress: {
    icon: Clock,
    class: "text-amber-500",
    gradient: "bg-card/80 backdrop-blur-md",
    badge: "bg-amber-500"
  },
  not_compliant: {
    icon: AlertTriangle,
    class: "text-red-500",
    gradient: "bg-card/80 backdrop-blur-md",
    badge: "bg-red-500"
  },
  under_review: {
    icon: HelpCircle,
    class: "text-blue-500",
    gradient: "bg-card/80 backdrop-blur-md",
    badge: "bg-blue-500"
  }
};

const getStatusText = (status: string) => {
  const statusMap: {
    [key: string]: string;
  } = {
    compliant: "Compliant",
    in_progress: "In Progress",
    not_compliant: "Not Compliant",
    under_review: "Under Review"
  };
  return statusMap[status] || status;
};

interface StatusOverviewProps {
  savedRegulations: any[];
}

export const StatusOverview = ({ savedRegulations }: StatusOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {Object.entries(statusCards).map(([status, { icon: Icon, class: colorClass, gradient, badge }], index) => {
        const count = savedRegulations?.filter(reg => reg.status === status).length || 0;
        return (
          <Card 
            key={status} 
            className={cn("border-neutral-200 shadow-sm", gradient, "animate-appear")}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardDescription className="flex items-center gap-2 text-sm">
                  <Badge className={cn("w-2 h-2 p-0 rounded-full", badge)} />
                  <span className="font-medium text-neutral-600">{getStatusText(status)}</span>
                </CardDescription>
                <Icon className={cn("w-5 h-5", colorClass)} />
              </div>
              <CardTitle className="text-2xl font-medium text-neutral-900">{count}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
