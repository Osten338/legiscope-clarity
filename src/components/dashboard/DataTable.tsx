
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { SavedRegulation } from "./types";
import { format } from "date-fns";

interface DataTableProps {
  savedRegulations: SavedRegulation[];
}

export const DataTable = ({ savedRegulations }: DataTableProps) => {
  const [sorting, setSorting] = React.useState<"asc" | "desc" | null>(null);
  const [sortBy, setSortBy] = React.useState<string | null>(null);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSorting(sorting === "asc" ? "desc" : sorting === "desc" ? null : "asc");
      if (sorting === "desc") {
        setSortBy(null);
      }
    } else {
      setSortBy(column);
      setSorting("asc");
    }
  };

  // Map saved regulations to the required format for the table
  const mappedData = React.useMemo(() => {
    return savedRegulations.map((reg) => {
      // Calculate days remaining (if applicable)
      let daysRemaining = 0;
      if (reg.next_review_date) {
        const deadline = new Date(reg.next_review_date);
        const today = new Date();
        const diffTime = deadline.getTime() - today.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }

      // Determine status and growth indicator
      const statusMapping: Record<string, string> = {
        'compliant': 'stable',
        'not_compliant': 'declining',
        'in_progress': 'growing',
        'under_review': 'growing',
      };

      const status = statusMapping[reg.status] || 'stable';
      
      // Create a "growth" value based on status
      const growthValue = status === 'growing' 
        ? `+${Math.floor(Math.random() * 20)}%` 
        : status === 'declining' 
          ? `-${Math.floor(Math.random() * 15)}%` 
          : '+0.0%';

      return {
        id: reg.id.substring(0, 6),
        name: reg.regulations?.name || "Unknown Regulation",
        count: daysRemaining,
        growth: growthValue,
        value: reg.progress ? `${reg.progress}%` : "0%",
        status: status,
        originalData: reg,
      };
    });
  }, [savedRegulations]);

  const sortedData = React.useMemo(() => {
    if (!sortBy || !sorting) return mappedData;
    
    return [...mappedData].sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        // Handle percentage strings
        if (aValue.includes("%") && bValue.includes("%")) {
          const aNum = parseFloat(aValue.replace("%", ""));
          const bNum = parseFloat(bValue.replace("%", ""));
          return sorting === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        // Handle currency strings
        if (aValue.includes("$") && bValue.includes("$")) {
          const aNum = parseFloat(aValue.replace("$", ""));
          const bNum = parseFloat(bValue.replace("$", ""));
          return sorting === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        // Regular string comparison
        return sorting === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Number comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sorting === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [sortBy, sorting, mappedData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "growing":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400";
      case "stable":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400";
      case "declining":
        return "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400";
    }
  };

  const SortButton = ({ column }: { column: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(column)}
    >
      <ArrowUpDown className="h-4 w-4" />
      <span className="sr-only">Sort by {column}</span>
    </Button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>
              Regulation
              <SortButton column="name" />
            </TableHead>
            <TableHead className="text-right">
              Days Left
              <SortButton column="count" />
            </TableHead>
            <TableHead className="text-right">
              Progress
              <SortButton column="growth" />
            </TableHead>
            <TableHead className="text-right">
              Completion
              <SortButton column="value" />
            </TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">
                  {item.originalData.next_review_date ? (
                    <span className={item.count <= 7 ? "text-red-600" : ""}>
                      {item.count}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <span className={item.growth.startsWith("+") ? "text-emerald-600" : "text-red-600"}>
                    {item.growth}
                  </span>
                </TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
                <TableCell className="text-right">
                  <Badge className={getStatusColor(item.status)} variant="outline">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No regulations found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
