
import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentationCard } from "@/components/documentation/DocumentationCard";
import { ComplianceBuddyDialog } from "@/components/compliance/ComplianceBuddyDialog";
import { GenerateDocumentDialog } from "@/components/compliance/GenerateDocumentDialog";
import { FileText, Shield, CheckSquare, GraduationCap, AlertTriangle, FileText as FileTextIcon } from "lucide-react";

// Define dummy checklist item and regulation for the required props
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
          <DocumentationCard title="Policies and Procedures">
            <p className="text-slate-600">Guidelines and procedures for compliance operations</p>
          </DocumentationCard>
          
          <DocumentationCard title="Risk Assessments">
            <p className="text-slate-600">Templates and results for risk assessment activities</p>
          </DocumentationCard>
          
          <DocumentationCard title="Compliance Checklists">
            <p className="text-slate-600">Comprehensive checklists for regulatory compliance</p>
          </DocumentationCard>
          
          <DocumentationCard title="Training Materials">
            <p className="text-slate-600">Resources for staff training on compliance matters</p>
          </DocumentationCard>
          
          <DocumentationCard title="Incident Reports">
            <p className="text-slate-600">Documentation of compliance incidents and resolutions</p>
          </DocumentationCard>
          
          <DocumentationCard title="Audit Logs">
            <p className="text-slate-600">Records of compliance audits and findings</p>
          </DocumentationCard>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
