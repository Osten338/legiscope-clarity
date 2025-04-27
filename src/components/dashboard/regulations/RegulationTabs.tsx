
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegulationsTable } from "./RegulationsTable";
import { RegulationListItem, SortColumn, ViewType } from "../types";

interface RegulationTabsProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  searchFilteredRegulations: RegulationListItem[];
  upcomingRegulations: RegulationListItem[];
  tasksRegulations: RegulationListItem[];
  sortColumn: SortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: SortColumn) => void;
  onRemoveRegulation: (id: string) => Promise<void>;
  sortRegulations: (regulations: RegulationListItem[]) => RegulationListItem[];
}

export const RegulationTabs = ({
  currentView,
  onViewChange,
  searchFilteredRegulations,
  upcomingRegulations,
  tasksRegulations,
  sortColumn,
  sortDirection,
  onSort,
  onRemoveRegulation,
  sortRegulations,
}: RegulationTabsProps) => {
  return (
    <Tabs
      value={currentView}
      onValueChange={(value) => {
        console.log("Tab change triggered:", value);
        onViewChange(value as ViewType);
      }}
      className="w-full mt-4"
    >
      <TabsList className="w-full md:w-auto">
        <TabsTrigger value="active">Active Regulations</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming Reviews</TabsTrigger>
        <TabsTrigger value="tasks">Compliance Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <RegulationsTable
          regulations={sortRegulations(searchFilteredRegulations)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>

      <TabsContent value="upcoming">
        <RegulationsTable
          regulations={sortRegulations(upcomingRegulations)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>

      <TabsContent value="tasks">
        <RegulationsTable
          regulations={sortRegulations(tasksRegulations)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>
    </Tabs>
  );
};
