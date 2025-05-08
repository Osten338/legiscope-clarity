
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RegulationListItem } from "../types";
import { RegulationRequirementsTable } from "./RegulationRequirementsTable";
import { formatDate } from "date-fns";

interface RegulationDetailsDialogProps {
  regulation: RegulationListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RegulationDetailsDialog = ({
  regulation,
  isOpen,
  onClose,
}: RegulationDetailsDialogProps) => {
  if (!regulation) return null;

  const formatStatusText = (status: string) => {
    return status.replace("_", " ").charAt(0).toUpperCase() + status.replace("_", " ").slice(1);
  };

  const formatDateString = (dateString: string | null) => {
    if (!dateString) return "Not set";
    try {
      return formatDate(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b flex flex-row items-start justify-between">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold">
              {regulation.regulations?.name}
            </DialogTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span className={`${regulation.status === 'compliant' ? 'text-green-600' : regulation.status === 'at_risk' ? 'text-amber-600' : 'text-red-600'}`}>
                  {formatStatusText(regulation.status)}
                </span>
              </div>
              <div>
                <span className="font-medium">Progress:</span> {regulation.progress}%
              </div>
              <div>
                <span className="font-medium">Next Review:</span>{" "}
                {formatDateString(regulation.next_review_date)}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">
              {regulation.regulations?.description}
            </p>
          </div>
          
          <h3 className="text-lg font-medium mb-4">Requirements</h3>
          <RegulationRequirementsTable regulation={regulation} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
