
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PolicyRegulationSelector } from "./PolicyRegulationSelector";

interface Document {
  id: string;
  file_name: string;
  description?: string;
}

interface Regulation {
  id: string;
  name: string;
}

interface PolicyAnalysisHeaderProps {
  document: Document;
  regulations: Regulation[] | undefined;
  selectedRegulation: string | undefined;
  onRegulationChange: (value: string | undefined) => void;
  onStartAnalysis: () => void;
}

export const PolicyAnalysisHeader = ({
  document,
  regulations,
  selectedRegulation,
  onRegulationChange,
  onStartAnalysis
}: PolicyAnalysisHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">{document.file_name}</h2>
        </div>
        
        <PolicyRegulationSelector
          regulations={regulations}
          selectedRegulation={selectedRegulation}
          onRegulationChange={onRegulationChange}
        />
      </div>

      {selectedRegulation && (
        <Button onClick={onStartAnalysis}>
          Start New Analysis
        </Button>
      )}
    </div>
  );
};
