
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { RegulationListItem } from "../types";
import { DeleteRegulationDialog } from "./DeleteRegulationDialog";

interface RegulationTableRowProps {
  regulation: RegulationListItem;
  onRemoveRegulation: (id: string) => Promise<void>;
}

export const RegulationTableRow = ({
  regulation,
  onRemoveRegulation,
}: RegulationTableRowProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date format:", dateString);
        return "Invalid date";
      }
      
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid date";
    }
  };

  // Determine if review date is in the past
  const isReviewOverdue = () => {
    if (!regulation.next_review_date) return false;
    
    try {
      const reviewDate = new Date(regulation.next_review_date);
      const now = new Date();
      return reviewDate < now;
    } catch (e) {
      return false;
    }
  };
  
  return (
    <TableRow key={regulation.id}>
      <TableCell className="font-medium">
        <Link
          to={`/legislation/${regulation.regulations.id}`}
          className="text-foreground hover:text-primary"
        >
          {regulation.regulations.name}
        </Link>
      </TableCell>
      <TableCell className="max-w-md truncate">
        {regulation.regulations.description}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {regulation.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={regulation.progress === 100 ? "default" : "outline"}>
          {regulation.progress}%
        </Badge>
      </TableCell>
      <TableCell>
        <Badge 
          variant={isReviewOverdue() ? "destructive" : "outline"} 
          className={isReviewOverdue() ? "bg-amber-100 text-amber-800" : ""}
        >
          {formatDate(regulation.next_review_date)}
        </Badge>
      </TableCell>
      <TableCell className="flex gap-1">
        <Link to={`/legislation/${regulation.regulations.id}`}>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </Link>
        <DeleteRegulationDialog
          regulationId={regulation.id}
          onDelete={() => onRemoveRegulation(regulation.id)}
        />
      </TableCell>
    </TableRow>
  );
};
