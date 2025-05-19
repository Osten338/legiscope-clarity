
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Types for our context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: Error | null;
  isInitialized: boolean; // New flag to track initialization status
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth State Manager - Simplified singleton pattern
class AuthStateManager {
  private static instance: AuthStateManager;
  public isAuthenticated = false;
  public isLoading = true;
  public userId: string | null = null;
  public lastVerifiedAt = 0;
  public isRedirecting = false;
  
  private constructor() {
    // Load initial state from sessionStorage if available
    const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    const userId = sessionStorage.getItem('auth:userId');
    
    this.isAuthenticated = sessionAuth;
    this.userId = userId;
    this.lastVerifiedAt = parseInt(sessionStorage.getItem('auth:lastChecked') || '0', 10);
  }
  
  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }
  
  public updateState(authenticated: boolean, userId: string | null): void {
    this.isAuthenticated = authenticated;
    this.userId = userId;
    this.lastVerifiedAt = Date.now();
    
    // Update sessionStorage
    if (authenticated && userId) {
      sessionStorage.setItem('auth:isAuthenticated', 'true');
      sessionStorage.setItem('auth:userId', userId);
      sessionStorage.setItem('auth:lastChecked', this.lastVerifiedAt.toString());
    } else {
      sessionStorage.removeItem('auth:isAuthenticated');
      sessionStorage.removeItem('auth:userId');
      sessionStorage.removeItem('auth:lastChecked');
    }
  }
}

// Get the singleton instance
const authStateManager = AuthStateManager.getInstance();

// Utility function to clean up auth state
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('auth:')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Clear any redirect history
  sessionStorage.removeItem('auth:redirectHistory');
  sessionStorage.removeItem('auth:breakingLoop');
};

// Function to check if user is authenticated without triggering a re-render
export const isAuthenticatedSync = (): boolean => {
  // Check session storage as a reliable indicator
  return sessionStorage.getItem('auth:isAuthenticated') === 'true';
};

// Safe hook for getting auth state outside the context
// This is a critical fallback for when the context isn't available yet
export const getAuthFallback = () => {
  // Simplified checks that don't require context
  const isAuthenticated = sessionStorage.getItem('auth:isAuthenticated') === 'true';
  const userId = sessionStorage.getItem('auth:userId');
  
  return {
    isAuthenticated,
    userId,
    isLoading: false
  };
};

// Provider component that will wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false); // Track initialization
  const authActionInProgressRef = useRef<boolean>(false);
  const navigate = useNavigate();
  
  // Debug mode - enable this to see detailed auth logs
  const isDebugEnabled = process.env.NODE_ENV === 'development';
  
  // Debug logging function
  const logAuth = (message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`[AUTH] ${message}`, data ? data : '');
    }
  };

  // Update auth state and pre-populate session storage for fast access
  useEffect(() => {
    // Update the singleton auth manager
    if (user?.id) {
      authStateManager.updateState(true, user.id);
    } else if (!isLoading && !isAuthenticated) {
      authStateManager.updateState(false, null);
    }
    
    logAuth('Auth state updated:', { isAuthenticated, isLoading, userId: user?.id });
  }, [user, isLoading, isAuthenticated]);

  // Initialize auth state and set up listeners
  useEffect(() => {
    // Prevent double initialization
    if (authActionInProgressRef.current) {
      logAuth("Auth initialization already in progress");
      return;
    }
    
    logAuth("Initializing auth state");
    authActionInProgressRef.current = true;
    
    // Fast path: Use cached auth state to show authenticated state immediately
    const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    const cachedUserId = sessionStorage.getItem('auth:userId');
    
    if (sessionAuth && cachedUserId) {
      logAuth("Using cached auth state");
      setIsAuthenticated(true);
      // Minimal user object to prevent UI flicker
      setUser({ id: cachedUserId } as User);
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logAuth("Auth state changed:", event);
        
        // Update state based on auth events
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          setAuthError(null);
          
          // Update sessionStorage
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:userId', currentSession.user.id);
          sessionStorage.setItem('auth:lastChecked', Date.now().toString());
          
          // Only redirect on sign in
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 100);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setAuthError(null);
          
          // Clear sessionStorage
          cleanupAuthState();
          
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 100);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logAuth("Error checking auth session:", error);
          setAuthError(error);
        } else if (data.session?.user) {
          setSession(data.session);
          setUser(data.session.user);
          setIsAuthenticated(true);
          
          // Update sessionStorage
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:userId', data.session.user.id);
          sessionStorage.setItem('auth:lastChecked', Date.now().toString());
        } else {
          // No valid session found
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        logAuth("Error checking auth:", error);
        setAuthError(error instanceof Error ? error : new Error('Unknown auth error'));
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // Mark context as initialized
        authActionInProgressRef.current = false;
      }
    };

    checkSession();

    // Clean up on unmount
    return () => {
      subscription.unsubscribe();
      authActionInProgressRef.current = false;
    };
  }, [navigate]);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      logAuth("Beginning sign in process");
      setIsLoading(true);
      setAuthError(null);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        setAuthError(result.error);
        toast.error("Sign in failed: " + result.error.message);
        logAuth("Sign in failed:", result.error);
      } else {
        toast.success("Signed in successfully!");
        logAuth("Sign in successful");
      }
      
      setIsLoading(false);
      return result;
    } catch (error: any) {
      logAuth("Sign in error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign in");
      setIsLoading(false);
      return { error, data: null };
    }
  };

  // Sign up method
  const signUp = async (email: string, password: string) => {
    try {
      logAuth("Beginning sign up process");
      setIsLoading(true);
      setAuthError(null);
      
      cleanupAuthState();
      
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });
      
      if (result.error) {
        logAuth("Sign up failed:", result.error);
        setAuthError(result.error);
        toast.error("Sign up failed: " + result.error.message);
      } else {
        logAuth("Sign up successful");
        toast.success("Sign up successful! Check your email for confirmation.");
      }
      
      setIsLoading(false);
      return result;
    } catch (error: any) {
      logAuth("Sign up error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign up");
      setIsLoading(false);
      return { error, data: null };
    }
  };

  // Sign out method - simplified and more reliable
  const signOut = async () => {
    try {
      logAuth("Beginning sign out process");
      setIsLoading(true);
      
      // Clean up local storage and session storage
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      logAuth("Sign out successful");
      
      // Force reload to ensure clean state
      window.location.href = '/auth';
    } catch (error) {
      logAuth("Sign out error:", error);
      // Force reload even if there was an error
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isAuthenticated,
    authError,
    isInitialized, // Expose initialization state
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context with fallback
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // If context isn't available, provide fallback values
  // This prevents errors when components render before AuthProvider is ready
  if (context === undefined) {
    const fallback = getAuthFallback();
    return {
      session: null,
      user: fallback.userId ? { id: fallback.userId } as User : null,
      isLoading: fallback.isLoading,
      isAuthenticated: fallback.isAuthenticated,
      authError: new Error("Auth context not available"),
      isInitialized: false,
      signIn: async () => ({ error: new Error("Auth context not available"), data: null }),
      signUp: async () => ({ error: new Error("Auth context not available"), data: null }),
      signOut: async () => { window.location.href = '/auth'; }
    } as AuthContextType;
  }
  
  return context;
};
