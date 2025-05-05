
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegulationsTable } from "./RegulationsTable";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { Box, House, PanelsTopLeft } from "lucide-react";
import { useState, useEffect } from "react";

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
  // Prepare the data to display for each tab - move inside component to ensure fresh reference
  const [activeData, setActiveData] = useState<RegulationListItem[]>([]);
  const [upcomingData, setUpcomingData] = useState<RegulationListItem[]>([]);
  const [tasksData, setTasksData] = useState<RegulationListItem[]>([]);
  
  // Update the data whenever the props change
  useEffect(() => {
    console.log("Updating tab data based on new props");
    setActiveData(sortRegulations(searchFilteredRegulations));
    setUpcomingData(sortRegulations(upcomingRegulations));
    setTasksData(sortRegulations(tasksRegulations));
  }, [searchFilteredRegulations, upcomingRegulations, tasksRegulations, sortColumn, sortDirection, sortRegulations]);

  // Enhanced debugging to track tab changes and data state
  useEffect(() => {
    console.log("RegulationTabs: View or data changed:", {
      currentView,
      activeDataLength: activeData.length,
      upcomingDataLength: upcomingData.length,
      tasksDataLength: tasksData.length,
      firstActiveItem: activeData[0]?.regulations?.name || "none",
      firstUpcomingItem: upcomingData[0]?.regulations?.name || "none",
      firstTasksItem: tasksData[0]?.regulations?.name || "none"
    });
  }, [currentView, activeData, upcomingData, tasksData]);

  // The handler for tab changes
  const handleTabChange = (value: string) => {
    console.log("Tab change handler called with value:", value);
    onViewChange(value as ViewType);
  };

  // Debug log when component renders to track component lifecycle
  console.log("RegulationTabs rendering with currentView:", currentView);

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

      <TabsContent value="active">
        <RegulationsTable
          regulations={activeData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
          tableId="active-regulations"
        />
      </TabsContent>

      <TabsContent value="upcoming">
        <RegulationsTable
          regulations={upcomingData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
          tableId="upcoming-regulations"
        />
      </TabsContent>

      <TabsContent value="tasks">
        <RegulationsTable
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
