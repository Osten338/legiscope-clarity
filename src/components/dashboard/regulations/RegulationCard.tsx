
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { RegulationListItem } from "../types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RegulationDetailsDialog } from "./RegulationDetailsDialog";

interface RegulationCardProps {
  regulation: RegulationListItem;
  onRemoveRegulation: (id: string) => Promise<void>;
}

export const RegulationCard = ({ 
  regulation, 
  onRemoveRegulation 
}: RegulationCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return "bg-green-100 text-green-700";
      case 'at_risk':
      case 'at risk':
        return "bg-orange-100 text-orange-700";
      case 'non_compliant':
      case 'non compliant':
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card className="h-auto transition-all duration-300 hover:shadow-md hover:cursor-pointer"
        onClick={handleOpenDialog}>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* Header with name and status */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold line-clamp-2">
                {regulation.regulations?.name || "Unnamed Regulation"}
              </h3>
              <div className={cn(
                "px-2 py-1 text-xs font-medium rounded",
                getStatusColor(regulation.status)
              )}>
                {regulation.status.replace('_', ' ')}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {regulation.regulations?.description || "No description available"}
            </p>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{regulation.progress}%</span>
              </div>
              <Progress value={regulation.progress} className="h-2" />
            </div>

            {/* Review date */}
            <div className="text-xs text-muted-foreground">
              Next review: {formatDate(regulation.next_review_date)}
            </div>

            {/* Action buttons */}
            <div className="flex justify-between items-center mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDialog();
                }}
                className="text-xs flex items-center gap-1"
              >
                <ExternalLink className="h-4 w-4" />
                View details
              </Button>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRegulation(regulation.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RegulationDetailsDialog 
        regulation={regulation}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};
