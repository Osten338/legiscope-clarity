
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface PolicyEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    file_name: string;
    description?: string;
  };
  regulationId?: string;
  onEvaluationComplete?: () => void;
}

// Define types for our policy evaluation data
interface PolicyEvaluation {
  id: string;
  status: string;
  overall_compliance_score: number | null;
  created_at: string;
  summary: string | null;
  regulation: {
    name: string;
  } | null;
}

export function PolicyEvaluationDialog({
  open,
  onOpenChange,
  document,
  regulationId,
  onEvaluationComplete,
}: PolicyEvaluationDialogProps) {
  const [selectedRegulation, setSelectedRegulation] = useState<string>(regulationId || "");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: regulations } = useQuery({
    queryKey: ['regulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulations')
        .select('id, name, description')
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  const { data: existingEvaluations } = useQuery({
    queryKey: ['policy-evaluations', document.id],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Use the edge function to fetch evaluations
        const response = await fetch(`https://vmyzceyvkkcgdbgmbbqf.supabase.co/functions/v1/get-policy-evaluations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZteXpjZXl2a2tjZ2RiZ21iYnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwMTYwMzQsImV4cCI6MjA1NDU5MjAzNH0.h804WotC8aLH-3EPBRcE3kWPpwkvfZRkI9o2oQdzkBE`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_id_param: document.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch evaluations');
        }

        const evaluations = await response.json();
        
        // Transform the data to match our interface
        return (evaluations || []).map((evaluation: any) => ({
          id: evaluation.id,
          status: evaluation.status,
          overall_compliance_score: evaluation.overall_compliance_score,
          created_at: evaluation.created_at,
          summary: evaluation.summary,
          regulation: evaluation.regulation ? { name: evaluation.regulation.name } : null
        })) as PolicyEvaluation[];
      } catch (error) {
        console.error('Failed to fetch evaluations:', error);
        return [];
      }
    },
    enabled: open
  });

  const startEvaluation = async () => {
    if (!selectedRegulation) {
      toast({
        title: "Regulation Required",
        description: "Please select a regulation to evaluate against",
        variant: "destructive",
      });
      return;
    }

    setIsEvaluating(true);
    try {
      console.log('Starting evaluation for document:', document.id, 'with regulation:', selectedRegulation);
      
      // Call the edge function with correct parameter names
      const { data, error } = await supabase.functions.invoke('policy-evaluation', {
        body: {
          document_id: document.id,
          regulation_id: selectedRegulation,
          documentContent: document.description // Include document content
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Evaluation Started",
          description: "Policy evaluation is running in the background. You'll see results shortly.",
        });

        // Invalidate relevant queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['policy-evaluations'] });
        queryClient.invalidateQueries({ queryKey: ['policy-evaluation'] });
        
        // Call the completion callback if provided
        if (onEvaluationComplete) {
          onEvaluationComplete();
        }
        
        // Close dialog
        onOpenChange(false);
        setSelectedRegulation("");
      } else {
        throw new Error(data?.error || 'Failed to start evaluation');
      }
    } catch (error: any) {
      console.error('Evaluation failed:', error);
      toast({
        title: "Evaluation Failed",
        description: error.message || "Failed to start policy evaluation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const getStatusIcon = (status: string, score?: number | null) => {
    switch (status) {
      case 'completed':
        if (score && score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (score && score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Policy Compliance Evaluation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Document</h4>
            <p className="text-sm text-gray-600">{document.file_name}</p>
            {document.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-3">{document.description.substring(0, 200)}...</p>
            )}
            {!document.description && (
              <p className="text-xs text-yellow-600 mt-1">⚠️ No document content available - analysis may be limited</p>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Start New Evaluation</h4>
            <div className="flex gap-2">
              <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select regulation to evaluate against" />
                </SelectTrigger>
                <SelectContent>
                  {regulations?.map((reg) => (
                    <SelectItem key={reg.id} value={reg.id}>
                      {reg.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={startEvaluation} 
                disabled={isEvaluating || !selectedRegulation}
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Evaluate"
                )}
              </Button>
            </div>
          </div>

          {existingEvaluations && existingEvaluations.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Previous Evaluations</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existingEvaluations.map((evaluation) => (
                  <div 
                    key={evaluation.id} 
                    className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(evaluation.status, evaluation.overall_compliance_score)}
                        <span className="font-medium text-sm">
                          {evaluation.regulation?.name || 'Unknown Regulation'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {evaluation.overall_compliance_score !== null && (
                          <span className={`text-sm font-medium ${getScoreColor(evaluation.overall_compliance_score)}`}>
                            {evaluation.overall_compliance_score}%
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(evaluation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {evaluation.summary && (
                      <p className="text-xs text-gray-600 mt-1">{evaluation.summary}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
