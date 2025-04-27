
import { Table, TableBody } from "@/components/ui/table";
import { RegulationTableHeader } from "./RegulationTableHeader";
import { RegulationTableRow } from "./RegulationTableRow";
import { RegulationListItem, SortColumn } from "../types";

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
