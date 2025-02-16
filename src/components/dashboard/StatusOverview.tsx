import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";

const statusCards = {
  compliant: {
    icon: CheckCircle2,
    class: "text-[#403E43]",
    gradient: "from-[#FDE1D3] to-white"
  },
  in_progress: {
    icon: Clock,
    class: "text-[#403E43]",
    gradient: "from-[#FDE1D3] to-white"
  },
  not_compliant: {
    icon: AlertTriangle,
    class: "text-[#403E43]",
    gradient: "from-[#FDE1D3] to-white"
  },
  under_review: {
    icon: HelpCircle,
    class: "text-[#403E43]",
    gradient: "from-[#FDE1D3] to-white"
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
          <Card key={status} className={cn("border-none shadow-sm bg-gradient-to-br", gradient)}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Icon className={cn("w-4 h-4", colorClass)} />
                <span className="font-medium text-[#403E43] font-serif">{getStatusText(status)}</span>
              </CardDescription>
              <CardTitle className="text-2xl font-serif text-[#403E43]">{count}</CardTitle>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};
