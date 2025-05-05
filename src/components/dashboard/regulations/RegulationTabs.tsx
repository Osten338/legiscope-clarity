
import { useEffect, useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RegulationsTable } from "./RegulationsTable";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { Box, House, PanelsTopLeft } from "lucide-react";

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
  // Logging for debugging
  useEffect(() => {
    console.log("RegulationTabs: Mounted with view:", currentView);
    
    return () => {
      console.log("RegulationTabs: Unmounting");
    };
  }, []);

  useEffect(() => {
    console.log("RegulationTabs: View changed to:", currentView);
  }, [currentView]);

  // Memoize sorted data to avoid unnecessary recalculations
  const activeData = useMemo(() => 
    sortRegulations(searchFilteredRegulations), 
    [searchFilteredRegulations, sortRegulations]
  );
  
  const upcomingData = useMemo(() => 
    sortRegulations(upcomingRegulations), 
    [upcomingRegulations, sortRegulations]
  );
  
  const tasksData = useMemo(() => 
    sortRegulations(tasksRegulations), 
    [tasksRegulations, sortRegulations]
  );

  const handleValueChange = (value: string) => {
    console.log("RegulationTabs: Tab value changing to:", value);
    onViewChange(value as ViewType);
  };

  return (
    <Tabs 
      value={currentView}
      onValueChange={handleValueChange} 
      className="w-full mt-4"
    >
      <ScrollArea>
        <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger
            value="active"
            className="relative overflow-hidden rounded-none border border-border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
            data-testid="tab-active-regulations"
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
            data-testid="tab-upcoming-regulations"
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
            data-testid="tab-tasks-regulations"
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
