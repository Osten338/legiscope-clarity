
import { useState, useMemo } from "react";
import { RegulationListItem, SortColumn } from "../types";

export const useRegulationsFilters = (savedRegulations: RegulationListItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Enhanced searching with better logging
  const searchFilteredRegulations = useMemo(() => {
    console.log("Applying search filter:", searchTerm, "to", savedRegulations.length, "regulations");
    
    if (!searchTerm.trim()) {
      return savedRegulations;
    }
    
    const lowercaseSearchTerm = searchTerm.toLowerCase();
    const filtered = savedRegulations.filter(
      (regulation) =>
        regulation.regulations.name
          .toLowerCase()
          .includes(lowercaseSearchTerm) ||
        regulation.regulations.description
          .toLowerCase()
          .includes(lowercaseSearchTerm)
    );
    
    console.log(`Search filter found ${filtered.length} matches for "${searchTerm}"`);
    return filtered;
  }, [savedRegulations, searchTerm]);

  // Enhanced upcoming regulation filter with better date handling
  const upcomingRegulations = useMemo(() => {
    console.log("Filtering for upcoming reviews from", searchFilteredRegulations.length, "regulations");
    
    const now = new Date();
    const filtered = searchFilteredRegulations.filter((reg) => {
      if (!reg.next_review_date) {
        return false;
      }
      
      const reviewDate = new Date(reg.next_review_date);
      const isValidDate = !isNaN(reviewDate.getTime());
      const isUpcoming = isValidDate && reviewDate > now;
      
      return isUpcoming;
    });
    
    console.log(`Found ${filtered.length} upcoming reviews`);
    return filtered;
  }, [searchFilteredRegulations]);

  // Enhanced tasks filter with better progress handling
  const tasksRegulations = useMemo(() => {
    console.log("Filtering for incomplete tasks from", searchFilteredRegulations.length, "regulations");
    
    const filtered = searchFilteredRegulations.filter((reg) => {
      const hasProgress = typeof reg.progress === "number";
      const isIncomplete = hasProgress && reg.progress < 100;
      return isIncomplete;
    });
    
    console.log(`Found ${filtered.length} incomplete tasks`);
    return filtered;
  }, [searchFilteredRegulations]);

  // Enhanced sorting with better error handling
  const sortRegulations = (regulations: RegulationListItem[]) => {
    if (!regulations || regulations.length === 0) {
      return [];
    }
    
    console.log(`Sorting ${regulations.length} regulations by ${sortColumn} ${sortDirection}`);
    
    return [...regulations].sort((a, b) => {
      let valueA, valueB;

      try {
        switch (sortColumn) {
          case "name":
            valueA = a.regulations?.name || "";
            valueB = b.regulations?.name || "";
            break;
          case "description":
            valueA = a.regulations?.description || "";
            valueB = b.regulations?.description || "";
            break;
          case "status":
            valueA = a.status || "";
            valueB = b.status || "";
            break;
          case "progress":
            valueA = typeof a.progress === "number" ? a.progress : 0;
            valueB = typeof b.progress === "number" ? b.progress : 0;
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
      } catch (error) {
        console.error("Error sorting regulations:", error);
        return 0;
      }
    });
  };

  const handleSort = (column: SortColumn) => {
    console.log(`Sort requested for column: ${column}, current: ${sortColumn} ${sortDirection}`);
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    searchFilteredRegulations,
    upcomingRegulations,
    tasksRegulations,
    sortRegulations,
  };
};
