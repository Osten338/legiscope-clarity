
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
  // Local state to ensure proper tab synchronization
  const [activeTab, setActiveTab] = useState<ViewType>(currentView);
  
  // Ensure local state stays in sync with props
  useEffect(() => {
    setActiveTab(currentView);
  }, [currentView]);

  // Handler that updates both local state and calls the parent handler
  const handleTabChange = (value: string) => {
    console.log("Tab change triggered:", value);
    const newView = value as ViewType;
    setActiveTab(newView);
    onViewChange(newView);
  };

  // Debug which regulations are being displayed for each tab
  useEffect(() => {
    console.log("Active tab:", activeTab);
    console.log("Regulations for active tab:", 
      activeTab === "active" ? searchFilteredRegulations.length : 
      activeTab === "upcoming" ? upcomingRegulations.length : 
      activeTab === "tasks" ? tasksRegulations.length : 0
    );
  }, [activeTab, searchFilteredRegulations, upcomingRegulations, tasksRegulations]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full mt-4"
      defaultValue="active"
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

      {/* Force a complete re-render of each table when the active tab changes */}
      <TabsContent value="active">
        {activeTab === "active" && (
          <div className="mt-2">
            <RegulationsTable
              key={`active-${searchFilteredRegulations.length}`}
              regulations={sortRegulations(searchFilteredRegulations)}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              onRemoveRegulation={onRemoveRegulation}
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="upcoming">
        {activeTab === "upcoming" && (
          <div className="mt-2">
            <RegulationsTable
              key={`upcoming-${upcomingRegulations.length}`}
              regulations={sortRegulations(upcomingRegulations)}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              onRemoveRegulation={onRemoveRegulation}
            />
          </div>
        )}
      </TabsContent>

      <TabsContent value="tasks">
        {activeTab === "tasks" && (
          <div className="mt-2">
            <RegulationsTable
              key={`tasks-${tasksRegulations.length}`}
              regulations={sortRegulations(tasksRegulations)}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={onSort}
              onRemoveRegulation={onRemoveRegulation}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
