
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
}: PolicyEvaluationDialogProps) {
  const [selectedRegulation, setSelectedRegulation] = useState<string>("");
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

        const { data, error } = await supabase
          .from('policy_evaluations')
          .select(`
            id,
            status,
            overall_compliance_score,
            created_at,
            summary,
            regulation:regulations(name)
          `)
          .eq('document_id', document.id)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching evaluations:', error);
          return [];
        }
        
        return (data || []) as PolicyEvaluation[];
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
      const { data, error } = await supabase.functions.invoke('policy-evaluation', {
        body: {
          documentId: document.id,
          regulationId: selectedRegulation
        }
      });

      if (error) throw error;

      toast({
        title: "Evaluation Started",
        description: "Policy evaluation is running in the background. You'll see results shortly.",
      });

      queryClient.invalidateQueries({ queryKey: ['policy-evaluations'] });
      setSelectedRegulation("");
    } catch (error: any) {
      toast({
        title: "Evaluation Failed",
        description: error.message,
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
              <p className="text-xs text-gray-500 mt-1">{document.description}</p>
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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
