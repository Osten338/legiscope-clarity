
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import type { SavedRegulation } from "./types";

export const useDashboardData = () => {
  const { toast } = useToast();
  const [authState, setAuthState] = useState<{
    user: any | null;
    isAuthenticated: boolean;
  }>({ user: null, isAuthenticated: false });
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Enhanced debug logger
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DashboardData] ${message}`, data ? data : '');
    }
  };

  // Get user ID directly from Supabase or session storage
  useEffect(() => {
    const checkSession = async () => {
      try {
        logDebug("Initializing dashboard data...");
        setIsInitializing(true);
        
        // Try using sessionStorage as an immediate fallback to prevent flicker
        const fallbackUserId = sessionStorage.getItem('auth:userId');
        const fallbackAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
        
        if (fallbackUserId && fallbackAuth) {
          logDebug("Using user ID from session storage:", fallbackUserId);
          setAuthState({ 
            user: { id: fallbackUserId },
            isAuthenticated: true
          });
        }
        
        // Now check with Supabase directly
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logDebug("Error getting session:", error);
          setAuthError(error);
          return;
        }
        
        if (data.session?.user) {
          logDebug("Got user from Supabase session:", data.session.user.id);
          setAuthState({
            user: data.session.user,
            isAuthenticated: true
          });
          
          // Update sessionStorage for future fast access
          sessionStorage.setItem('auth:userId', data.session.user.id);
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:lastChecked', Date.now().toString());
        } else {
          logDebug("No active session found");
          setAuthError(new Error("No active session found"));
        }
      } catch (err) {
        logDebug("Error checking auth:", err);
        setAuthError(err instanceof Error ? err : new Error("Unknown auth error"));
      } finally {
        setIsInitializing(false);
      }
    };
    
    checkSession();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        logDebug("Auth state changed: SIGNED_IN");
        setAuthState({
          user: session.user,
          isAuthenticated: true
        });
        
        // Update sessionStorage
        sessionStorage.setItem('auth:userId', session.user.id);
        sessionStorage.setItem('auth:isAuthenticated', 'true');
        sessionStorage.setItem('auth:lastChecked', Date.now().toString());
      } else if (event === 'SIGNED_OUT') {
        logDebug("Auth state changed: SIGNED_OUT");
        setAuthState({
          user: null,
          isAuthenticated: false
        });
        
        // Clear sessionStorage
        sessionStorage.removeItem('auth:userId');
        sessionStorage.removeItem('auth:isAuthenticated');
        sessionStorage.removeItem('auth:lastChecked');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations', authState.user?.id],
    queryFn: async () => {
      try {
        logDebug('Starting to fetch saved regulations');
        
        // Verify we have a valid user ID
        if (!authState.user?.id) {
          logDebug('No user ID available, cannot fetch data');
          throw new Error("User ID required to fetch regulations");
        }
        
        return fetchUserRegulations(authState.user.id);
      } catch (err) {
        logDebug("Error in query function:", err);
        throw err;
      }
    },
    enabled: Boolean(authState.user?.id && authState.isAuthenticated && !isInitializing),
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
    isLoading: isLoading || isInitializing,
    error,
    authError,
    refetch,
    isInitializing
  };
};
