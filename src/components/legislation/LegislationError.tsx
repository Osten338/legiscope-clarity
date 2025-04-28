
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface LegislationErrorProps {
  error: string;
  onRetry: () => void;
}

export const LegislationError = ({ error, onRetry }: LegislationErrorProps) => {
  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-600">
          <AlertTriangle size={18} />
          <span>Error Loading Legislation</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-slate-600">{error}</p>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
          className="mt-4"
        >
          <RefreshCw size={14} className="mr-2" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};
