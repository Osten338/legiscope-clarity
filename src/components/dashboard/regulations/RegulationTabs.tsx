
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegulationsTable } from "./RegulationsTable";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { Box, House, PanelsTopLeft } from "lucide-react";
import { useId } from "react";

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
  // Generate unique IDs for each table to ensure proper re-rendering
  const activeTableId = useId();
  const upcomingTableId = useId();
  const tasksTableId = useId();
  
  // Prepare the data to display for each tab
  const activeData = sortRegulations(searchFilteredRegulations);
  const upcomingData = sortRegulations(upcomingRegulations);
  const tasksData = sortRegulations(tasksRegulations);

  console.log("RegulationTabs rendering with", {
    currentView,
    activeDataLength: activeData.length,
    upcomingDataLength: upcomingData.length,
    tasksDataLength: tasksData.length
  });

  // The handler for tab changes with improved logging
  const handleTabChange = (value: string) => {
    console.log("Tab change handler called with value:", value);
    onViewChange(value as ViewType);
  };

  return (
    <Tabs
      value={currentView}
      onValueChange={handleTabChange}
      className="w-full mt-4"
    >
      <ScrollArea>
        <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger
            value="active"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          >
            <House
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Active Regulations
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          >
            <PanelsTopLeft
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Upcoming Reviews
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
          >
            <Box
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Compliance Tasks
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsContent value="active" key={`active-tab-${activeTableId}`}>
        <RegulationsTable
          key={`active-table-${activeTableId}`}
          regulations={activeData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
          tableId="active-regulations"
        />
      </TabsContent>

      <TabsContent value="upcoming" key={`upcoming-tab-${upcomingTableId}`}>
        <RegulationsTable
          key={`upcoming-table-${upcomingTableId}`}
          regulations={upcomingData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
          tableId="upcoming-regulations"
        />
      </TabsContent>

      <TabsContent value="tasks" key={`tasks-tab-${tasksTableId}`}>
        <RegulationsTable
          key={`tasks-table-${tasksTableId}`}
          regulations={tasksData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
          tableId="tasks-regulations"
        />
      </TabsContent>
    </Tabs>
  );
};
