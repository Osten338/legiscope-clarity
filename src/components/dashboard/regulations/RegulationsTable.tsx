
import { Table, TableBody } from "@/components/ui/table";
import { RegulationTableHeader } from "./RegulationTableHeader";
import { RegulationTableRow } from "./RegulationTableRow";
import { RegulationListItem, SortColumn } from "../types";
import { useEffect, memo, useMemo } from "react";

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
    console.log(`RegulationsTable [${tableId}] rendered with:`, {
      regulationsCount: regulations.length,
      sortColumn,
      sortDirection,
      regulationIds: regulations.slice(0, 3).map(r => r.id),
      firstRegulation: regulations.length > 0 ? {
        id: regulations[0]?.id,
        name: regulations[0]?.regulations?.name || "undefined",
        status: regulations[0]?.status || "undefined"
      } : 'none'
    });
    
    return () => {
      console.log(`RegulationsTable [${tableId}] unmounting`);
    };
  }, [regulations, sortColumn, sortDirection, tableId]);

  // Use useMemo to memoize the rows to prevent unnecessary re-renders
  const regulationRows = useMemo(() => {
    return regulations.map((regulation) => (
      <RegulationTableRow
        key={`${regulation.id}-${tableId}`}
        regulation={regulation}
        onRemoveRegulation={onRemoveRegulation}
      />
    ));
  }, [regulations, onRemoveRegulation, tableId]);

  if (!regulations || regulations.length === 0) {
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
          {regulationRows}
        </TableBody>
      </Table>
    </div>
  );
});

RegulationsTable.displayName = 'RegulationsTable';
