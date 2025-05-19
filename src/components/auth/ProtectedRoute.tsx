
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, isAuthenticatedSync } from "@/context/AuthContext";

/**
 * ProtectedRoute component with enhanced stability
 * Uses multi-stage verification and increased grace periods
 * to prevent premature redirects and auth loops
 */
const ProtectedRoute = () => {
  // Safely access auth context
  const [authContextError, setAuthContextError] = useState<Error | null>(null);
  const [auth, setAuth] = useState<any>(null);
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [authContextAvailable, setAuthContextAvailable] = useState(false);

  // Debug logging function
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ProtectedRoute] ${message}`, data ? data : '');
    }
  };

  // Safely get auth context without crashing if it's not ready
  useEffect(() => {
    try {
      const authContext = useAuth();
      setAuth(authContext);
      setAuthContextAvailable(true);
      logDebug("Auth context retrieved successfully", authContext);
    } catch (err) {
      logDebug("Error retrieving auth context:", err);
      setAuthContextError(err instanceof Error ? err : new Error("Unknown auth error"));
      setAuthContextAvailable(false);
      
      // Retry getting auth context after a delay
      const retryTimer = setTimeout(() => {
        try {
          const authContext = useAuth();
          setAuth(authContext);
          setAuthContextAvailable(true);
          logDebug("Auth context retrieved successfully on retry", authContext);
        } catch (retryErr) {
          logDebug("Failed to retrieve auth context on retry:", retryErr);
          // If we still can't get auth context, we'll handle it below
        }
      }, 1000);
      
      return () => clearTimeout(retryTimer);
    }
  }, []);
  
  useEffect(() => {
    if (!authContextAvailable) {
      // Don't proceed with auth checks if the context isn't available
      return;
    }

    // Extract auth state from context if available
    const user = auth?.user;
    const isLoading = auth?.isLoading || false;
    const isAuthenticated = auth?.isAuthenticated || false;
    
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
      // Force a specific path to break the cycle - don't get stuck between auth and protected routes
      if (currentPath === '/auth') {
        logDebug("Breaking loop by allowing access to protected route despite auth status");
        // Let the protected route render, the component error boundary will handle issues
        setIsCheckingAuth(false);
        setShouldRedirect(false);
        return;
      } else {
        logDebug("Breaking loop by redirecting to auth with a marker");
        // Add a special marker to indicate we're breaking a loop
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
      setIsCheckingAuth(false);
      return;
    }
    
    // If initial auth check is still loading, wait longer before making decisions
    if (isLoading) {
      logDebug("Auth is still loading, waiting...");
      return;
    }
    
    // If we have a definite authentication state, update accordingly
    if (isAuthenticated && user) {
      logDebug("User is authenticated, allowing access");
      setIsCheckingAuth(false);
      return;
    }
    
    // Progressive verification with increasing delays
    const verificationDelay = Math.min(1000 + (verificationAttempts * 500), 3000);
    
    // Multi-stage verification with significantly increased grace period
    const verificationTimer = setTimeout(() => {
      logDebug(`Verification attempt ${verificationAttempts + 1}, checking auth status`);
      
      // Double-check auth state through multiple channels
      const syncAuthCheck = isAuthenticatedSync();
      const sessionAuthCheck = sessionStorage.getItem('auth:isAuthenticated') === 'true';
      const contextAuthCheck = isAuthenticated && !!user;
      
      logDebug("Auth checks:", {
        syncAuthCheck,
        sessionAuthCheck,
        contextAuthCheck,
        isLoading,
        authContextAvailable
      });
      
      if (syncAuthCheck || sessionAuthCheck || contextAuthCheck) {
        // User is authenticated through at least one check
        logDebug("Secondary auth check passed, allowing access");
        setIsCheckingAuth(false);
      } else if (verificationAttempts < 2) {
        // Try again with increased delay
        logDebug("Auth check failed, trying again");
        setVerificationAttempts(prev => prev + 1);
      } else {
        // After several attempts, if still not authenticated, redirect
        logDebug("All auth checks failed after multiple attempts, redirecting to /auth");
        
        // Record this redirect to detect loops
        const newHistory = [...redirectHistory, {
          path: currentPath,
          time: Date.now()
        }].slice(-10); // Keep last 10 redirects
        sessionStorage.setItem('auth:redirectHistory', JSON.stringify(newHistory));
        
        setShouldRedirect(true);
        setIsCheckingAuth(false);
      }
    }, verificationDelay);
    
    return () => {
      clearTimeout(verificationTimer);
    };
  }, [auth, isCheckingAuth, verificationAttempts, location.pathname, authContextAvailable]);
  
  // Handle auth context error
  if (authContextError && !authContextAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">Authentication Error</div>
        <p className="text-gray-700 mb-4">Unable to access authentication service.</p>
        <p className="text-sm text-gray-500 mb-4">{authContextError.message}</p>
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
  
  // Show loading state while checking authentication or waiting for context
  if (!authContextAvailable) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Initializing authentication...</p>
        <p className="text-xs text-muted-foreground mt-2">Auth context not available yet</p>
      </div>
    );
  }
  
  if (auth?.isLoading || isCheckingAuth) {
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
