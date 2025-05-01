
import { Table, TableBody } from "@/components/ui/table";
import { RegulationTableHeader } from "./RegulationTableHeader";
import { RegulationTableRow } from "./RegulationTableRow";
import { RegulationListItem, SortColumn } from "../types";
import { useEffect, memo } from "react";

interface RegulationsTableProps {
  regulations: RegulationListItem[];
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: SortColumn) => void;
  onRemoveRegulation: (id: string) => Promise<void>;
  tableId?: string;
}

// Using memo to prevent unnecessary re-renders when parent components change
export const RegulationsTable = memo(({
  regulations,
  sortColumn,
  sortDirection,
  onSort,
  onRemoveRegulation,
  tableId = "default-table",
}: RegulationsTableProps) => {
  // Enhanced debug logging to help track rendering and data issues
  useEffect(() => {
    console.log(`RegulationsTable [${tableId}] mounted/updated with:`, {
      regulationsCount: regulations.length,
      sortColumn,
      sortDirection,
      regulationIds: regulations.slice(0, 3).map(r => r.id),
      firstRegulation: regulations.length > 0 ? {
        id: regulations[0].id,
        name: regulations[0]?.regulations?.name,
        status: regulations[0]?.status
      } : 'none'
    });
    
    return () => {
      console.log(`RegulationsTable [${tableId}] unmounting`);
    };
  }, [regulations, sortColumn, sortDirection, tableId]);

  if (regulations.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground" data-table-id={tableId}>
        No regulations found
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto" data-table-id={tableId}>
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
    </div>
  );
});

RegulationsTable.displayName = 'RegulationsTable';
