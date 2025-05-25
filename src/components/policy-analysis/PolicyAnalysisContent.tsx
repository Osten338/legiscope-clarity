import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { PolicyDocumentViewer } from "./PolicyDocumentViewer";
import { ComplianceSummaryCard } from "./ComplianceSummaryCard";

interface Document {
  id: string;
  file_name: string;
  description?: string;
  file_path?: string;
}

interface Regulation {
  id: string;
  name: string;
}

interface PolicyHighlight {
  id: string;
  section_text: string;
  compliance_status: 'compliant' | 'non_compliant' | 'needs_review' | 'not_applicable';
  confidence_score: number;
  priority_level: number;
  gap_analysis: string;
  suggested_fixes: string;
  article_references: string[];
  section_start_position: number;
  section_end_position: number;
  ai_reasoning?: string;
  regulation_excerpt?: string;
}

interface PolicyEvaluation {
  id: string;
  status: string;
  overall_compliance_score: number | null;
  total_sections_analyzed: number;
  compliant_sections: number;
  non_compliant_sections: number;
  needs_review_sections: number;
  created_at: string;
  summary: string | null;
  recommendations?: string;
}

interface EvaluationData {
  evaluation: PolicyEvaluation;
  highlights: PolicyHighlight[];
}

interface PolicyAnalysisContentProps {
  document: Document;
  selectedRegulation: string | undefined;
  evaluationData: EvaluationData | null | undefined;
  evaluationLoading: boolean;
  regulations: Regulation[] | undefined;
  onStartAnalysis: () => void;
  onDocumentUpdated: () => void;
}

export const PolicyAnalysisContent = ({
  document,
  selectedRegulation,
  evaluationData,
  evaluationLoading,
  regulations,
  onStartAnalysis,
  onDocumentUpdated
}: PolicyAnalysisContentProps) => {
  const selectedRegulationData = regulations?.find(r => r.id === selectedRegulation);

  const renderDocumentViewer = () => {
    if (!selectedRegulation) {
      return (
        <Card className="h-full flex items-center justify-center bg-white border-gray-200">
          <CardContent className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a regulation to begin</h3>
            <p className="text-gray-500">Choose a regulation from the dropdown above to start analyzing your policy document</p>
          </CardContent>
        </Card>
      );
    }

    if (evaluationLoading) {
      return (
        <Card className="h-full flex items-center justify-center bg-white border-gray-200">
          <CardContent className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing document...</h3>
            <p className="text-gray-500">This may take a few moments</p>
          </CardContent>
        </Card>
      );
    }

    if (!evaluationData) {
      return (
        <Card className="h-full flex items-center justify-center bg-white border-gray-200">
          <CardContent className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analysis found</h3>
            <p className="text-gray-500 mb-6">No analysis exists for this regulation yet</p>
            <Button onClick={onStartAnalysis} className="bg-blue-600 hover:bg-blue-700">
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <PolicyDocumentViewer
        document={document}
        highlights={evaluationData.highlights}
        selectedRegulation={selectedRegulationData}
        onDocumentUpdated={onDocumentUpdated}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Compliance Summary */}
      {evaluationData?.evaluation && (
        <ComplianceSummaryCard 
          evaluation={evaluationData.evaluation}
          regulation={selectedRegulationData}
        />
      )}

      {/* Document Viewer */}
      <div className="h-[calc(100vh-200px)] min-h-[600px]">
        {renderDocumentViewer()}
      </div>
    </div>
  );
};
