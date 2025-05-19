
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAuthenticatedSync } from "@/context/AuthContext";

/**
 * ProtectedRoute component with enhanced stability
 * Uses multi-stage verification and increased grace periods
 * to prevent premature redirects and auth loops
 */
const ProtectedRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  
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
    
    if (recentRedirects.length > 3) {
      logDebug("Potential redirect loop detected! Breaking cycle.");
      setIsCheckingAuth(false);
      setShouldRedirect(false);
      return;
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
        isLoading
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
  }, [isLoading, user, isAuthenticated, location.pathname, verificationAttempts]);
  
  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
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
