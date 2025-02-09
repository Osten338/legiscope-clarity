
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAnalysis = (id: string) => {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: async () => {
      // Validate the ID parameter
      if (!id || id === ':id') {
        console.error("Invalid ID parameter:", id);
        toast.error("Invalid analysis ID");
        throw new Error("Invalid analysis ID");
      }

      console.log("Fetching analysis data for ID:", id);
      
      // First fetch the analysis
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

      // Then fetch the regulations using the proper foreign key relationship
      const { data: regulationsData, error: regulationsError } = await supabase
        .from("business_regulations")
        .select(`
          regulation_id,
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

      console.log("Raw regulations data:", regulationsData);

      // Extract and format the regulations data
      const formattedRegulations = regulationsData
        .map(br => br.regulations)
        .filter((reg): reg is NonNullable<typeof reg> => reg !== null);

      console.log("Processed regulations:", formattedRegulations);

      return {
        analysis,
        regulations: formattedRegulations
      };
    },
    enabled: Boolean(id) && id !== ':id', // Only run the query if we have a valid ID
  });
};

