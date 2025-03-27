
import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentsList } from "@/components/documents/DocumentsList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { ReviewDocumentDialog } from "@/components/documents/ReviewDocumentDialog";

// Define mock documents data
const mockDocuments = [
  { id: "1", title: "Privacy Policy", category: "Policy", updatedAt: "2023-06-01" },
  { id: "2", title: "Data Breach Response Plan", category: "Procedure", updatedAt: "2023-05-15" },
];

const Documents = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedRegulation, setSelectedRegulation] = useState<string | undefined>("all");

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
        <DocumentsHeader 
          onUpload={handleOpenUploadDialog} 
          selectedRegulation={selectedRegulation}
          onRegulationChange={setSelectedRegulation}
        />
        
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
    </Layout>
  );
};

export default Documents;
