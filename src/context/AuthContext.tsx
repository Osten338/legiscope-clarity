
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

// Types for our context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
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

// Provider component that will wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const authStateRef = useRef<boolean>(false);
  const authTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider: initializing auth state");
    
    // Clear any existing timeouts
    if (authTimeoutRef.current) {
      window.clearTimeout(authTimeoutRef.current);
    }

    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthProvider: Auth state changed:", event);
        
        // Prevent multiple rapid state changes
        if (authStateRef.current) {
          return;
        }
        
        authStateRef.current = true;
        
        // Clear any existing timeout
        if (authTimeoutRef.current) {
          window.clearTimeout(authTimeoutRef.current);
        }
        
        // Use a 300ms timeout to debounce state updates
        authTimeoutRef.current = window.setTimeout(() => {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          setIsLoading(false);
          authStateRef.current = false;
          console.log("AuthProvider: Auth state updated:", !!currentSession);
          
          // Handle navigation on sign in/out events
          if (event === 'SIGNED_IN' && currentSession) {
            // Add a small delay for redirect
            setTimeout(() => navigate('/dashboard', { replace: true }), 100);
          } else if (event === 'SIGNED_OUT') {
            // Redirect to auth on sign out
            navigate('/auth', { replace: true });
          }
        }, 300);
      }
    );

    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("AuthProvider: Current session:", data.session ? "exists" : "none");
        
        if (!authStateRef.current) {
          // Only update state if we're not already processing an auth change
          setSession(data.session);
          setUser(data.session?.user || null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    checkSession();

    // Clean up on unmount
    return () => {
      subscription.unsubscribe();
      if (authTimeoutRef.current) {
        window.clearTimeout(authTimeoutRef.current);
      }
      authStateRef.current = false;
    };
  }, [navigate]);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing:", err);
      }
      
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error: any) {
      console.error("Sign in error:", error);
      return { error, data: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      cleanupAuthState();
      
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    session,
    user,
    isLoading,
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
