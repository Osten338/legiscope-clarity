
import { useCallback, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocumentsTable } from "./DocumentsTable";
import { DocumentViewType, DocumentViewProps } from "./types";
import { FileText, FileCog, FileStack } from "lucide-react";
import { DocumentSortColumn } from "./DocumentTableHeader";

interface DocumentTabsProps extends DocumentViewProps {
  sortColumn: DocumentSortColumn;
  sortDirection: "asc" | "desc";
  onSort: (column: DocumentSortColumn) => void;
  onDownload: (document: any) => Promise<void>;
  onReview: (document: any) => void;
  onDelete: (document: any) => Promise<void>;
}

export const DocumentTabs = ({
  currentView,
  onViewChange,
  documents,
  sortColumn,
  sortDirection,
  onSort,
  onDownload,
  onReview,
  onDelete,
}: DocumentTabsProps) => {
  // Add debugging to track tab changes and document data
  useEffect(() => {
    console.log("DocumentTabs: View or documents changed:", {
      currentView,
      documentsCount: documents.length,
    });
  }, [currentView, documents]);

  // Use useCallback to maintain the same function reference
  const handleTabChange = useCallback((value: string) => {
    console.log("DocumentTabs: Tab change handler called with value:", value);
    // Prevent default to avoid any potential navigation
    onViewChange(value as DocumentViewType);
  }, [onViewChange]);

  // Prepare filtered documents upfront
  const allDocuments = documents;
  const policyDocuments = documents.filter(doc => doc.document_type === 'Policy');
  const procedureDocuments = documents.filter(doc => doc.document_type === 'Procedure');

  // Debug log when component renders
  console.log("DocumentTabs rendering with currentView:", currentView);
  
  return (
    <Tabs 
      value={currentView} 
      onValueChange={handleTabChange} 
      className="w-full"
      defaultValue="all" // Provide a default but it should use the controlled value
    >
      <ScrollArea>
        <TabsList className="mb-3 h-auto -space-x-px bg-background p-0 shadow-sm shadow-black/5 rtl:space-x-reverse">
          <TabsTrigger
            value="all"
            className="relative overflow-hidden rounded-none border border-border py-2 px-3 text-sm font-medium after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
            data-testid="tab-all-documents"
          >
            <FileText
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            All Documents
          </TabsTrigger>
          <TabsTrigger
            value="policies"
            className="relative overflow-hidden rounded-none border border-border py-2 px-3 text-sm font-medium after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
            data-testid="tab-policies"
          >
            <FileCog
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Policies
          </TabsTrigger>
          <TabsTrigger
            value="procedures"
            className="relative overflow-hidden rounded-none border border-border py-2 px-3 text-sm font-medium after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e data-[state=active]:bg-muted data-[state=active]:after:bg-primary"
            data-testid="tab-procedures"
          >
            <FileStack
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Procedures
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <TabsContent value="all" className="mt-2">
        <DocumentsTable
          documents={allDocuments}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onDownload={onDownload}
          onReview={onReview}
          onDelete={onDelete}
        />
      </TabsContent>
      <TabsContent value="policies" className="mt-2">
        <DocumentsTable
          documents={policyDocuments}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onDownload={onDownload}
          onReview={onReview}
          onDelete={onDelete}
        />
      </TabsContent>
      <TabsContent value="procedures" className="mt-2">
        <DocumentsTable
          documents={procedureDocuments}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          onDownload={onDownload}
          onReview={onReview}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  );
};
