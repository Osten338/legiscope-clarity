
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SavedRegulation } from "./types";

export const useDashboardData = () => {
  const { toast } = useToast();

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        const {
          data: savedRegs,
          error
        } = await supabase.from('saved_regulations').select(`
            id,
            regulation_id,
            status,
            progress,
            next_review_date,
            completion_date,
            notes,
            regulations (
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
          .eq('user_id', user.id);
          
        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Data loading error",
            description: "Could not load your saved regulations. Please try again.",
            variant: "destructive"
          });
          throw error;
        }
        
        console.log("Saved regulations data:", savedRegs);
        
        const typedRegulations = savedRegs?.map(reg => ({
          id: reg.id,
          regulation_id: reg.regulation_id,
          status: reg.status,
          progress: reg.progress,
          next_review_date: reg.next_review_date,
          completion_date: reg.completion_date,
          notes: reg.notes,
          regulations: reg.regulations
        })) as SavedRegulation[];
        
        return typedRegulations || [];
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
    staleTime: 10000,
  });

  return {
    savedRegulations,
    isLoading,
    error,
    refetch
  };
};

