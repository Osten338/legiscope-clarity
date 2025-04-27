
import { useState, useMemo } from "react";
import { RegulationListItem, SortColumn } from "../types";

export const useRegulationsFilters = (savedRegulations: RegulationListItem[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
      return !isNaN(reviewDate.getTime()) && reviewDate > now;
    });
  }, [searchFilteredRegulations]);

  const tasksRegulations = useMemo(() => {
    console.log("Filtering for incomplete tasks");
    return searchFilteredRegulations.filter((reg) => {
      return typeof reg.progress === "number" && reg.progress < 100;
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
