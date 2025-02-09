
import { CheckCircle2, Clock, AlertTriangle, HelpCircle } from "lucide-react";

export const statusIcons = {
  compliant: { icon: CheckCircle2, class: "text-green-500" },
  in_progress: { icon: Clock, class: "text-amber-500" },
  not_compliant: { icon: AlertTriangle, class: "text-red-500" },
  under_review: { icon: HelpCircle, class: "text-blue-500" },
};

export const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    compliant: "Compliant",
    in_progress: "In Progress",
    not_compliant: "Not Compliant",
    under_review: "Under Review",
  };
  return statusMap[status] || status;
};
