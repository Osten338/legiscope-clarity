
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
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Select a regulation to begin policy analysis</p>
          </CardContent>
        </Card>
      );
    }

    if (evaluationLoading) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent>
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading analysis...</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (!evaluationData) {
      return (
        <Card className="h-full flex items-center justify-center">
          <CardContent>
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No analysis found for this regulation.</p>
              <Button onClick={onStartAnalysis}>
                Start Analysis
              </Button>
            </div>
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
      <div className="h-[800px]">
        {renderDocumentViewer()}
      </div>
    </div>
  );
};
