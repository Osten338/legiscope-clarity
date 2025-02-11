
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DocumentsHeader } from "@/components/documents/DocumentsHeader";
import { DocumentsList } from "@/components/documents/DocumentsList";
import { UploadDocumentDialog } from "@/components/documents/UploadDocumentDialog";

const Documents = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedRegulation, setSelectedRegulation] = useState<string | undefined>("all");

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
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
      </div>
    </div>
  );
};

export default Documents;
