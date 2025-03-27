
import { Brain } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export const AnalysisInfoAlert = () => {
  return (
    <Alert className="bg-sage-50 border-sage-200">
      <Brain className="h-5 w-5 text-sage-600" />
      <AlertDescription className="text-sage-700 font-playfair">
        <strong>Advanced AI Analysis:</strong> Our system uses a sophisticated AI model to thoroughly analyze your business description and provide comprehensive, tailored compliance recommendations. This process may take several minutes but delivers detailed, actionable insights.
      </AlertDescription>
    </Alert>
  );
};
