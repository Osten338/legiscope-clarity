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

// Centralized global auth state reference that can be accessed without triggering re-renders
const authStateRef = {
  isAuthenticated: false,
  isLoading: true,
  userId: null as string | null,
  lastVerifiedAt: 0,
  isAuthLocked: false, // New flag to prevent parallel auth operations
  isRedirecting: false, // New flag to prevent multiple redirects
  authStage: 'initializing' as 'initializing' | 'checking' | 'verifying' | 'completed'
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
  
  // Clear our custom flags
  sessionStorage.removeItem('auth:isAuthenticated');
  sessionStorage.removeItem('auth:userId');
  sessionStorage.removeItem('auth:lastChecked');
};

// Function to check if user is authenticated without triggering a re-render
export const isAuthenticatedSync = (): boolean => {
  // If we're currently in a redirecting state, return immediately
  if (authStateRef.isRedirecting) {
    return false;
  }
  
  // If we've verified auth in the last 30 seconds, trust the cached value
  const isCacheValid = Date.now() - authStateRef.lastVerifiedAt < 30000;
  if (isCacheValid) {
    return authStateRef.isAuthenticated;
  }
  
  // Check session storage for faster access
  const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
  const authLastChecked = parseInt(sessionStorage.getItem('auth:lastChecked') || '0', 10);
  const isRecentCheck = Date.now() - authLastChecked < 60000; // Last checked within a minute
  
  if (sessionAuth && isRecentCheck) {
    return true;
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
  
  // Debug mode - enable this to see detailed auth logs
  const isDebugEnabled = process.env.NODE_ENV === 'development';
  
  // Enhanced debug logging function
  const logAuth = (message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`[AUTH] ${message}`, data ? data : '');
    }
  };

  // Update the auth state reference whenever state changes
  useEffect(() => {
    authStateRef.isAuthenticated = !!user;
    authStateRef.isLoading = isLoading;
    authStateRef.userId = user?.id || null;
    authStateRef.lastVerifiedAt = Date.now();
    
    // Store auth state in sessionStorage for faster access
    if (authStateRef.isAuthenticated && user?.id) {
      sessionStorage.setItem('auth:isAuthenticated', 'true');
      sessionStorage.setItem('auth:userId', user.id);
      sessionStorage.setItem('auth:lastChecked', Date.now().toString());
    }
    
    // Add debug logging in development mode
    logAuth('Auth state updated:', { 
      isAuthenticated: authStateRef.isAuthenticated,
      isLoading: authStateRef.isLoading,
      userId: authStateRef.userId,
      stage: authStateRef.authStage
    });
  }, [user, isLoading]);

  useEffect(() => {
    // If already initialized, don't do it again
    if (isAuthInitialized) {
      logAuth("AuthProvider: Already initialized globally, skipping");
      setIsLoading(false);
      return;
    }
    
    logAuth("AuthProvider: initializing auth state");
    isAuthInitialized = true;
    authStateRef.authStage = 'checking';
    const now = Date.now();
    
    // Avoid frequent re-initializations
    if (now - lastCheckTimeRef.current < 10000) {
      logAuth("AuthProvider: skipping initialization, last check was very recent");
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

    // Set up auth state listener with lock mechanism to prevent overlapping auth operations
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logAuth("AuthProvider: Auth state changed:", event);
        
        // Prevent multiple rapid state changes
        if (processingAuthChangeRef.current) {
          logAuth("AuthProvider: Already processing auth change, skipping");
          return;
        }
        
        processingAuthChangeRef.current = true;
        authStateRef.authStage = 'verifying';
        
        // Clear any existing timeout
        if (authTimeoutRef.current) {
          window.clearTimeout(authTimeoutRef.current);
        }
        
        // Use a longer timeout to debounce state updates
        authTimeoutRef.current = window.setTimeout(() => {
          // Second layer check to prevent race conditions
          if (authStateRef.isAuthLocked) {
            logAuth("Auth is locked, deferring state update");
            processingAuthChangeRef.current = false;
            return;
          }
          
          // Lock auth operations during this critical section
          authStateRef.isAuthLocked = true;
          
          try {
            if (currentSession?.user?.id !== user?.id || !currentSession !== !session) {
              logAuth("AuthProvider: User or session changed, updating state");
              
              const newIsAuthenticated = !!currentSession?.user;
              setSession(currentSession);
              setUser(currentSession?.user || null);
              setIsAuthenticated(newIsAuthenticated);
              
              // Store auth state in sessionStorage for faster access
              if (newIsAuthenticated) {
                sessionStorage.setItem('auth:isAuthenticated', 'true');
                sessionStorage.setItem('auth:userId', currentSession.user.id);
                sessionStorage.setItem('auth:lastChecked', Date.now().toString());
              } else {
                sessionStorage.removeItem('auth:isAuthenticated');
                sessionStorage.removeItem('auth:userId');
                sessionStorage.removeItem('auth:lastChecked');
              }
            }
            
            setAuthError(null);
            setIsLoading(false);
            authStateRef.authStage = 'completed';
            logAuth("AuthProvider: Auth state updated:", !!currentSession);
          } finally {
            processingAuthChangeRef.current = false;
            authStateRef.isAuthLocked = false;
          }
          
          // Add a stability timeout - defer navigation until auth state is stable
          if (stabilityTimeoutRef.current) {
            window.clearTimeout(stabilityTimeoutRef.current);
          }
          
          // Handle navigation on sign in/out events with a delay
          stabilityTimeoutRef.current = window.setTimeout(() => {
            // Prevent navigation if we're already redirecting
            if (authStateRef.isRedirecting) {
              logAuth("Already redirecting, skipping navigation");
              return;
            }
            
            if (event === 'SIGNED_IN' && currentSession) {
              authStateRef.isRedirecting = true;
              logAuth("Redirecting to dashboard after sign in");
              navigate('/dashboard', { replace: true });
              setTimeout(() => {
                authStateRef.isRedirecting = false;
              }, 1000);
            } else if (event === 'SIGNED_OUT') {
              authStateRef.isRedirecting = true;
              logAuth("Redirecting to auth after sign out");
              navigate('/auth', { replace: true });
              setTimeout(() => {
                authStateRef.isRedirecting = false;
              }, 1000);
            }
            stabilityTimeoutRef.current = null;
          }, 500); // Increased delay for more stability
          
        }, 800); // Increased debounce timeout for stability while still being responsive
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        // First check for fast path through sessionStorage
        const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
        const authLastChecked = parseInt(sessionStorage.getItem('auth:lastChecked') || '0', 10);
        const isRecentCheck = Date.now() - authLastChecked < 60000; // Last checked within a minute
        
        if (sessionAuth && isRecentCheck) {
          logAuth("Using cached auth state from sessionStorage");
          // We'll still verify with Supabase, but we can show authenticated state immediately
          setIsAuthenticated(true);
          const cachedUserId = sessionStorage.getItem('auth:userId');
          if (cachedUserId) {
            setUser({ id: cachedUserId } as User); // Minimal user object
          }
        }
        
        // Still do a Supabase check to verify the session is valid
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logAuth("Error checking auth session:", error);
          setAuthError(error);
          setIsLoading(false);
          return;
        }
        
        logAuth("AuthProvider: Current session:", data.session ? "exists" : "none");
        
        // Only update state if we're not already processing an auth change
        if (!processingAuthChangeRef.current) {
          if (data.session?.user?.id !== user?.id || !data.session !== !session) {
            const newIsAuthenticated = !!data.session?.user;
            setSession(data.session);
            setUser(data.session?.user || null);
            setIsAuthenticated(newIsAuthenticated);
            
            // Store auth state in sessionStorage for faster access
            if (newIsAuthenticated) {
              sessionStorage.setItem('auth:isAuthenticated', 'true');
              sessionStorage.setItem('auth:userId', data.session.user.id);
              sessionStorage.setItem('auth:lastChecked', Date.now().toString());
            } else {
              sessionStorage.removeItem('auth:isAuthenticated');
              sessionStorage.removeItem('auth:userId');
            }
          }
          authStateRef.authStage = 'completed';
          setIsLoading(false);
        }
      } catch (error) {
        logAuth("Error checking auth:", error);
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
      authStateRef.authStage = 'initializing';
    };
  }, [navigate, user, session]); // Update dependencies to include user and session

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      logAuth("Beginning sign in process");
      setIsLoading(true);
      setAuthError(null);
      
      // Lock auth state during sign in
      authStateRef.isAuthLocked = true;
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        logAuth("Global sign out failed, continuing:", err);
      }
      
      const result = await supabase.auth.signInWithPassword({ email, password });
      
      if (result.error) {
        setAuthError(result.error);
        toast.error("Sign in failed: " + result.error.message);
        logAuth("Sign in failed:", result.error);
      } else {
        toast.success("Signed in successfully!");
        logAuth("Sign in successful, session established");
        // Auth state will be updated by onAuthStateChange listener
      }
      
      return result;
    } catch (error: any) {
      logAuth("Sign in error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign in");
      return { error, data: null };
    } finally {
      // Don't set isLoading to false here - let the auth state change handler do it
      // This prevents flickering during navigation
      authStateRef.isAuthLocked = false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      logAuth("Beginning sign up process");
      setIsLoading(true);
      setAuthError(null);
      
      // Lock auth state during sign up
      authStateRef.isAuthLocked = true;
      
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
      }
      
      return result;
    } catch (error: any) {
      logAuth("Sign up error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign up");
      return { error, data: null };
    } finally {
      setIsLoading(false);
      authStateRef.isAuthLocked = false;
    }
  };

  const signOut = async () => {
    try {
      logAuth("Beginning sign out process");
      setIsLoading(true);
      
      // Lock auth state during sign out
      authStateRef.isAuthLocked = true;
      
      cleanupAuthState();
      
      // Clear session storage auth flags
      sessionStorage.removeItem('auth:isAuthenticated');
      sessionStorage.removeItem('auth:userId');
      sessionStorage.removeItem('auth:lastChecked');
      
      await supabase.auth.signOut({ scope: 'global' });
      logAuth("Sign out successful");
      
      // Force a page reload after sign out to ensure clean state
      setTimeout(() => {
        authStateRef.isAuthLocked = false;
        window.location.href = '/auth';
      }, 300);
    } catch (error) {
      logAuth("Sign out error:", error);
      // If error during signout, force a clean state anyway
      authStateRef.isAuthLocked = false;
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
