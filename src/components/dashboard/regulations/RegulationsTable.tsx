
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
  // Add detailed debug logging to help track rendering and data issues
  useEffect(() => {
    console.log(`RegulationsTable rendering with:`, {
      regulationsCount: regulations.length,
      sortColumn,
      sortDirection,
      regulationIds: regulations.slice(0, 3).map(r => r.id),
      firstRegulation: regulations.length > 0 ? {
        id: regulations[0].id,
        name: regulations[0].regulations?.name,
        status: regulations[0].status
      } : 'none'
    });
    
    // Log whether this table has any data
    if (regulations.length === 0) {
      console.log(`RegulationsTable has NO data to display`);
    } else {
      console.log(`RegulationsTable has ${regulations.length} regulations to display`);
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
    <div className="w-full overflow-auto">
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
};
