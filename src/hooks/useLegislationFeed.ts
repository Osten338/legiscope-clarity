
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LegislationItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  celex: string;
  hasAnalysis?: boolean;
}

export const useLegislationFeed = () => {
  const [legislationItems, setLegislationItems] = useState<LegislationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const { toast } = useToast();

  const fetchLegislation = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsFallback(false);
      
      console.log("Fetching legislation feed...");
      const { data, error } = await supabase.functions.invoke("fetch-eurlex-rss");
      
      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(error.message || "Failed to fetch legislation feed");
      }
      
      if (data && data.entries) {
        // Check for existing analyses for these items
        const items = data.entries;
        const celexIds = items
          .filter((item: LegislationItem) => item.celex)
          .map((item: LegislationItem) => item.celex);

        if (celexIds.length > 0) {
          // Use raw query approach instead of typed methods to bypass TypeScript restrictions
          const { data: analyses } = await (supabase as any)
            .from('regulatory_impact_analyses')
            .select('legislation_item_id')
            .in('legislation_item_id', celexIds);
          
          const analysisMap = new Set((analyses || []).map((a: any) => a.legislation_item_id));
          
          // Mark items that have an analysis
          const itemsWithAnalysisStatus = items.map((item: LegislationItem) => ({
            ...item,
            hasAnalysis: item.celex ? analysisMap.has(item.celex) : false
          }));
          
          setLegislationItems(itemsWithAnalysisStatus);
        } else {
          setLegislationItems(items);
        }

        // Check if we're using fallback data
        if (data.status === "fallback") {
          setIsFallback(true);
          toast({
            title: "Using cached legislation data",
            description: "We couldn't connect to EUR-Lex. Showing cached data instead.",
            variant: "default"
          });
        }
      } else {
        throw new Error("No legislation data received");
      }
    } catch (err: any) {
      console.error("Error fetching legislation feed:", err);
      setError(err.message || "Failed to load legislation feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegislation();
  }, []);

  return {
    legislationItems,
    loading,
    error,
    isFallback,
    fetchLegislation
  };
};
