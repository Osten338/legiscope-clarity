
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortColumn } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RegulationTableHeaderProps {
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: SortColumn) => void;
}

export const RegulationTableHeader = ({
  sortColumn,
  sortDirection,
  onSort,
}: RegulationTableHeaderProps) => {
  const renderSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className="ml-1 inline-flex">
        {sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </span>
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("name")}
        >
          <div className="flex items-center">
            Name
            {renderSortIcon("name")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("description")}
        >
          <div className="flex items-center">
            Description
            {renderSortIcon("description")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("status")}
        >
          <div className="flex items-center">
            Status
            {renderSortIcon("status")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("progress")}
        >
          <div className="flex items-center">
            Progress
            {renderSortIcon("progress")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("next_review_date")}
        >
          <div className="flex items-center">
            Next Review
            {renderSortIcon("next_review_date")}
          </div>
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
