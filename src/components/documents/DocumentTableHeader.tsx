
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

export type DocumentSortColumn = "file_name" | "document_type" | "uploaded_at" | "regulations";

interface DocumentTableHeaderProps {
  sortColumn: DocumentSortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: DocumentSortColumn) => void;
}

export const DocumentTableHeader = ({
  sortColumn,
  sortDirection,
  onSort,
}: DocumentTableHeaderProps) => {
  const renderSortIcon = (column: DocumentSortColumn) => {
    if (sortColumn !== column) return null;
    
    return (
      <span className="ml-1 inline-flex">
        {sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </span>
    );
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("file_name")}
        >
          <div className="flex items-center">
            Document Name
            {renderSortIcon("file_name")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("document_type")}
        >
          <div className="flex items-center">
            Type
            {renderSortIcon("document_type")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20"
          onClick={() => onSort("regulations")}
        >
          <div className="flex items-center">
            Related Regulation
            {renderSortIcon("regulations")}
          </div>
        </TableHead>
        <TableHead 
          className="cursor-pointer hover:bg-muted/20" 
          onClick={() => onSort("uploaded_at")}
        >
          <div className="flex items-center">
            Upload Date
            {renderSortIcon("uploaded_at")}
          </div>
        </TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
