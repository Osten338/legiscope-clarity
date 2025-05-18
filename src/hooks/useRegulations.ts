
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

export const useRegulations = () => {
  const { toast } = useToast();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duplicates, setDuplicates] = useState<{[key: string]: Regulation[]}>({});
  const [checklistCounts, setChecklistCounts] = useState<{[key: string]: number}>({});

  const fetchRegulations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("name");

      if (error) throw error;
      setRegulations(data || []);
      
      // Fetch checklist item counts for each regulation
      if (data && data.length > 0) {
        const counts: {[key: string]: number} = {};
        
        for (const reg of data) {
          const { count, error: countError } = await supabase
            .from("checklist_items")
            .select("id", { count: 'exact', head: true })
            .eq("regulation_id", reg.id);
            
          if (!countError) {
            counts[reg.id] = count || 0;
          }
        }
        
        setChecklistCounts(counts);
      }
      
      // Check for duplicates
      const duplicateMap: {[key: string]: Regulation[]} = {};
      data?.forEach(reg => {
        const normName = reg.name.trim().toLowerCase();
        if (!duplicateMap[normName]) {
          duplicateMap[normName] = [];
        }
        duplicateMap[normName].push(reg);
      });
      
      // Filter out non-duplicates
      const duplicatesOnly = Object.entries(duplicateMap)
        .filter(([_, regs]) => regs.length > 1)
        .reduce((acc, [key, regs]) => {
          acc[key] = regs;
          return acc;
        }, {} as {[key: string]: Regulation[]});
      
      setDuplicates(duplicatesOnly);
    } catch (error: any) {
      toast({
        title: "Error fetching regulations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRegulation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this regulation? This will also delete all associated checklist items.")) {
      return;
    }

    try {
      // First, delete the checklist items
      const { error: checklistError } = await supabase
        .from("checklist_items")
        .delete()
        .eq("regulation_id", id);

      if (checklistError) throw checklistError;

      // Then delete the regulation
      const { error } = await supabase
        .from("regulations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Regulation deleted",
        description: "The regulation and its checklist items have been deleted successfully."
      });
      
      fetchRegulations();
    } catch (error: any) {
      toast({
        title: "Error deleting regulation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRegulations();
  }, []);

  return {
    regulations,
    isLoading,
    duplicates,
    checklistCounts,
    fetchRegulations,
    deleteRegulation
  };
};
