
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyDocumentViewer } from "./PolicyDocumentViewer";
import { ComplianceSummaryCard } from "./ComplianceSummaryCard";
import { PolicyEvaluationDialog } from "../documents/PolicyEvaluationDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyAnalysisInterfaceProps {
  documentId: string;
}

export const PolicyAnalysisInterface = ({ documentId }: PolicyAnalysisInterfaceProps) => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | undefined>();
  const [showEvaluationDialog, setShowEvaluationDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch document details
  const { data: document, isLoading: documentLoading, error: documentError, refetch: refetchDocument } = useQuery({
    queryKey: ['compliance-document', documentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch available regulations
  const { data: regulations } = useQuery({
    queryKey: ['regulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulations')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch policy evaluations and highlights
  const { data: evaluationData, isLoading: evaluationLoading, refetch: refetchEvaluation } = useQuery({
    queryKey: ['policy-evaluation', documentId, selectedRegulation],
    queryFn: async () => {
      if (!selectedRegulation) return null;

      // Fetch the latest evaluation for this document and regulation
      const { data: evaluation, error: evalError } = await supabase
        .from('policy_evaluations')
        .select('*')
        .eq('document_id', documentId)
        .eq('regulation_id', selectedRegulation)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (evalError) throw evalError;
      if (!evaluation) return null;

      // Fetch highlights for this evaluation
      const { data: highlights, error: highlightsError } = await supabase
        .from('policy_highlights')
        .select('*')
        .eq('evaluation_id', evaluation.id)
        .order('section_start_position');

      if (highlightsError) throw highlightsError;

      return {
        evaluation,
        highlights: highlights || []
      };
    },
    enabled: !!selectedRegulation,
  });

  const handleDocumentUpdated = () => {
    // Refresh both document and evaluation data
    refetchDocument();
    if (selectedRegulation) {
      refetchEvaluation();
    }
    // Also invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['compliance-document', documentId] });
    queryClient.invalidateQueries({ queryKey: ['policy-evaluation', documentId] });
  };

  const handleStartAnalysis = () => {
    setShowEvaluationDialog(true);
  };

  const handleAnalysisComplete = () => {
    setShowEvaluationDialog(false);
    refetchEvaluation();
  };

  if (documentLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading document...</span>
      </div>
    );
  }

  if (documentError || !document) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load document. Please check if the document exists and you have permission to access it.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">{document.file_name}</h2>
          </div>
          
          {regulations && regulations.length > 0 && (
            <select
              value={selectedRegulation || ""}
              onChange={(e) => setSelectedRegulation(e.target.value || undefined)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a regulation...</option>
              {regulations.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedRegulation && (
          <Button onClick={handleStartAnalysis}>
            Start New Analysis
          </Button>
        )}
      </div>

      {/* Compliance Summary */}
      {evaluationData?.evaluation && (
        <ComplianceSummaryCard 
          evaluation={evaluationData.evaluation}
          regulation={regulations?.find(r => r.id === selectedRegulation)}
        />
      )}

      {/* Document Viewer */}
      <div className="h-[800px]">
        {selectedRegulation && evaluationData ? (
          <PolicyDocumentViewer
            document={document}
            highlights={evaluationData.highlights}
            selectedRegulation={regulations?.find(r => r.id === selectedRegulation)}
            onDocumentUpdated={handleDocumentUpdated}
          />
        ) : selectedRegulation ? (
          <Card className="h-full flex items-center justify-center">
            <CardContent>
              {evaluationLoading ? (
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading analysis...</p>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No analysis found for this regulation.</p>
                  <Button onClick={handleStartAnalysis}>
                    Start Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a regulation to begin policy analysis</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Policy Evaluation Dialog */}
      {showEvaluationDialog && selectedRegulation && (
        <PolicyEvaluationDialog
          open={showEvaluationDialog}
          onOpenChange={setShowEvaluationDialog}
          document={document}
          regulationId={selectedRegulation}
          onEvaluationComplete={handleAnalysisComplete}
        />
      )}
    </div>
  );
};
