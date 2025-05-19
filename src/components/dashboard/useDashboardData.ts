
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { isAuthenticatedSync } from "@/context/AuthContext";
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
        
        // First check if we have user from the auth context
        if (!user || !isAuthenticated) {
          logDebug('No user in auth context, checking if user is authenticated');
          
          // Use the sync method to check auth state without triggering additional fetches
          const isAuthed = isAuthenticatedSync();
          
          if (!isAuthed) {
            logDebug('User not authenticated via sync check');
            
            // Short retry with backoff - wait and check if auth context has updated
            const waitTime = 600; // Increased wait time
            logDebug(`Waiting ${waitTime}ms before checking auth again`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
            // If still no authenticated user after waiting, check with Supabase directly
            const { data: authData, error: authError } = await supabase.auth.getUser();
            
            if (authError || !authData.user) {
              logDebug('Still no authenticated user after direct check');
              throw new Error("User not authenticated");
            }
            
            logDebug('User authenticated via direct check', authData.user.id);
            return fetchUserRegulations(authData.user.id);
          }
        }
        
        // Happy path - use the user from auth context
        logDebug('Using user from auth context', user?.id);
        return fetchUserRegulations(user!.id);
      } catch (err) {
        logDebug("Error in query function:", err);
        throw err;
      }
    },
    enabled: isAuthenticated || user !== null || isAuthenticatedSync(),
    staleTime: 5 * 60 * 1000, // 5 minutes - increase stale time to reduce refetching
    retry: 3, // Retry failed requests a few times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
    refetchOnWindowFocus: false, // Disable refetching on window focus to reduce auth checks
    refetchOnMount: false, // Only fetch once per mount
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
