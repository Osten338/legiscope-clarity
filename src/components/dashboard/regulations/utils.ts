
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

// Helper function for displaying importance badges
export const getImportanceBadge = (importance?: number | null) => {
  if (!importance) return null;
  
  const colors = {
    1: "bg-slate-100 text-slate-600 border-slate-200",
    2: "bg-blue-100 text-blue-600 border-blue-200",
    3: "bg-green-100 text-green-600 border-green-200",
    4: "bg-amber-100 text-amber-600 border-amber-200",
    5: "bg-red-100 text-red-600 border-red-200",
  };
  
  const labels = {
    1: "Low",
    2: "Medium-Low",
    3: "Medium",
    4: "Medium-High",
    5: "High",
  };
  
  return (
    <Badge 
      variant="outline" 
      className={colors[importance as keyof typeof colors]}
    >
      {labels[importance as keyof typeof labels]}
    </Badge>
  );
};
