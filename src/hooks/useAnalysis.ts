
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAnalysis = (id: string) => {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      console.log("Fetching analysis data for ID:", id);
      
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

      const { data: businessRegulations, error: regulationsError } = await supabase
        .from("business_regulations")
        .select(`
          regulations!business_regulations_regulation_id_fkey (
            id,
            name,
            description,
            motivation,
            requirements,
            checklist_items!checklist_items_regulation_id_fkey (
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

      const regulations = businessRegulations
        .map(br => br.regulations)
        .filter((reg): reg is NonNullable<typeof reg> => reg !== null);

      return {
        analysis,
        regulations
      };
    },
  });
};

