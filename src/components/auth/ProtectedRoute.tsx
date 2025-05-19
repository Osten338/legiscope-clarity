
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { isAuthenticatedSync } from "@/context/AuthContext";

/**
 * ProtectedRoute component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 * Includes a grace period to prevent premature redirects
 */
const ProtectedRoute = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    // Fast check from session storage first
    const fastAuthCheck = sessionStorage.getItem('auth:isAuthenticated') === 'true';
    
    if (fastAuthCheck) {
      setIsCheckingAuth(false);
      return;
    }
    
    // If initial auth check is still loading, wait before making decisions
    if (isLoading) {
      return;
    }
    
    // If we have a definite authentication state, update accordingly
    if (isAuthenticated && user) {
      setIsCheckingAuth(false);
      return;
    }
    
    // If we've completed loading and there's no user, wait a longer grace period 
    // before redirecting to prevent redirect loops during authentication
    const gracePeriodTimer = setTimeout(() => {
      // Double-check using the sync method before redirecting
      if (!isAuthenticatedSync() && !user) {
        console.log("ProtectedRoute: Grace period ended, user not authenticated, redirecting to /auth");
        setShouldRedirect(true);
      }
      setIsCheckingAuth(false);
    }, 1500); // Increased grace period to wait for auth state to stabilize
    
    return () => {
      clearTimeout(gracePeriodTimer);
    };
  }, [isLoading, user, isAuthenticated]);
  
  // Show loading state while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // If we've determined we should redirect (after grace period)
  if (shouldRedirect) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /auth", location.pathname);
    // Include the current path in state so we can redirect back after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
