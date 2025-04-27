
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewType } from "../types";

interface RegulationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentView: ViewType;
  onViewChange: (value: ViewType) => void;
}

export const RegulationFilters = ({
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
}: RegulationFiltersProps) => {
  const handleViewChange = (value: string) => {
    // Explicitly cast the value to ViewType
    onViewChange(value as ViewType);
    console.log("View changed to:", value);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {currentView === "upcoming"
              ? "Upcoming Reviews"
              : currentView === "tasks"
              ? "Compliance Tasks"
              : "Active Regulations"}
          </h2>
        </div>
        <Input
          placeholder="Search regulations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="md:w-96"
        />
      </div>

      <Tabs
        value={currentView}
        onValueChange={handleViewChange}
        className="w-full"
      >
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="active">Active Regulations</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Reviews</TabsTrigger>
          <TabsTrigger value="tasks">Compliance Tasks</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
