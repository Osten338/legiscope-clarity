
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentsList } from "@/components/documents/DocumentsList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { ReviewDocumentDialog } from "@/components/documents/ReviewDocumentDialog";

const Documents = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string | undefined>("all");

  // Use useCallback to maintain stable function references
  const handleOpenUploadDialog = useCallback(() => {
    console.log("Opening upload dialog");
    setUploadDialogOpen(true);
  }, []);

  // For debugging
  console.log("Documents page rendering");

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-1">
            <Link to="/documentation" className="hover:text-foreground">Documentation</Link>
            {" / "}
            <span>Policies & Procedures</span>
          </div>
          <DocumentsHeader onUpload={handleOpenUploadDialog} />
        </div>
        
        <DocumentsList 
          selectedRegulation={selectedRegulation} 
        />

        <UploadDocumentDialog 
          open={uploadDialogOpen} 
          onOpenChange={setUploadDialogOpen} 
        />
        
        {selectedDocument && (
          <ReviewDocumentDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            document={selectedDocument}
          />
        )}
      </div>
    </TopbarLayout>
  );
};

export default Documents;
