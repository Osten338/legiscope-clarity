
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
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
    console.log("Filtering with view:", currentView);
    console.log("Initial regulations count:", savedRegulations.length);
    
    // First, filter by search term
    let filtered = savedRegulations.filter(
      (regulation) =>
        regulation.regulations.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        regulation.regulations.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    
    console.log("After search filter:", filtered.length);

    // Then apply view-specific filters
    if (currentView === "upcoming") {
      // Filter for upcoming reviews (those with a future review date)
      filtered = filtered.filter(reg => {
        // Log each regulation's review date for debugging
        console.log(`Regulation ${reg.regulations.name} has next_review_date: ${reg.next_review_date}`);
        
        if (!reg.next_review_date) {
          return false;
        }
        
        const reviewDate = new Date(reg.next_review_date);
        const now = new Date();
        const isInFuture = reviewDate > now;
        
        console.log(`- Review date: ${reviewDate}, Is in future: ${isInFuture}`);
        return isInFuture;
      });
      console.log("Upcoming filter applied, remaining count:", filtered.length);
    } 
    else if (currentView === "tasks") {
      // Filter for incomplete tasks (those with progress less than 100%)
      filtered = filtered.filter(reg => {
        console.log(`Regulation ${reg.regulations.name} has progress: ${reg.progress}`);
        return typeof reg.progress === 'number' && reg.progress < 100;
      });
      console.log("Tasks filter applied, remaining count:", filtered.length);
    }
    // For "active" view, we don't need additional filtering

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

  // Debug logs
  console.log('Current view:', currentView);
  console.log('Filtered regulations:', filteredRegulations.length);
  console.log('Sorted regulations:', sortedRegulations.length);
  console.log('Total regulations:', savedRegulations.length);

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardContent className="p-6">
        <RegulationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        <Tabs value={currentView} className="w-full mt-4">
          <TabsContent value="active">
            <div className="mt-4">
              {filteredRegulations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No active regulations found
                </div>
              ) : (
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
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="mt-4">
              {filteredRegulations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No upcoming reviews found
                </div>
              ) : (
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
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="mt-4">
              {filteredRegulations.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground">
                  No compliance tasks found
                </div>
              ) : (
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
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
