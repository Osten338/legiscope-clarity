
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Check, Info, Presentation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);

  const { data: analysisData, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      console.log("Fetching analysis data for ID:", id);
      
      // First fetch the business analysis
      const { data: analysis, error: analysisError } = await supabase
        .from("business_analyses")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        toast.error("Failed to load analysis");
        throw analysisError;
      }

      if (!analysis) {
        toast.error("Analysis not found");
        throw new Error("Analysis not found");
      }

      console.log("Analysis data:", analysis);

      // Then fetch all related regulations through the junction table
      const { data: businessRegulations, error: regulationsError } = await supabase
        .from("business_regulations")
        .select(`
          regulations!business_regulations_regulation_id_fkey (
            id,
            name,
            description,
            motivation,
            requirements,
            checklist_items (
              id,
              description
            )
          )
        `)
        .eq("business_analysis_id", id);

      if (regulationsError) {
        console.error("Regulations error:", regulationsError);
        toast.error("Failed to load regulations");
        throw regulationsError;
      }

      console.log("Business regulations data:", businessRegulations);

      // Extract and clean up the regulations data
      const regulations = businessRegulations
        .map(br => br.regulations)
        .filter((reg): reg is NonNullable<typeof reg> => reg !== null);

      return {
        analysis,
        regulations
      };
    },
  });

  const handleDownloadSlides = () => {
    // TODO: Implement slide deck generation and download
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
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadSlides}
          >
            <Presentation className="h-4 w-4" />
            Download Slides
          </Button>
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
            <Card key={regulation.id} className="p-6">
              <Collapsible
                open={openRegulation === regulation.id}
                onOpenChange={() =>
                  setOpenRegulation(
                    openRegulation === regulation.id ? null : regulation.id
                  )
                }
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-start gap-4 text-left">
                    <Info className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {regulation.name}
                      </h3>
                      <p className="text-slate-600">{regulation.description}</p>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Why This Applies
                    </h4>
                    <p className="text-slate-600">{regulation.motivation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Requirements
                    </h4>
                    <p className="text-slate-600">{regulation.requirements}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Compliance Checklist
                    </h4>
                    <ul className="space-y-2">
                      {regulation.checklist_items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 text-slate-600"
                        >
                          <Check className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                          <span>{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Analysis;
