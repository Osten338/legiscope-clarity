
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { Button } from "@/components/ui/button";
import { ComplianceBuddyDialog } from "@/components/compliance/ComplianceBuddyDialog";
import { GenerateDocumentDialog } from "@/components/compliance/GenerateDocumentDialog";
import { DocumentationFeatures } from "@/components/documentation/DocumentationFeatures";

const dummyChecklistItem = {
  id: "dummy-id",
  description: "Dummy checklist item",
  status: "pending" as const
};

const dummyRegulation = {
  id: "dummy-id",
  name: "Dummy Regulation",
  description: "Dummy regulation description",
  checklist_items: [
    {
      id: "item-1",
      description: "Checklist item 1"
    }
  ]
};

const Documentation = () => {
  const [isComplianceBuddyOpen, setIsComplianceBuddyOpen] = useState(false);
  const [isGenerateDocumentOpen, setIsGenerateDocumentOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Documentation &amp; Compliance</h1>
          <div>
            <Button onClick={() => setIsComplianceBuddyOpen(true)}>
              Compliance Buddy
            </Button>
            <Button onClick={() => setIsGenerateDocumentOpen(true)} className="ml-4">
              Generate Document
            </Button>
          </div>
        </div>

        <ComplianceBuddyDialog 
          open={isComplianceBuddyOpen} 
          onOpenChange={setIsComplianceBuddyOpen}
          checklistItem={dummyChecklistItem}
        />
        <GenerateDocumentDialog 
          open={isGenerateDocumentOpen} 
          onOpenChange={setIsGenerateDocumentOpen}
          regulation={dummyRegulation}
        />

        <DocumentationFeatures />
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
