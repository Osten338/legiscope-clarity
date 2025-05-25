
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Bot, Shield, FileSearch } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface DocumentTableRowProps {
  document: any;
  onDownload: (document: any) => Promise<void>;
  onReview: (document: any) => void;
  onDelete: (document: any) => Promise<void>;
}

export const DocumentTableRow = ({
  document,
  onDownload,
  onReview,
  onDelete,
}: DocumentTableRowProps) => {
  const [policyEvaluationOpen, setPolicyEvaluationOpen] = useState(false);
  const navigate = useNavigate();

  const handlePolicyAnalysis = () => {
    navigate(`/policy-analysis/${document.id}`);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{document.file_name}</TableCell>
        <TableCell>{document.document_type}</TableCell>
        <TableCell>
          {document.regulations ? document.regulations.name : "None"}
        </TableCell>
        <TableCell>
          {new Date(document.uploaded_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePolicyAnalysis}
            >
              <FileSearch className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPolicyEvaluationOpen(true)}
            >
              <Shield className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReview(document)}
            >
              <Bot className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(document)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
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
                    onClick={() => onDelete(document)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TableCell>
      </TableRow>
      <PolicyEvaluationDialog
        open={policyEvaluationOpen}
        onOpenChange={setPolicyEvaluationOpen}
        document={document}
      />
    </>
  );
};
