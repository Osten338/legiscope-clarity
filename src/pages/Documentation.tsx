import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentationCard } from "@/components/documentation/DocumentationCard";
import { ComplianceBuddyDialog } from "@/components/compliance/ComplianceBuddyDialog";
import { GenerateDocumentDialog } from "@/components/compliance/GenerateDocumentDialog";

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

        <ComplianceBuddyDialog open={isComplianceBuddyOpen} onOpenChange={setIsComplianceBuddyOpen} />
        <GenerateDocumentDialog open={isGenerateDocumentOpen} onOpenChange={setIsGenerateDocumentOpen} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DocumentationCard
            title="Policies and Procedures"
            description="Create, manage, and track your organization's policies and procedures."
            href="#"
          />
          <DocumentationCard
            title="Risk Assessments"
            description="Identify, analyze, and evaluate potential risks to your organization."
            href="#"
          />
          <DocumentationCard
            title="Compliance Checklists"
            description="Ensure compliance with industry standards and regulations."
            href="#"
          />
          <DocumentationCard
            title="Training Materials"
            description="Develop and deliver training materials to educate employees on compliance."
            href="#"
          />
          <DocumentationCard
            title="Incident Reports"
            description="Report and track security incidents and compliance breaches."
            href="#"
          />
          <DocumentationCard
            title="Audit Logs"
            description="Maintain detailed audit logs for compliance and security purposes."
            href="#"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
