
import { useEffect } from "react";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { RegulationCard } from "./RegulationCard";

interface RegulationCardGridProps {
  regulations: RegulationListItem[];
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onRemoveRegulation: (id: string) => Promise<void>;
  viewType: ViewType;
}

export const RegulationCardGrid = ({
  regulations,
  sortColumn,
  sortDirection,
  onRemoveRegulation,
  viewType,
}: RegulationCardGridProps) => {
  useEffect(() => {
    console.log(`RegulationCardGrid [${viewType}] rendered with:`, {
      regulationsCount: regulations.length,
      sortColumn,
      sortDirection,
    });
  }, [regulations, sortColumn, sortDirection, viewType]);

  if (!regulations || regulations.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No regulations found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {regulations.map((regulation) => (
        <RegulationCard
          key={regulation.id}
          regulation={regulation}
          onRemoveRegulation={onRemoveRegulation}
        />
      ))}
    </div>
  );
};
