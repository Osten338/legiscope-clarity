
import { Table, TableBody } from "@/components/ui/table";
import { DocumentTableHeader, DocumentSortColumn } from "./DocumentTableHeader";
import { DocumentTableRow } from "./DocumentTableRow";

interface DocumentsTableProps {
  documents: any[];
  sortColumn: DocumentSortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: DocumentSortColumn) => void;
  onDownload: (document: any) => Promise<void>;
  onReview: (document: any) => void;
  onDelete: (document: any) => Promise<void>;
}

export const DocumentsTable = ({
  documents,
  sortColumn,
  sortDirection,
  onSort,
  onDownload,
  onReview,
  onDelete,
}: DocumentsTableProps) => {
  if (documents.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No documents found
      </div>
    );
  }

  return (
    <Table>
      <DocumentTableHeader
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <TableBody>
        {documents.map((document) => (
          <DocumentTableRow
            key={document.id}
            document={document}
            onDownload={onDownload}
            onReview={onReview}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
};
