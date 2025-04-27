
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { DocumentSortColumn } from "./DocumentTableHeader";
import { useToast } from "@/hooks/use-toast";
import { ReviewDocumentDialog } from "./ReviewDocumentDialog";
import { DocumentTabs } from "./DocumentTabs";
import { DocumentViewType } from "./types";

interface DocumentsListProps {
  selectedRegulation?: string;
}

export const DocumentsList = ({ selectedRegulation }: DocumentsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortColumn, setSortColumn] = useState<DocumentSortColumn>("file_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [currentView, setCurrentView] = useState<DocumentViewType>("all");

  const { data: documents, isLoading } = useQuery({
    queryKey: ['compliance-documents', selectedRegulation, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase
        .from('compliance_documents')
        .select(`
          *,
          regulations (
            id,
            name
          )
        `)
        .order(sortColumn, { ascending: sortDirection === 'asc' });

      if (selectedRegulation && selectedRegulation !== 'all') {
        query = query.eq('regulation_id', selectedRegulation);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleSort = (column: DocumentSortColumn) => {
    setSortDirection(sortColumn === column && sortDirection === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleDownload = async (document: any) => {
    try {
      const { data, error } = await supabase.storage
        .from('compliance_documents')
        .download(document.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.file_name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error downloading document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: any) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('compliance_documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('compliance_documents')
        .delete()
        .eq('id', document.id);

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });

      toast({
        title: "Document deleted",
        description: "The document has been permanently removed",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReview = (document: any) => {
    setSelectedDocument(document);
    setReviewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="text-center text-slate-500 my-8">
        Loading documents...
      </div>
    );
  }

  return (
    <>
      <Card className="mt-6">
        <DocumentTabs
          currentView={currentView}
          onViewChange={setCurrentView}
          documents={documents || []}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDownload={handleDownload}
          onReview={handleReview}
          onDelete={handleDelete}
        />
      </Card>

      {selectedDocument && (
        <ReviewDocumentDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          document={selectedDocument}
        />
      )}
    </>
  );
};
