
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegulationsTable } from "./RegulationsTable";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { Box, House, PanelsTopLeft } from "lucide-react";
import { useEffect, useState } from "react";

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
  // Create state to trigger re-renders when tab changes
  const [activeView, setActiveView] = useState<ViewType>(currentView);

  // Prepare the data to display for each tab
  const activeData = sortRegulations(searchFilteredRegulations);
  const upcomingData = sortRegulations(upcomingRegulations);
  const tasksData = sortRegulations(tasksRegulations);

  // Log when tab component renders or gets new data
  useEffect(() => {
    console.log("RegulationTabs rendered with currentView:", currentView);
    console.log("Regulations counts:", {
      active: activeData.length,
      upcoming: upcomingData.length, 
      tasks: tasksData.length
    });
    
    // Update local state to match prop
    setActiveView(currentView);
  }, [currentView, activeData.length, upcomingData.length, tasksData.length]);

  // The handler for tab changes
  const handleTabChange = (value: string) => {
    console.log("Tab change requested to:", value);
    const newView = value as ViewType;
    setActiveView(newView);
    onViewChange(newView);
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

      <TabsContent value="active" className="mt-2 data-[state=active]:block data-[state=inactive]:hidden">
        <RegulationsTable
          key={`active-table-${activeData.length}`}
          regulations={activeData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>

      <TabsContent value="upcoming" className="mt-2 data-[state=active]:block data-[state=inactive]:hidden">
        <RegulationsTable
          key={`upcoming-table-${upcomingData.length}`}
          regulations={upcomingData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>

      <TabsContent value="tasks" className="mt-2 data-[state=active]:block data-[state=inactive]:hidden">
        <RegulationsTable
          key={`tasks-table-${tasksData.length}`}
          regulations={tasksData}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onRemoveRegulation={onRemoveRegulation}
        />
      </TabsContent>
    </Tabs>
  );
};
