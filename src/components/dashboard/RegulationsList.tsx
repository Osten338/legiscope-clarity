
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { RegulationTableHeader } from "./regulations/RegulationTableHeader";
import { RegulationTableRow } from "./regulations/RegulationTableRow";
import { RegulationFilters } from "./regulations/RegulationFilters";
import { RegulationListItem, SortColumn, ViewType } from "./types";

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

  const filteredRegulations = useMemo(() => {
    let filtered = savedRegulations.filter(
      (regulation) =>
        regulation.regulations.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        regulation.regulations.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    switch (currentView) {
      case "upcoming":
        filtered = filtered.filter(
          (reg) => reg.next_review_date && new Date(reg.next_review_date) > new Date()
        );
        break;
      case "tasks":
        filtered = filtered.filter((reg) => reg.progress < 100);
        break;
      default:
        break;
    }

    return filtered;
  }, [savedRegulations, searchTerm, currentView]);

  const sortedRegulations = useMemo(() => {
    return [...filteredRegulations].sort((a, b) => {
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
  }, [filteredRegulations, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <RegulationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

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
      </CardContent>
    </Card>
  );
};
