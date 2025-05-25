
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { RegulationListItem } from "../types";
import { useState } from "react";
import { useRegulationRequirements } from "./useRegulationRequirements";
import { RequirementTableRow } from "./RequirementTableRow";

interface RegulationRequirementsTableProps {
  regulation: RegulationListItem;
}

export const RegulationRequirementsTable = ({
  regulation,
}: RegulationRequirementsTableProps) => {
  const { requirementItems, isLoading } = useRegulationRequirements(regulation);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 text-center py-8 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto"></div>
        <div className="mt-2">Loading requirements...</div>
      </div>
    );
  }

  if (!requirementItems.length) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 text-center py-8 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
        No specific requirements found for this regulation.
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800">
            <TableHead className="w-[40px] font-medium text-gray-900 dark:text-gray-100"></TableHead>
            <TableHead className="w-[120px] font-medium text-gray-900 dark:text-gray-100">Priority</TableHead>
            <TableHead className="w-[150px] font-medium text-gray-900 dark:text-gray-100">Category</TableHead>
            <TableHead className="font-medium text-gray-900 dark:text-gray-100">Task</TableHead>
            <TableHead className="font-medium text-gray-900 dark:text-gray-100">Department</TableHead>
            <TableHead className="w-[120px] font-medium text-gray-900 dark:text-gray-100">Est. Effort</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirementItems.map((item, index) => (
            <RequirementTableRow
              key={item.id}
              item={item}
              index={index}
              isExpanded={expandedRows[item.id]}
              onToggle={() => toggleRow(item.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
