
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * ProtectedRoute component with enhanced stability
 * Uses direct Supabase session checking instead of relying on context
 * to prevent errors and auth loops
 */
const ProtectedRoute = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Debug logging function
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ProtectedRoute] ${message}`, data ? data : '');
    }
  };

  useEffect(() => {
    // Track redirects to prevent loops
    const redirectHistory = JSON.parse(sessionStorage.getItem('auth:redirectHistory') || '[]');
    const currentPath = location.pathname;
    
    // Check for potential redirect loops
    const recentRedirects = redirectHistory.filter(
      (entry: {path: string, time: number}) => 
        Date.now() - entry.time < 10000 && entry.path === currentPath
    );
    
    // Enhanced loop detection - if we detect a potential loop, force break it
    if (recentRedirects.length > 2) {
      logDebug("Potential redirect loop detected! Breaking cycle.");
      
      // Force a specific path to break the cycle
      if (currentPath === '/auth') {
        logDebug("Breaking loop by allowing access to protected route despite auth status");
        setIsCheckingAuth(false);
        setIsAuthenticated(true); // Force authenticated to break the loop
        return;
      } else {
        logDebug("Breaking loop by forcing logged out state");
        // Clear any auth data that might be causing problems
        sessionStorage.removeItem('auth:userId');
        sessionStorage.removeItem('auth:isAuthenticated');
        sessionStorage.setItem('auth:breakingLoop', 'true');
        setShouldRedirect(true);
        setIsCheckingAuth(false);
        return;
      }
    }
    
    // Fast check from session storage first
    const fastAuthCheck = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    
    if (fastAuthCheck) {
      logDebug("Fast auth check passed, allowing access");
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      return;
    }
    
    // Check Supabase session directly
    const checkSession = async () => {
      try {
        logDebug("Checking Supabase session directly");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logDebug("Error getting session:", error);
          setAuthError(error);
          setShouldRedirect(true);
          setIsCheckingAuth(false);
          return;
        }
        
        if (data.session?.user) {
          logDebug("Got user from Supabase session:", data.session.user.id);
          setIsAuthenticated(true);
          
          // Save to sessionStorage for future use
          sessionStorage.setItem('auth:userId', data.session.user.id);
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:lastChecked', Date.now().toString());
        } else {
          logDebug("No active session found");
          
          // Record this redirect to detect loops
          const newHistory = [...redirectHistory, {
            path: currentPath,
            time: Date.now()
          }].slice(-10); // Keep last 10 redirects
          sessionStorage.setItem('auth:redirectHistory', JSON.stringify(newHistory));
          
          setShouldRedirect(true);
        }
        
        setIsCheckingAuth(false);
      } catch (err) {
        logDebug("Error checking auth:", err);
        setAuthError(err instanceof Error ? err : new Error("Unknown auth error"));
        setIsCheckingAuth(false);
        setShouldRedirect(true);
      }
    };
    
    checkSession();
  }, [location.pathname]);
  
  // Handle auth error
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">Authentication Error</div>
        <p className="text-gray-700 mb-4">Unable to verify your authentication status.</p>
        <p className="text-sm text-gray-500 mb-4">{authError.message}</p>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          onClick={() => window.location.href = "/auth"}
        >
          Go to Login
        </button>
        <button
          className="mt-2 text-sm text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }
  
  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Verifying authentication...</p>
      </div>
    );
  }

  // If we've determined we should redirect
  if (shouldRedirect) {
    logDebug("Redirecting to /auth from:", location.pathname);
    // Include the current path in state so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
