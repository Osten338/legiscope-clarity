
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Presentation, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAnalysis } from "@/hooks/useAnalysis";
import { RegulationCard } from "@/components/RegulationCard";
import { supabase } from "@/integrations/supabase/client";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: analysisData, isLoading: isLoadingAnalysis } = useAnalysis(id!);

  const handleSaveToDashboard = async () => {
    if (!analysisData) return;
    
    setIsSaving(true);
    try {
      // Save each regulation to saved_regulations
      for (const regulation of analysisData.regulations) {
        const { error } = await supabase
          .from('saved_regulations')
          .insert({
            regulation_id: regulation.id
          });
          
        if (error) throw error;
      }
      
      toast.success("Regulations saved to dashboard!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving regulations:', error);
      toast.error("Failed to save regulations");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadSlides = () => {
    console.log("Downloading slides...");
    toast.info("Slide download feature coming soon!");
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
              onClick={handleDownloadSlides}
            >
              <Presentation className="h-4 w-4" />
              Download Slides
            </Button>
            <Button
              onClick={handleSaveToDashboard}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save to Dashboard"}
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <Label className="text-lg font-semibold text-slate-900 mb-4 block">
            Business Description
          </Label>
          <p className="text-slate-600 whitespace-pre-wrap">
            {analysisData.analysis.description}
          </p>
        </Card>

        {analysisData.analysis.analysis && (
          <Card className="p-6 mb-8">
            <Label className="text-lg font-semibold text-slate-900 mb-4 block">
              Overview
            </Label>
            <p className="text-slate-600 whitespace-pre-wrap">
              {analysisData.analysis.analysis}
            </p>
          </Card>
        )}

        <div className="space-y-6">
          {analysisData.regulations.map((regulation) => (
            <RegulationCard
              key={regulation.id}
              regulation={regulation}
              isOpen={openRegulation === regulation.id}
              onOpenChange={() =>
                setOpenRegulation(
                  openRegulation === regulation.id ? null : regulation.id
                )
              }
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Analysis;
