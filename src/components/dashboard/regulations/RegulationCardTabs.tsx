import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegulationCardGrid } from "./RegulationCardGrid";
import { RegulationListItem, SortColumn, ViewType } from "../types";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

interface RegulationCardTabsProps {
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

export const RegulationCardTabs = ({
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
}: RegulationCardTabsProps) => {
  // Debug logging for component rendering
  useEffect(() => {
    console.log("RegulationCardTabs rendering with:", {
      currentView,
      searchFilteredCount: searchFilteredRegulations?.length,
      upcomingCount: upcomingRegulations?.length,
      tasksCount: tasksRegulations?.length,
    });
  }, [currentView, searchFilteredRegulations, upcomingRegulations, tasksRegulations]);

  // Handle tab selection
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    onViewChange(value as ViewType);
  };

  // Sort regulations before rendering
  const sortedActiveRegulations = sortRegulations(searchFilteredRegulations);
  const sortedUpcomingRegulations = sortRegulations(upcomingRegulations);
  const sortedTasksRegulations = sortRegulations(tasksRegulations);

  return (
    <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="active" className="gap-1.5">
          <Clock className="h-4 w-4" />
          <span>Active</span>
          <span className="ml-1 bg-muted rounded-full px-2 py-0.5 text-xs">
            {searchFilteredRegulations?.length || 0}
          </span>
        </TabsTrigger>
        <TabsTrigger value="upcoming" className="gap-1.5">
          <AlertTriangle className="h-4 w-4" />
          <span>Upcoming</span>
          <span className="ml-1 bg-muted rounded-full px-2 py-0.5 text-xs">
            {upcomingRegulations?.length || 0}
          </span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          <span>Tasks</span>
          <span className="ml-1 bg-muted rounded-full px-2 py-0.5 text-xs">
            {tasksRegulations?.length || 0}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <RegulationCardGrid
          regulations={sortedActiveRegulations}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onRemoveRegulation={onRemoveRegulation}
          viewType="active"
        />
      </TabsContent>

      <TabsContent value="upcoming">
        <RegulationCardGrid
          regulations={sortedUpcomingRegulations}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onRemoveRegulation={onRemoveRegulation}
          viewType="upcoming"
        />
      </TabsContent>

      <TabsContent value="tasks">
        <RegulationCardGrid
          regulations={sortedTasksRegulations}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onRemoveRegulation={onRemoveRegulation}
          viewType="tasks"
        />
      </TabsContent>
    </Tabs>
  );
};
