
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { SavedRegulation } from "./types";

export const useDashboardData = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations', user?.id],
    queryFn: async () => {
      try {
        // First check if we already have user from the auth context
        if (!user || !isAuthenticated) {
          // Short retry - wait and check if auth context has updated
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // If still no user, check with Supabase directly
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError || !authData.user) {
            throw new Error("User not authenticated");
          }
          
          return fetchUserRegulations(authData.user.id);
        }
        
        // Happy path - use the user from auth context
        return fetchUserRegulations(user.id);
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
    enabled: isAuthenticated || user !== null,
    staleTime: 5 * 60 * 1000, // 5 minutes - increase stale time to reduce refetching
    retry: 3, // Retry failed requests a few times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
  
  // Helper function to fetch user regulations
  const fetchUserRegulations = async (userId: string) => {
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
      .eq('user_id', userId);
      
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
  };

  return {
    savedRegulations,
    isLoading,
    error,
    refetch
  };
};
