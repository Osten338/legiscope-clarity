import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentsList } from "@/components/documents/DocumentsList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { ReviewDocumentDialog } from "@/components/documents/ReviewDocumentDialog";

const Documents = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
  };

  const handleOpenReviewDialog = (document: any) => {
    setSelectedDocument(document);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setSelectedDocument(null);
    setReviewDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <DocumentsHeader onOpenUploadDialog={handleOpenUploadDialog} />
        <DocumentsList onOpenReviewDialog={handleOpenReviewDialog} />

        <UploadDocumentDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} onClose={handleCloseUploadDialog} />
        {selectedDocument && (
          <ReviewDocumentDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            onClose={handleCloseReviewDialog}
            document={selectedDocument}
          />
        )}
      </div>
    </Layout>
  );
};

export default Documents;
