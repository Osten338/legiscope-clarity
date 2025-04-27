
import { Input } from "@/components/ui/input";
import { ViewType } from "../types";

interface RegulationFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentView: ViewType;
}

export const RegulationFilters = ({
  searchTerm,
  onSearchChange,
  currentView,
}: RegulationFiltersProps) => {
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
    </div>
  );
};
