
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusCards = {
  compliant: {
    icon: CheckCircle2,
    class: "text-emerald-500",
    gradient: "bg-emerald-500/10",
    badge: "bg-emerald-500",
    label: "Compliant"
  },
  in_progress: {
    icon: Clock,
    class: "text-amber-500",
    gradient: "bg-amber-500/10",
    badge: "bg-amber-500",
    label: "In Progress"
  },
  not_compliant: {
    icon: AlertTriangle,
    class: "text-red-500",
    gradient: "bg-red-500/10",
    badge: "bg-red-500",
    label: "Not Compliant"
  },
  under_review: {
    icon: HelpCircle,
    class: "text-blue-500",
    gradient: "bg-blue-500/10",
    badge: "bg-blue-500",
    label: "Under Review"
  }
};

interface StatusOverviewProps {
  savedRegulations: any[];
}

export const StatusOverview = ({ savedRegulations }: StatusOverviewProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {Object.entries(statusCards).map(([status, { icon: Icon, class: colorClass, gradient, badge, label }], index) => {
        const count = savedRegulations?.filter(reg => reg.status === status).length || 0;
        return (
          <Card 
            key={status} 
            className={cn("border-border", gradient, "animate-appear")}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-2 p-3 md:p-4">
              <div className="flex justify-between items-center">
                <CardDescription className="flex items-center gap-1.5 text-xs">
                  <Badge className={cn("w-1.5 h-1.5 p-0 rounded-full", badge)} />
                  <span className="font-medium">{label}</span>
                </CardDescription>
                <Icon className={cn("w-4 h-4", colorClass)} />
              </div>
              <CardTitle className="text-lg font-medium mono">{count}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
