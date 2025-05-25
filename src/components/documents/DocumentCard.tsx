
import { FileText, Download, Trash2, Bot, Shield, FileSearch } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReviewDocumentDialog } from "./ReviewDocumentDialog";
import { PolicyEvaluationDialog } from "./PolicyEvaluationDialog";
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
  const navigate = useNavigate();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [policyEvaluationOpen, setPolicyEvaluationOpen] = useState(false);

  const handlePolicyAnalysis = () => {
    navigate(`/policy-analysis/${document.id}`);
  };

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
    <Card className="overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-start gap-4 max-w-lg w-full">
            <div className="flex-shrink-0 p-2.5 bg-slate-100 rounded-lg">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="font-medium text-slate-900 truncate pr-4 font-serif">
                {document.file_name}
              </h3>
              <div className="space-y-1">
                {document.document_type && (
                  <p className="text-sm text-slate-500 truncate font-serif">
                    {document.document_type}
                  </p>
                )}
                {document.regulations && (
                  <p className="text-sm text-slate-500 truncate font-serif">
                    Related to: {document.regulations.name}
                  </p>
                )}
                {document.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 break-words font-serif">
                    {document.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-green-50"
            onClick={handlePolicyAnalysis}
          >
            <FileSearch className="h-4 w-4" />
            Policy Analysis
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-blue-50"
            onClick={() => setPolicyEvaluationOpen(true)}
          >
            <Shield className="h-4 w-4" />
            Policy Evaluation
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-slate-50"
            onClick={() => setReviewDialogOpen(true)}
          >
            <Bot className="h-4 w-4" />
            Review for Compliance
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-white hover:bg-slate-50"
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
                className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 bg-white"
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
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      <ReviewDocumentDialog 
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        document={document}
      />
      <PolicyEvaluationDialog
        open={policyEvaluationOpen}
        onOpenChange={setPolicyEvaluationOpen}
        document={document}
      />
    </Card>
  );
};
