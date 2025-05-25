
import { useState } from "react";
import { DocumentContentViewer } from "./DocumentContentViewer";
import { AnalysisDetailsPanel } from "./AnalysisDetailsPanel";

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

interface PolicyDocumentViewerProps {
  document: {
    id: string;
    file_name: string;
    description?: string;
  };
  highlights: PolicyHighlight[];
  selectedRegulation?: {
    name: string;
  };
}

export const PolicyDocumentViewer = ({
  document: documentProp,
  highlights,
  selectedRegulation
}: PolicyDocumentViewerProps) => {
  const [selectedHighlight, setSelectedHighlight] = useState<PolicyHighlight | null>(null);

  const handleHighlightSelect = (highlight: PolicyHighlight) => {
    setSelectedHighlight(highlight);
  };

  const handleNavigateToHighlight = (highlight: PolicyHighlight) => {
    setSelectedHighlight(highlight);
    // Scroll to highlight position (you could enhance this with smooth scrolling)
    const element = window.document.querySelector(`[data-highlight-id="${highlight.id}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Document Content with Highlights */}
      <div className="flex-1">
        <DocumentContentViewer
          document={documentProp}
          highlights={highlights}
          selectedRegulation={selectedRegulation}
          onHighlightSelect={handleHighlightSelect}
        />
      </div>

      {/* Analysis Details Panel */}
      <div className="w-96">
        <AnalysisDetailsPanel
          selectedHighlight={selectedHighlight}
          allHighlights={highlights}
          onNavigateToHighlight={handleNavigateToHighlight}
        />
      </div>
    </div>
  );
};
