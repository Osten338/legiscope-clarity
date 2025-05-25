
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PolicyEvaluationDialog } from "../documents/PolicyEvaluationDialog";
import { PolicyAnalysisHeader } from "./PolicyAnalysisHeader";
import { PolicyAnalysisContent } from "./PolicyAnalysisContent";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

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
      <PolicyAnalysisHeader
        document={document}
        regulations={regulations}
        selectedRegulation={selectedRegulation}
        onRegulationChange={setSelectedRegulation}
        onStartAnalysis={handleStartAnalysis}
      />

      <PolicyAnalysisContent
        document={document}
        selectedRegulation={selectedRegulation}
        evaluationData={evaluationData}
        evaluationLoading={evaluationLoading}
        regulations={regulations}
        onStartAnalysis={handleStartAnalysis}
        onDocumentUpdated={handleDocumentUpdated}
      />

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
