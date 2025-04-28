import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Users, File, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface RegulationImpactAnalysisProps {
  regulation: {
    id?: string;
    title: string;
    description?: string;
    content?: string;
    celex?: string;
  };
  onAnalysisComplete?: () => void;
}

type AnalysisData = {
  id: string;
  title: string;
  analysis_summary: string;
  risk_score: number;
  risk_justification: string;
  impacted_policies: Array<{ name: string; impact: string; riskLevel: string }>;
  departments_for_review: string[];
  created_at: string;
  status: string;
};

export const RegulationImpactAnalysis = ({ 
  regulation, 
  onAnalysisComplete 
}: RegulationImpactAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchExistingAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use a raw query approach instead of typed methods
      let filters = {};
      
      if (regulation.id) {
        filters = { regulation_id: regulation.id };
      } 
      else if (regulation.celex) {
        filters = { legislation_item_id: regulation.celex };
      } 
      else {
        filters = { title: regulation.title };
      }
      
      const { data, error } = await (supabase as any)
        .from('regulatory_impact_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .match(filters)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAnalysis(data);
      }
    } catch (err: any) {
      console.error("Error fetching analysis:", err);
      setError(err.message || "Failed to load impact analysis");
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await supabase.functions.invoke("analyze-regulation-impact", {
        body: { regulation: { 
          id: regulation.id,
          title: regulation.title,
          content: regulation.content || regulation.description || "",
          description: regulation.description,
          celex: regulation.celex
        }}
      });

      if (!response.data) {
        throw new Error("No data returned from analysis");
      }
      
      if (response.error) {
        throw new Error(response.error.message || "Analysis failed");
      }
      
      await fetchExistingAnalysis();
      
      toast({
        title: "Analysis complete",
        description: "Regulatory impact analysis has been generated",
      });
      
      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (err: any) {
      console.error("Error running analysis:", err);
      setError(err.message || "Failed to analyze regulation");
      toast({
        title: "Analysis failed",
        description: err.message || "Failed to generate impact analysis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (regulation) {
      fetchExistingAnalysis();
    }
  }, [regulation]);

  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-500";
    if (score >= 5) return "text-orange-500";
    return "text-green-500";
  };

  const getRiskBadgeVariant = (level: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (level.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={18} />
            <span>Error Loading Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          <Button onClick={fetchExistingAnalysis} variant="outline" size="sm">
            <RefreshCw size={14} className="mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Impact Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            No impact analysis has been generated for this regulation yet.
          </p>
          <Button 
            onClick={runAnalysis} 
            disabled={analyzing}
          >
            {analyzing ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>Run Impact Analysis</>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Regulatory Impact Analysis</span>
          <Badge variant={analysis?.status === 'completed' ? "default" : "outline"}>
            {analysis?.status === 'completed' ? "Completed" : "Pending"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Summary</h3>
            <p className="text-slate-700 dark:text-slate-300">
              {analysis?.analysis_summary}
            </p>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Risk Assessment</h3>
              <span className={`font-bold text-xl ${getRiskColor(analysis?.risk_score || 0)}`}>
                {analysis?.risk_score}/10
              </span>
            </div>
            <Progress 
              value={(analysis?.risk_score || 0) * 10} 
              className={`${(analysis?.risk_score || 0) >= 8 ? 'bg-red-200' : (analysis?.risk_score || 0) >= 5 ? 'bg-orange-200' : 'bg-green-200'}`}
            />
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              {analysis?.risk_justification}
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <File className="w-4 h-4 mr-2" />
              <h3 className="text-lg font-medium">Impacted Policies</h3>
            </div>
            <div className="space-y-2">
              {analysis?.impacted_policies?.map((policy: any, index: number) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{policy.name}</h4>
                    <Badge variant={getRiskBadgeVariant(policy.riskLevel)}>
                      {policy.riskLevel} risk
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                    {policy.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 mr-2" />
              <h3 className="text-lg font-medium">Departments for Review</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis?.departments_for_review?.map((department: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {department}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {analysis ? new Date(analysis.created_at).toLocaleDateString() : ''}
            </div>
            <Button 
              onClick={runAnalysis} 
              variant="outline"
              size="sm"
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <RefreshCw size={14} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="mr-2" />
                  Update Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
