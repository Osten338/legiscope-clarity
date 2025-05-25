
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SimpleChecklistItem } from "./types";
import { getImportanceBadge } from "./utils";

interface RequirementTableRowProps {
  item: SimpleChecklistItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const RequirementTableRow = ({
  item,
  index,
  isExpanded,
  onToggle,
}: RequirementTableRowProps) => {
  const importanceBadgeConfig = getImportanceBadge(item.importance);

  return (
    <>
      <TableRow 
        className={cn(
          "transition-colors cursor-pointer",
          index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
        )}
        onClick={onToggle}
      >
        <TableCell className="p-2">
          {item.subtasks && item.subtasks.length > 0 ? (
            isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          ) : null}
        </TableCell>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {importanceBadgeConfig && (
              <Badge 
                variant={importanceBadgeConfig.variant}
                className={importanceBadgeConfig.className}
              >
                {importanceBadgeConfig.label}
              </Badge>
            )}
            {item.expert_verified && (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </TableCell>
        <TableCell className="text-gray-700 dark:text-gray-300">
          {item.category || "General"}
        </TableCell>
        <TableCell className="text-gray-700 dark:text-gray-300 font-medium">
          {item.task || item.description}
        </TableCell>
        <TableCell className="text-gray-700 dark:text-gray-300">
          {item.department || "Not assigned"}
        </TableCell>
        <TableCell className="text-gray-700 dark:text-gray-300">
          {item.estimated_effort || "Varies"}
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className={index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
          <TableCell colSpan={6} className="p-0">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                {item.task && item.description && item.task !== item.description && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Description:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                  </div>
                )}
                
                {item.best_practices && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Best Practices:</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.best_practices}</p>
                  </div>
                )}
                
                {item.subtasks && item.subtasks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      Subtasks <Badge className="bg-blue-100 text-blue-600 border-0">{item.subtasks.length}</Badge>
                    </h4>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      {item.subtasks.map((subtask) => (
                        <li key={subtask.id} className="text-sm text-gray-600 dark:text-gray-400">
                          {subtask.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
