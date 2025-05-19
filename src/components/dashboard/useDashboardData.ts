
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { SavedRegulation } from "./types";

export const useDashboardData = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  
  // Enhanced debug logger
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DashboardData] ${message}`, data ? data : '');
    }
  };

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations', user?.id],
    queryFn: async () => {
      try {
        logDebug('Starting to fetch saved regulations');
        
        // Verify we have a valid user ID
        if (!user?.id) {
          logDebug('No user ID available, cannot fetch data');
          throw new Error("User ID required to fetch regulations");
        }
        
        return fetchUserRegulations(user.id);
      } catch (err) {
        logDebug("Error in query function:", err);
        throw err;
      }
    },
    enabled: Boolean(user?.id && isAuthenticated),
    staleTime: 5 * 60 * 1000, // 5 minutes cache validity
    retry: (failureCount, error) => {
      // Only retry a few times with increasing backoff
      if (failureCount >= 3) return false;
      
      // Add exponential backoff for retries
      setTimeout(() => {
        logDebug(`Retry attempt ${failureCount + 1} after error:`, error);
      }, Math.min(1000 * 2 ** failureCount, 8000));
      
      return true;
    },
    refetchOnWindowFocus: false, // Disable excessive refetching
    refetchOnMount: true, // Always fetch fresh data on mount
  });
  
  // Helper function to fetch user regulations
  const fetchUserRegulations = async (userId: string) => {
    logDebug('Fetching regulations for user', userId);
    
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
      logDebug("Supabase error:", error);
      toast({
        title: "Data loading error",
        description: "Could not load your saved regulations. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
    
    logDebug("Saved regulations data retrieved:", savedRegs?.length);
    
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
