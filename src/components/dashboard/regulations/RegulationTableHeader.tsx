
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortColumn } from "../types";

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
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
          Name
          {sortColumn === "name" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("description")}>
          Description
          {sortColumn === "description" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("status")}>
          Status
          {sortColumn === "status" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("progress")}>
          Progress
          {sortColumn === "progress" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => onSort("next_review_date")}>
          Next Review
          {sortColumn === "next_review_date" && (
            <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
