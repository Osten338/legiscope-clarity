
import { Loader2, CheckCircle2 } from "lucide-react";
import { Progress } from "../ui/progress";

interface AnalysisProgressIndicatorProps {
  analysisProgress: number;
  currentStep: string;
}

export const AnalysisProgressIndicator = ({ 
  analysisProgress, 
  currentStep 
}: AnalysisProgressIndicatorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{currentStep}</span>
          <span className="text-sm text-gray-600">{Math.round(analysisProgress)}%</span>
        </div>
        <Progress value={analysisProgress} className="w-full h-2" />
      </div>
      
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-3">
          {analysisProgress < 100 ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          )}
          <p className="text-gray-700 text-sm">
            {analysisProgress < 100
              ? "Our advanced AI is performing a detailed analysis of your business description to provide comprehensive compliance recommendations. This may take several minutes..."
              : "Analysis complete! Preparing your personalized compliance dashboard with detailed recommendations..."}
          </p>
        </div>
      </div>
    </div>
  );
};
