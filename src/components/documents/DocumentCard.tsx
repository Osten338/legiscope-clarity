
import { FileText, Download, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentCardProps {
  document: any;
}

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = async () => {
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

  const handleDelete = async () => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('compliance_documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete metadata from database
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-slate-100 rounded">
            <FileText className="h-8 w-8 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 truncate">
              {document.file_name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {document.document_type}
            </p>
            {document.regulations && (
              <p className="text-sm text-slate-500 mt-1">
                Related to: {document.regulations.name}
              </p>
            )}
            {document.description && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                {document.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Document</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this document? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
