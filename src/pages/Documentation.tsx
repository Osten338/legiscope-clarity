
import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentationCard } from "@/components/documentation/DocumentationCard";
import { ComplianceBuddyDialog } from "@/components/compliance/ComplianceBuddyDialog";
import { GenerateDocumentDialog } from "@/components/compliance/GenerateDocumentDialog";

// Define dummy checklist item and regulation for the required props
const dummyChecklistItem = {
  id: "dummy-id",
  description: "Dummy checklist item",
  status: "pending" as const
};

const dummyRegulation = {
  id: "dummy-id",
  name: "Dummy Regulation",
  description: "Dummy regulation description"
};

const Documentation = () => {
  const [isComplianceBuddyOpen, setIsComplianceBuddyOpen] = useState(false);
  const [isGenerateDocumentOpen, setIsGenerateDocumentOpen] = useState(false);

  return (
    <Layout>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocumentationCard
            title="Policies and Procedures"
            icon="document"
            href="#"
          />
          <DocumentationCard
            title="Risk Assessments"
            icon="shield"
            href="#"
          />
          <DocumentationCard
            title="Compliance Checklists"
            icon="check-square"
            href="#"
          />
          <DocumentationCard
            title="Training Materials"
            icon="graduation-cap"
            href="#"
          />
          <DocumentationCard
            title="Incident Reports"
            icon="alert-triangle"
            href="#"
          />
          <DocumentationCard
            title="Audit Logs"
            icon="file-text"
            href="#"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
