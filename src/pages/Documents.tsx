
import { useState } from "react";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentsList } from "@/components/documents/DocumentsList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";
import { Layout } from "@/components/dashboard/Layout";

const Documents = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState<string | undefined>("all");

  return (
    <Layout>
      <div className="p-8">
        <DocumentsHeader 
          onUpload={() => setUploadDialogOpen(true)} 
          selectedRegulation={selectedRegulation}
          onRegulationChange={setSelectedRegulation}
        />
        <DocumentsList selectedRegulation={selectedRegulation} />
        <UploadDocumentDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default Documents;
