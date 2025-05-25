
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PolicyDocumentViewer } from "./PolicyDocumentViewer";
import { ComplianceSummaryCard } from "./ComplianceSummaryCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, AlertCircle, Play } from "lucide-react";

interface PolicyAnalysisInterfaceProps {
  documentId: string;
}

export const PolicyAnalysisInterface = ({ documentId }: PolicyAnalysisInterfaceProps) => {
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch document details
  const { data: document, isLoading: documentLoading } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_documents")
        .select("*")
        .eq("id", documentId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch available regulations for analysis
  const { data: regulations } = useQuery({
    queryKey: ["regulations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch policy evaluations for this document
  const { data: evaluations, isLoading: evaluationsLoading, refetch: refetchEvaluations } = useQuery({
    queryKey: ["policy-evaluations", documentId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "get-policy-evaluations",
        {
          body: { document_id_param: documentId }
        }
      );
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch highlights for selected evaluation
  const { data: highlights, isLoading: highlightsLoading } = useQuery({
    queryKey: ["policy-highlights", selectedEvaluationId],
    queryFn: async () => {
      if (!selectedEvaluationId) return [];
      
      const { data, error } = await supabase
        .from("policy_highlights")
        .select("*")
        .eq("evaluation_id", selectedEvaluationId)
        .order("section_start_position", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedEvaluationId
  });

  // Mutation for running policy analysis
  const runAnalysisMutation = useMutation({
    mutationFn: async (regulationId: string) => {
      const { data, error } = await supabase.functions.invoke("policy-evaluation", {
        body: {
          document_id: documentId,
          regulation_id: regulationId
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Policy analysis has been completed successfully.",
      });
      // Refresh evaluations list
      refetchEvaluations();
    },
    onError: (error: any) => {
      console.error("Policy analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to run policy analysis. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleRunAnalysis = () => {
    if (!regulations || regulations.length === 0) {
      toast({
        title: "No Regulations Available",
        description: "Please ensure regulations are configured before running analysis.",
        variant: "destructive",
      });
      return;
    }

    // Use the first available regulation for analysis
    // In a more advanced implementation, you might want to let users select which regulation to analyze against
    const defaultRegulation = regulations[0];
    runAnalysisMutation.mutate(defaultRegulation.id);
  };

  // Auto-select first evaluation if available
  useEffect(() => {
    if (evaluations && evaluations.length > 0 && !selectedEvaluationId) {
      setSelectedEvaluationId(evaluations[0].id);
    }
  }, [evaluations, selectedEvaluationId]);

  const selectedEvaluation = evaluations?.find(e => e.id === selectedEvaluationId);

  if (documentLoading || evaluationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
        <span className="ml-2">Loading policy analysis...</span>
      </div>
    );
  }

  if (!document) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Not Found</h3>
            <p className="text-gray-600">The requested document could not be found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {document.file_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
            <p className="text-gray-600 mb-4">
              No policy evaluations have been generated for this document yet.
            </p>
            <Button 
              onClick={handleRunAnalysis}
              disabled={runAnalysisMutation.isPending}
              className="gap-2"
            >
              {runAnalysisMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Policy Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Evaluation Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select
                value={selectedEvaluationId}
                onValueChange={setSelectedEvaluationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an evaluation" />
                </SelectTrigger>
                <SelectContent>
                  {evaluations.map((evaluation) => (
                    <SelectItem key={evaluation.id} value={evaluation.id}>
                      {evaluation.regulation?.name || 'Unknown Regulation'} - {' '}
                      {new Date(evaluation.created_at).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRunAnalysis}
              disabled={runAnalysisMutation.isPending}
              className="gap-2"
            >
              {runAnalysisMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {selectedEvaluation && (
        <ComplianceSummaryCard
          evaluation={selectedEvaluation}
          regulation={selectedEvaluation.regulation || { name: 'Unknown Regulation' }}
        />
      )}

      {/* Document Viewer */}
      {selectedEvaluation && highlights && !highlightsLoading && (
        <PolicyDocumentViewer
          document={document}
          highlights={highlights}
          selectedRegulation={selectedEvaluation.regulation}
        />
      )}

      {highlightsLoading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-sage-600" />
            <span className="ml-2">Loading analysis details...</span>
          </div>
        </Card>
      )}
    </div>
  );
};
