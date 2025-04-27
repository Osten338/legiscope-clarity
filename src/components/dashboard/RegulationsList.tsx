import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { RegulationTableHeader } from "./regulations/RegulationTableHeader";
import { RegulationTableRow } from "./regulations/RegulationTableRow";
import { RegulationFilters } from "./regulations/RegulationFilters";
import { RegulationListItem, SortColumn, ViewType } from "./types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface RegulationsListProps {
  savedRegulations: RegulationListItem[];
}

export const RegulationsList = ({ savedRegulations }: RegulationsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentView, setCurrentView] = useState<ViewType>("active");

  useEffect(() => {
    console.log("Current view changed to:", currentView);
    console.log("Total regulations:", savedRegulations.length);
  }, [currentView, savedRegulations.length]);

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

  const searchFilteredRegulations = useMemo(() => {
    console.log("Applying search filter:", searchTerm);
    return savedRegulations.filter(
      (regulation) =>
        regulation.regulations.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        regulation.regulations.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [savedRegulations, searchTerm]);

  const upcomingRegulations = useMemo(() => {
    console.log("Filtering for upcoming reviews");
    return searchFilteredRegulations.filter((reg) => {
      if (!reg.next_review_date) return false;
      const reviewDate = new Date(reg.next_review_date);
      const now = new Date();
      const isInFuture = !isNaN(reviewDate.getTime()) && reviewDate > now;
      console.log(
        `Regulation ${reg.regulations.name}: Review date ${reviewDate.toISOString()}, Is in future: ${isInFuture}`
      );
      return isInFuture;
    });
  }, [searchFilteredRegulations]);

  const tasksRegulations = useMemo(() => {
    console.log("Filtering for incomplete tasks");
    return searchFilteredRegulations.filter((reg) => {
      const progress = reg.progress;
      console.log(`Regulation ${reg.regulations.name} has progress: ${progress}`);
      return typeof progress === "number" && progress < 100;
    });
  }, [searchFilteredRegulations]);

  const sortRegulations = (regulations: RegulationListItem[]) => {
    console.log(`Sorting regulations by ${sortColumn} ${sortDirection}`);
    return [...regulations].sort((a, b) => {
      let valueA, valueB;

      switch (sortColumn) {
        case "name":
          valueA = a.regulations.name;
          valueB = b.regulations.name;
          break;
        case "description":
          valueA = a.regulations.description;
          valueB = b.regulations.description;
          break;
        case "status":
          valueA = a.status;
          valueB = b.status;
          break;
        case "progress":
          valueA = a.progress;
          valueB = b.progress;
          break;
        case "next_review_date":
          valueA = a.next_review_date || "";
          valueB = b.next_review_date || "";
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const renderRegulationTable = (regulations: RegulationListItem[]) => {
    console.log(`Rendering table with ${regulations.length} regulations`);
    
    if (regulations.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          {currentView === "upcoming"
            ? "No upcoming reviews found"
            : currentView === "tasks"
            ? "No compliance tasks found"
            : "No active regulations found"}
        </div>
      );
    }

    const sortedRegulations = sortRegulations(regulations);

    return (
      <Table>
        <RegulationTableHeader
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        <TableBody>
          {sortedRegulations.map((regulation) => (
            <RegulationTableRow
              key={regulation.id}
              regulation={regulation}
              onRemoveRegulation={handleRemoveRegulation}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <RegulationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentView={currentView}
        />

        <Tabs
          value={currentView}
          onValueChange={(value) => {
            console.log("Tab change triggered:", value);
            setCurrentView(value as ViewType);
          }}
          className="w-full mt-4"
        >
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="active">Active Regulations</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Reviews</TabsTrigger>
            <TabsTrigger value="tasks">Compliance Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {renderRegulationTable(searchFilteredRegulations)}
          </TabsContent>

          <TabsContent value="upcoming">
            {renderRegulationTable(upcomingRegulations)}
          </TabsContent>

          <TabsContent value="tasks">
            {renderRegulationTable(tasksRegulations)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
