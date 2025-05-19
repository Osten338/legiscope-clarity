
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

// Auth State Manager - Singleton pattern implementation
class AuthStateManager {
  private static instance: AuthStateManager;
  private isInitialized = false;
  private isLocked = false;
  private lockPromise: Promise<void> | null = null;
  private lockResolve: (() => void) | null = null;
  
  // Auth state
  public isAuthenticated = false;
  public isLoading = true;
  public userId: string | null = null;
  public lastVerifiedAt = 0;
  public authStage: 'initializing' | 'checking' | 'verifying' | 'completed' = 'initializing';
  public isRedirecting = false;
  
  private constructor() {
    // Load initial state from sessionStorage if available
    const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    const userId = sessionStorage.getItem('auth:userId');
    const lastChecked = parseInt(sessionStorage.getItem('auth:lastChecked') || '0', 10);
    
    this.isAuthenticated = sessionAuth;
    this.userId = userId;
    this.lastVerifiedAt = lastChecked;
  }
  
  public static getInstance(): AuthStateManager {
    if (!AuthStateManager.instance) {
      AuthStateManager.instance = new AuthStateManager();
    }
    return AuthStateManager.instance;
  }
  
  // Acquire a lock for exclusive auth operations
  public async acquireLock(): Promise<void> {
    if (this.isLocked) {
      // If already locked, wait for the existing lock to be released
      return this.lockPromise!;
    }
    
    this.isLocked = true;
    this.lockPromise = new Promise((resolve) => {
      this.lockResolve = resolve;
    });
    
    return Promise.resolve();
  }
  
  // Release the lock
  public releaseLock(): void {
    if (!this.isLocked) return;
    
    this.isLocked = false;
    if (this.lockResolve) {
      this.lockResolve();
      this.lockResolve = null;
      this.lockPromise = null;
    }
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

// Create or get the singleton instance
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
  // Check the AuthStateManager first (most reliable)
  const manager = AuthStateManager.getInstance();
  
  // If we're currently in a redirecting state, return immediately
  if (manager.isRedirecting) {
    return false;
  }
  
  // If we've verified auth recently, trust the cached value
  const isCacheValid = Date.now() - manager.lastVerifiedAt < 30000;
  if (isCacheValid) {
    return manager.isAuthenticated;
  }
  
  // Check session storage as a fallback
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
  const authActionInProgressRef = useRef<boolean>(false);
  const authTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Debug mode - enable this to see detailed auth logs
  const isDebugEnabled = process.env.NODE_ENV === 'development';
  
  // Enhanced debug logging function
  const logAuth = (message: string, data?: any) => {
    if (isDebugEnabled) {
      console.log(`[AUTH] ${message}`, data ? data : '');
    }
  };

  // Update the auth state whenever state changes
  useEffect(() => {
    // Update the singleton auth manager
    if (user?.id) {
      authStateManager.updateState(true, user.id);
    } else if (!isLoading && !isAuthenticated) {
      // Only update to not authenticated if we're done loading
      authStateManager.updateState(false, null);
    }
    
    // Add debug logging in development mode
    logAuth('Auth provider state updated:', { 
      isAuthenticated,
      isLoading,
      userId: user?.id,
      stage: authStateManager.authStage
    });
  }, [user, isLoading, isAuthenticated]);

  useEffect(() => {
    // If auth action is in progress, don't initialize again
    if (authActionInProgressRef.current) {
      logAuth("AuthProvider: Auth action in progress, skipping initialization");
      return;
    }
    
    logAuth("AuthProvider: Initializing auth state");
    authStateManager.authStage = 'checking';
    
    // Prevent concurrent execution
    authActionInProgressRef.current = true;
    
    // Clear any existing timeouts
    if (authTimeoutRef.current) {
      window.clearTimeout(authTimeoutRef.current);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        logAuth("AuthProvider: Auth state changed:", event);
        
        // Set a timeout to debounce state updates and prevent race conditions
        if (authTimeoutRef.current) {
          window.clearTimeout(authTimeoutRef.current);
        }
        
        // Allow some time for auth state to stabilize
        authTimeoutRef.current = window.setTimeout(async () => {
          try {
            // Acquire a lock to ensure exclusive access to auth state
            await authStateManager.acquireLock();
            
            authStateManager.authStage = 'verifying';
            
            // If we have a session and user, update state
            if (currentSession?.user) {
              setSession(currentSession);
              setUser(currentSession.user);
              setIsAuthenticated(true);
              setAuthError(null);
              
              // Update the manager
              authStateManager.updateState(true, currentSession.user.id);
            } else if (event === 'SIGNED_OUT') {
              setSession(null);
              setUser(null);
              setIsAuthenticated(false);
              setAuthError(null);
              
              // Update the manager
              authStateManager.updateState(false, null);
            }
            
            // Mark loading as complete
            setIsLoading(false);
            authStateManager.isLoading = false;
            authStateManager.authStage = 'completed';
            
            // Handle navigation with a delay to prevent immediate redirect
            if (!authStateManager.isRedirecting) {
              if (event === 'SIGNED_IN' && currentSession) {
                authStateManager.isRedirecting = true;
                logAuth("Auth state change: Redirecting to dashboard after sign in");
                
                // Use a short delay to allow state to stabilize
                setTimeout(() => {
                  navigate('/dashboard', { replace: true });
                  setTimeout(() => {
                    authStateManager.isRedirecting = false;
                  }, 1000);
                }, 300);
              } else if (event === 'SIGNED_OUT') {
                authStateManager.isRedirecting = true;
                logAuth("Auth state change: Redirecting to auth after sign out");
                
                // Use a short delay to allow state to stabilize
                setTimeout(() => {
                  navigate('/auth', { replace: true });
                  setTimeout(() => {
                    authStateManager.isRedirecting = false;
                  }, 1000);
                }, 300);
              }
            }
          } catch (err) {
            logAuth("Auth state change error:", err);
          } finally {
            // Release the lock
            authStateManager.releaseLock();
            authTimeoutRef.current = null;
          }
        }, 500); // Increased debounce timeout for stability while still being responsive
      }
    );

    // Check for existing session with proper locking
    const checkSession = async () => {
      try {
        // Use cached state if available for immediate UI update
        const sessionAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
        const cachedUserId = sessionStorage.getItem('auth:userId');
        const authLastChecked = parseInt(sessionStorage.getItem('auth:lastChecked') || '0', 10);
        const isRecentCheck = Date.now() - authLastChecked < 60000; // Last checked within a minute
        
        // Fast path: Use cached auth state to show authenticated state immediately
        if (sessionAuth && isRecentCheck && cachedUserId) {
          logAuth("Using cached auth state from sessionStorage");
          setIsAuthenticated(true);
          // Minimal user object to prevent UI flicker
          setUser({ id: cachedUserId } as User);
        }
        
        // Acquire lock for session check
        await authStateManager.acquireLock();
        
        // Still do a Supabase check to verify the session is valid
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logAuth("Error checking auth session:", error);
          setAuthError(error);
          setIsLoading(false);
          authStateManager.isLoading = false;
          return;
        }
        
        if (data.session?.user) {
          setSession(data.session);
          setUser(data.session.user);
          setIsAuthenticated(true);
          setAuthError(null);
          
          // Update manager
          authStateManager.updateState(true, data.session.user.id);
        } else {
          // No valid session found
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          
          // Update manager
          authStateManager.updateState(false, null);
        }
        
        setIsLoading(false);
        authStateManager.isLoading = false;
        authStateManager.authStage = 'completed';
      } catch (error) {
        logAuth("Error checking auth:", error);
        setAuthError(error instanceof Error ? error : new Error('Unknown auth error'));
        setIsLoading(false);
        authStateManager.isLoading = false;
      } finally {
        // Release lock
        authStateManager.releaseLock();
        authActionInProgressRef.current = false;
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
      authActionInProgressRef.current = false;
    };
  }, [navigate]);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      // Prevent concurrent auth operations
      await authStateManager.acquireLock();
      
      logAuth("Beginning sign in process");
      setIsLoading(true);
      authStateManager.isLoading = true;
      setAuthError(null);
      
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
        setIsLoading(false);
        authStateManager.isLoading = false;
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
      setIsLoading(false);
      authStateManager.isLoading = false;
      return { error, data: null };
    } finally {
      // Release lock
      authStateManager.releaseLock();
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Prevent concurrent auth operations
      await authStateManager.acquireLock();
      
      logAuth("Beginning sign up process");
      setIsLoading(true);
      authStateManager.isLoading = true;
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
      }
      
      setIsLoading(false);
      authStateManager.isLoading = false;
      return result;
    } catch (error: any) {
      logAuth("Sign up error:", error);
      setAuthError(error);
      toast.error("An unexpected error occurred during sign up");
      setIsLoading(false);
      authStateManager.isLoading = false;
      return { error, data: null };
    } finally {
      // Release lock
      authStateManager.releaseLock();
    }
  };

  const signOut = async () => {
    try {
      // Prevent concurrent auth operations
      await authStateManager.acquireLock();
      
      logAuth("Beginning sign out process");
      setIsLoading(true);
      authStateManager.isLoading = true;
      
      // Clean up local storage and session storage
      cleanupAuthState();
      
      // Sign out from Supabase with global scope
      await supabase.auth.signOut({ scope: 'global' });
      logAuth("Sign out successful");
      
      // Force reload to ensure clean state
      window.location.href = '/auth';
    } catch (error) {
      logAuth("Sign out error:", error);
      // Force reload even if there was an error
      window.location.href = '/auth';
    } finally {
      // Lock will be auto-released on page load
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
