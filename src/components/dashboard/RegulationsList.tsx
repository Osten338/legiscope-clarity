
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { RegulationFilters } from "./regulations/RegulationFilters";
import { RegulationCardTabs } from "./regulations/RegulationCardTabs";
import { useRegulationsFilters } from "./regulations/useRegulationsFilters";
import { RegulationListItem, ViewType } from "./types";

interface RegulationsListProps {
  savedRegulations: RegulationListItem[];
}

export const RegulationsList = ({ savedRegulations }: RegulationsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentView, setCurrentView] = useState<ViewType>("active");

  const {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    searchFilteredRegulations,
    upcomingRegulations,
    tasksRegulations,
    sortRegulations,
  } = useRegulationsFilters(savedRegulations);

  // Enhanced view change handler with logging
  const handleViewChange = (view: ViewType) => {
    console.log("RegulationsList: View changing from", currentView, "to", view);
    setCurrentView(view);
  };

  // Enhanced logging to track data and state changes
  useEffect(() => {
    console.log("RegulationsList: Data or view updated", {
      totalRegulations: savedRegulations?.length || 0,
      filteredCount: searchFilteredRegulations?.length || 0,
      upcomingCount: upcomingRegulations?.length || 0,
      tasksCount: tasksRegulations?.length || 0,
      currentView,
    });
  }, [savedRegulations, searchFilteredRegulations, upcomingRegulations, tasksRegulations, currentView]);

  const handleRemoveRegulation = async (savedRegulationId: string) => {
    try {
      const { error } = await supabase
        .from("saved_regulations")
        .delete()
        .eq("id", savedRegulationId);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["savedRegulations"] });
      toast({
        title: "Regulation removed",
        description: "The regulation has been removed from your dashboard",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove regulation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <RegulationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentView={currentView}
        />
        
        <RegulationCardTabs
          currentView={currentView}
          onViewChange={handleViewChange}
          searchFilteredRegulations={searchFilteredRegulations}
          upcomingRegulations={upcomingRegulations}
          tasksRegulations={tasksRegulations}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onRemoveRegulation={handleRemoveRegulation}
          sortRegulations={sortRegulations}
        />
      </CardContent>
    </Card>
  );
};
