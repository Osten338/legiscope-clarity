
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";

const statusCards = {
  compliant: {
    icon: CheckCircle2,
    class: "text-emerald-600",
    gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100"
  },
  in_progress: {
    icon: Clock,
    class: "text-amber-600",
    gradient: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100"
  },
  not_compliant: {
    icon: AlertTriangle,
    class: "text-red-600",
    gradient: "bg-gradient-to-br from-red-50 to-red-100/50 border-red-100"
  },
  under_review: {
    icon: HelpCircle,
    class: "text-blue-600",
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100"
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
      {Object.entries(statusCards).map(([status, { icon: Icon, class: colorClass, gradient }]) => {
        const count = savedRegulations?.filter(reg => reg.status === status).length || 0;
        return (
          <Card key={status} className={cn("border rounded-xl overflow-hidden", gradient)}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-5 h-5", colorClass)} />
                <span className="font-medium text-slate-700 font-playfair">{getStatusText(status)}</span>
              </div>
              <div className="text-3xl font-playfair text-slate-900">{count}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
