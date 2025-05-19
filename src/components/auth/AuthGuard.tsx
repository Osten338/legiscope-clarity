
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setIsAuthenticated(!!currentSession);
        setSession(currentSession);
      }
    );

    // Then check for existing session
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current session:", data.session ? "exists" : "none");
      setIsAuthenticated(!!data.session);
      setSession(data.session);
    };

    checkAuth();

    return () => {
      authListener?.subscription?.unsubscribe();
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
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default AuthGuard;
