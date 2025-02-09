
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PlusCircle, XCircle, Presentation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAnalysis } from "@/hooks/useAnalysis";
import { RegulationCard } from "@/components/RegulationCard";
import { supabase } from "@/integrations/supabase/client";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);
  const [savingRegulations, setSavingRegulations] = useState<Set<string>>(new Set());
  const [rejectedRegulations, setRejectedRegulations] = useState<Set<string>>(new Set());
  
  const { data: analysisData, isLoading: isLoadingAnalysis } = useAnalysis(id!);

  const handleAddRegulation = async (regulationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save regulations");
        return;
      }

      setSavingRegulations(prev => new Set([...prev, regulationId]));
      
      const { error } = await supabase
        .from('saved_regulations')
        .insert({
          regulation_id: regulationId,
          user_id: user.id
        });
        
      if (error) throw error;
      
      toast.success("Added to dashboard!");
    } catch (error) {
      console.error('Error saving regulation:', error);
      toast.error("Failed to add to dashboard");
    } finally {
      setSavingRegulations(prev => {
        const newSet = new Set(prev);
        newSet.delete(regulationId);
        return newSet;
      });
    }
  };

  const handleRejectRegulation = (regulationId: string) => {
    setRejectedRegulations(prev => new Set([...prev, regulationId]));
    toast.success("Regulation removed from list");
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading analysis...</div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-sage-50 flex items-center justify-center">
        <div className="text-red-600">Analysis not found</div>
      </div>
    );
  }

  const activeRegulations = analysisData.regulations.filter(
    reg => !rejectedRegulations.has(reg.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white to-sage-50 py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Compliance Analysis</h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleViewDashboard}
            >
              <Presentation className="h-4 w-4" />
              View Dashboard
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-white/50 backdrop-blur-sm">
          <Label className="text-lg font-semibold text-slate-900 mb-4 block">
            Business Description
          </Label>
          <p className="text-slate-600 whitespace-pre-wrap">
            {analysisData.analysis.description}
          </p>
        </Card>

        {analysisData.analysis.analysis && (
          <Card className="p-6 mb-8 bg-white/50 backdrop-blur-sm">
            <Label className="text-lg font-semibold text-slate-900 mb-4 block">
              Overview
            </Label>
            <p className="text-slate-600 whitespace-pre-wrap">
              {analysisData.analysis.analysis}
            </p>
          </Card>
        )}

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Applicable Regulations
          </h2>
          {activeRegulations.map((regulation) => (
            <motion.div
              key={regulation.id}
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 bg-white/50 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {regulation.name}
                    </h3>
                    <p className="text-slate-600 mb-4">{regulation.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Why This Applies</h4>
                        <p className="text-slate-600">{regulation.motivation}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Key Requirements</h4>
                        <p className="text-slate-600">{regulation.requirements}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-green-100 text-green-600 flex items-center gap-2"
                      onClick={() => handleAddRegulation(regulation.id)}
                      disabled={savingRegulations.has(regulation.id)}
                    >
                      <PlusCircle className="h-4 w-4" />
                      <span className="text-sm">Add to Dashboard</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-100 text-red-600 flex items-center gap-2"
                      onClick={() => handleRejectRegulation(regulation.id)}
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Remove</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Analysis;

