
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

/**
 * AuthGuard component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
const AuthGuard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const processingAuthChange = useRef(false);
  const authTimeoutRef = useRef<number | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Clear any existing timeouts on re-renders
    if (authTimeoutRef.current) {
      window.clearTimeout(authTimeoutRef.current);
    }
    
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
    }
    
    console.log("AuthGuard mounted/updated, checking auth state");
    
    // Set up auth state listener first - with debounce mechanism
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("AuthGuard: Auth state changed:", event);
        
        // Prevent multiple rapid state changes
        if (processingAuthChange.current) {
          return;
        }
        
        processingAuthChange.current = true;
        
        // Debounce the authentication state change
        if (authTimeoutRef.current) {
          window.clearTimeout(authTimeoutRef.current);
        }
        
        // Use a timeout to debounce state updates
        authTimeoutRef.current = window.setTimeout(() => {
          setIsAuthenticated(!!currentSession);
          setSession(currentSession);
          processingAuthChange.current = false;
          console.log("AuthGuard: Auth state updated:", !!currentSession);
        }, 300);
      }
    );

    // Then check for existing session
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("AuthGuard: Current session:", data.session ? "exists" : "none");
        
        if (!processingAuthChange.current) {
          // Only update state if we're not already processing an auth change
          setIsAuthenticated(!!data.session);
          setSession(data.session);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    return () => {
      // Clean up timeout and listener on unmount
      if (authTimeoutRef.current) {
        window.clearTimeout(authTimeoutRef.current);
      }
      
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
      
      authListener?.subscription?.unsubscribe();
      processingAuthChange.current = false;
    };
  }, []);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page with return URL
  if (!isAuthenticated && !location.pathname.includes('/auth')) {
    console.log("AuthGuard: Not authenticated, redirecting to /auth", location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated but on auth page, redirect to intended destination
  if (isAuthenticated && location.pathname === '/auth') {
    console.log("AuthGuard: Already authenticated, checking redirect destination");
    
    // Prevent immediate redirect to avoid potential loops
    // Use the state from location if available, otherwise redirect to dashboard
    const redirectTo = location.state?.from || "/dashboard";
    console.log("AuthGuard: Redirecting to:", redirectTo);
    
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default AuthGuard;
