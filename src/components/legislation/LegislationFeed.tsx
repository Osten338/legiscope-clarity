
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { LegislationLoading } from "./LegislationLoading";
import { LegislationError } from "./LegislationError";
import { LegislationItem } from "./LegislationItem";
import { useLegislationFeed } from "@/hooks/useLegislationFeed";

export const LegislationFeed = () => {
  const { legislationItems, loading, error, isFallback, fetchLegislation } = useLegislationFeed();

  if (loading) {
    return <LegislationLoading />;
  }

  if (error) {
    return <LegislationError error={error} onRetry={fetchLegislation} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Latest EU Legislation</CardTitle>
            <CardDescription>
              {isFallback 
                ? "Temporarily using cached data due to connection issues" 
                : "Recent regulatory updates from EUR-Lex"}
            </CardDescription>
          </div>
          {isFallback && (
            <Button 
              onClick={fetchLegislation} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw size={14} className="mr-2" />
              Retry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {legislationItems.length === 0 ? (
          <p className="text-sm text-slate-600">No legislation found</p>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {legislationItems.map((item, index) => (
              <LegislationItem 
                key={index} 
                item={item} 
                onAnalysisComplete={fetchLegislation} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
