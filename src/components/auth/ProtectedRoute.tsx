
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cleanupAuthState } from "@/context/AuthContext";

/**
 * ProtectedRoute component with enhanced stability
 * Uses direct Supabase session checking instead of relying on context
 * to prevent errors and auth loops
 */
const ProtectedRoute = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  // Debug logging function
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ProtectedRoute] ${message}`, data ? data : '');
    }
  };

  // Handle recovery attempts
  const handleRetry = () => {
    setRecoveryAttempts(prev => prev + 1);
    // If multiple retries, clear auth storage
    if (recoveryAttempts > 0) {
      cleanupAuthState();
    }
    window.location.reload();
  };

  // Force break auth loops
  const forceBreakLoop = () => {
    logDebug("Forcing auth loop break");
    cleanupAuthState();
    sessionStorage.setItem('auth:breakingLoop', 'true');
    window.location.href = '/auth';
  };

  // Detect and break auth loops
  useEffect(() => {
    // Enhanced loop detection
    const isInPotentialLoop = sessionStorage.getItem('auth:potentialLoop') === 'true';
    const loopDetectionStart = parseInt(sessionStorage.getItem('auth:loopDetectionStart') || '0', 10);
    const now = Date.now();
    
    // If we're loading the same page within 2 seconds multiple times, it's a loop
    if (isInPotentialLoop && now - loopDetectionStart < 2000) {
      logDebug("Detected auth loop! Breaking the cycle...");
      setIsRecoveryMode(true);
      
      // Clear all auth state to break the loop
      cleanupAuthState();
      sessionStorage.removeItem('auth:potentialLoop');
      sessionStorage.removeItem('auth:loopDetectionStart');
      
      // Set a flag to indicate we're breaking an auth loop
      sessionStorage.setItem('auth:breakingLoop', 'true');
    } else {
      // Start tracking this page load for loop detection
      sessionStorage.setItem('auth:potentialLoop', 'true');
      sessionStorage.setItem('auth:loopDetectionStart', now.toString());
      
      // Clear the flag after 5 seconds if no loop is detected
      setTimeout(() => {
        sessionStorage.removeItem('auth:potentialLoop');
        sessionStorage.removeItem('auth:loopDetectionStart');
      }, 5000);
    }

    // Fast auth check from session storage
    const fastAuthCheck = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    
    if (fastAuthCheck) {
      logDebug("Fast auth check passed, allowing access");
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
      return;
    }
    
    // Use Supabase to check the session
    const checkSession = async () => {
      try {
        logDebug("Checking Supabase session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logDebug("Error getting session:", error);
          setAuthError(error);
          setShouldRedirect(true);
          setIsCheckingAuth(false);
          return;
        }
        
        if (data.session?.user) {
          logDebug("Found active Supabase session");
          setIsAuthenticated(true);
          
          // Save to sessionStorage for future fast checks
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:userId', data.session.user.id);
          sessionStorage.setItem('auth:lastChecked', Date.now().toString());
        } else {
          logDebug("No active session found");
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
    
    // Check session but with a small delay to prevent simultaneous Supabase calls
    // that might cause deadlocks
    const timer = setTimeout(() => {
      checkSession();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  // Handle auth error with recovery options
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-gray-100">
          <div className="text-red-500 text-xl mb-4 text-center">Authentication Error</div>
          <p className="text-gray-700 mb-4 text-center">Unable to verify your authentication status.</p>
          <p className="text-sm text-gray-500 mb-4 text-center">{authError.message}</p>
          
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                cleanupAuthState();
                window.location.href = "/auth";
              }}
            >
              Go to Login
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRetry}
            >
              Refresh Page {recoveryAttempts > 0 ? `(${recoveryAttempts})` : ''}
            </Button>
            
            {recoveryAttempts > 1 && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={forceBreakLoop}
              >
                Force Reset Auth
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Verifying authentication...</p>
        
        {/* Show retry button after delay */}
        {isRecoveryMode && (
          <Button
            variant="outline" 
            size="sm"
            className="mt-4"
            onClick={handleRetry}
          >
            Retry Authentication
          </Button>
        )}
      </div>
    );
  }

  // If we should redirect to auth page
  if (shouldRedirect) {
    logDebug("Redirecting to /auth from:", location.pathname);
    // Include the current path in state so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
