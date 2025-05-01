
import { Table, TableBody } from "@/components/ui/table";
import { RegulationTableHeader } from "./RegulationTableHeader";
import { RegulationTableRow } from "./RegulationTableRow";
import { RegulationListItem, SortColumn } from "../types";
import { useEffect } from "react";

interface RegulationsTableProps {
  regulations: RegulationListItem[];
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: SortColumn) => void;
  onRemoveRegulation: (id: string) => Promise<void>;
}

export const RegulationsTable = ({
  regulations,
  sortColumn,
  sortDirection,
  onSort,
  onRemoveRegulation,
}: RegulationsTableProps) => {
  // Add debug logging to help track rendering and data issues
  useEffect(() => {
    console.log("RegulationsTable rendering with:", {
      regulationsCount: regulations.length,
      sortColumn,
      sortDirection
    });
    
    if (regulations.length > 0) {
      console.log("First regulation:", {
        id: regulations[0].id,
        name: regulations[0].regulations.name,
        status: regulations[0].status
      });
    }
  }, [regulations, sortColumn, sortDirection]);

  if (regulations.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No regulations found
      </div>
    );
  }

  return (
    <Table>
      <RegulationTableHeader
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        {regulations.map((regulation) => (
          <RegulationTableRow
            key={regulation.id}
            regulation={regulation}
            onRemoveRegulation={onRemoveRegulation}
          />
        ))}
      </TableBody>
    </Table>
  );
};
