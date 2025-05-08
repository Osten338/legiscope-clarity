
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { RegulationListItem } from "../types";
import { RegulationRequirementsTable } from "./RegulationRequirementsTable";
import { formatDate } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
        <DialogHeader className="p-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-row items-start justify-between sticky top-0 z-10">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {regulation.regulations?.name}
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Detailed information about regulation compliance status and requirements
            </DialogDescription>
            <div className="flex flex-wrap gap-4 text-sm">
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
          <Button variant="ghost" size="icon" onClick={onClose} className="mt-1">
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          <ScrollArea className="h-[calc(90vh-150px)]">
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {regulation.regulations?.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Requirements</h3>
                <RegulationRequirementsTable regulation={regulation} />
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
