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

// Global initialization flag to prevent multiple initializations
let isAuthInitialized = false;

// Auth state reference that can be checked without triggering re-renders
const authStateRef = {
  isAuthenticated: false,
  isLoading: true,
  userId: null as string | null,
  lastVerifiedAt: 0
};

// Utility function to clean up auth state
const cleanupAuthState = () => {
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
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

// Function to check if user is authenticated without triggering a re-render
export const isAuthenticatedSync = (): boolean => {
  // If we've verified auth in the last 15 seconds, trust the cached value
  const isCacheValid = Date.now() - authStateRef.lastVerifiedAt < 15000;
  if (isCacheValid) {
    return authStateRef.isAuthenticated;
  }
  // Otherwise suggest checking the context value
  return false;
};

// Provider component that will wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const processingAuthChangeRef = useRef<boolean>(false);
  const authTimeoutRef = useRef<number | null>(null);
  const lastCheckTimeRef = useRef<number>(0);
  const stabilityTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  // Update the auth state reference whenever state changes
  useEffect(() => {
    authStateRef.isAuthenticated = !!user;
    authStateRef.isLoading = isLoading;
    authStateRef.userId = user?.id || null;
    authStateRef.lastVerifiedAt = Date.now();
    
    // Add debug logging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Auth state updated:', { 
        isAuthenticated: authStateRef.isAuthenticated,
        isLoading: authStateRef.isLoading,
        userId: authStateRef.userId
      });
    }
  }, [user, isLoading]);

  useEffect(() => {
    // If already initialized, don't do it again
    if (isAuthInitialized) {
      console.log("AuthProvider: Already initialized globally, skipping");
      setIsLoading(false);
      return;
    }
    
    console.log("AuthProvider: initializing auth state");
    isAuthInitialized = true;
    const now = Date.now();
    
    // Avoid frequent re-initializations
    if (now - lastCheckTimeRef.current < 10000) {
      console.log("AuthProvider: skipping initialization, last check was very recent");
      return;
    }
    
    lastCheckTimeRef.current = now;
    
    // Clear any existing timeouts
    if (authTimeoutRef.current) {
      window.clearTimeout(authTimeoutRef.current);
    }
    
    if (stabilityTimeoutRef.current) {
      window.clearTimeout(stabilityTimeoutRef.current);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthProvider: Auth state changed:", event);
        
        // Prevent multiple rapid state changes
        if (processingAuthChangeRef.current) {
          console.log("AuthProvider: Already processing auth change, skipping");
          return;
        }
        
        processingAuthChangeRef.current = true;
        
        // Clear any existing timeout
        if (authTimeoutRef.current) {
          window.clearTimeout(authTimeoutRef.current);
        }
        
        // Use a longer timeout to debounce state updates
        authTimeoutRef.current = window.setTimeout(() => {
          if (currentSession?.user?.id !== user?.id || !currentSession !== !session) {
            console.log("AuthProvider: User or session changed, updating state");
            
            const newIsAuthenticated = !!currentSession?.user;
            setSession(currentSession);
            setUser(currentSession?.user || null);
            setIsAuthenticated(newIsAuthenticated);
            
            // Store auth state in sessionStorage for faster access
            if (newIsAuthenticated) {
              sessionStorage.setItem('auth:isAuthenticated', 'true');
              sessionStorage.setItem('auth:userId', currentSession.user.id);
            } else {
              sessionStorage.removeItem('auth:isAuthenticated');
              sessionStorage.removeItem('auth:userId');
            }
          }
          
          setAuthError(null);
          setIsLoading(false);
          processingAuthChangeRef.current = false;
          console.log("AuthProvider: Auth state updated:", !!currentSession);
          
          // Add a stability timeout - defer navigation until auth state is stable
          if (stabilityTimeoutRef.current) {
            window.clearTimeout(stabilityTimeoutRef.current);
          }
          
          // Handle navigation on sign in/out events with a delay
          stabilityTimeoutRef.current = window.setTimeout(() => {
            if (event === 'SIGNED_IN' && currentSession) {
              navigate('/dashboard', { replace: true });
            } else if (event === 'SIGNED_OUT') {
              navigate('/auth', { replace: true });
            }
            stabilityTimeoutRef.current = null;
          }, 300); // Short delay to ensure state is stable
          
        }, 500); // Decreased debounce timeout for responsiveness while still preventing flicker
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          setAuthError(error);
          setIsLoading(false);
          return;
        }
        
        console.log("AuthProvider: Current session:", data.session ? "exists" : "none");
        
        if (!processingAuthChangeRef.current) {
          // Only update state if we're not already processing an auth change
          if (data.session?.user?.id !== user?.id || !data.session !== !session) {
            const newIsAuthenticated = !!data.session?.user;
            setSession(data.session);
            setUser(data.session?.user || null);
            setIsAuthenticated(newIsAuthenticated);
            
            // Store auth state in sessionStorage for faster access
            if (newIsAuthenticated) {
              sessionStorage.setItem('auth:isAuthenticated', 'true');
              sessionStorage.setItem('auth:userId', data.session.user.id);
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setAuthError(error instanceof Error ? error : new Error('Unknown auth error'));
        setIsLoading(false);
      }
    };

    checkSession();

    // Clean up on unmount
    return () => {
      subscription.unsubscribe();
      if (authTimeoutRef.current) {
        window.clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
      if (stabilityTimeoutRef.current) {
        window.clearTimeout(stabilityTimeoutRef.current);
        stabilityTimeoutRef.current = null;
      }
      processingAuthChangeRef.current = false;
    };
  }, [navigate, user, session]); // Update dependencies to include user and session

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing:", err);
      }
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        setAuthError(result.error);
        toast.error("Sign in failed: " + result.error.message);
      } else {
        toast.success("Signed in successfully!");
        // Auth state will be updated by onAuthStateChange listener
      }
      
      return result;
    } catch (error: any) {
      console.error("Sign in error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign in");
      return { error, data: null };
    } finally {
      // Don't set isLoading to false here - let the auth state change handler do it
      // This prevents flickering during navigation
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
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
        setAuthError(result.error);
        toast.error("Sign up failed: " + result.error.message);
      }
      
      return result;
    } catch (error: any) {
      console.error("Sign up error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign up");
      return { error, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      cleanupAuthState();
      
      // Clear session storage auth flags
      sessionStorage.removeItem('auth:isAuthenticated');
      sessionStorage.removeItem('auth:userId');
      
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force a page reload after sign out to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error("Sign out error:", error);
      // If error during signout, force a clean state anyway
      window.location.href = '/auth';
    }
  };

  const value = {
    session,
    user,
    isLoading,
    isAuthenticated,
    authError,
    signIn,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
