
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cleanupAuthState } from "@/context/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [isBreakingLoop, setIsBreakingLoop] = useState(false);
  const [authServiceError, setAuthServiceError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely access auth context with error handling
  const [authState, setAuthState] = useState<{
    user: any | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn?: Function;
    signUp?: Function;
  }>({
    user: null,
    isLoading: true,
    isAuthenticated: false
  });
  
  // Check if auth context is available
  useEffect(() => {
    try {
      const auth = useAuth();
      setAuthState({
        user: auth.user,
        isLoading: auth.isLoading,
        isAuthenticated: auth.isAuthenticated,
        signIn: auth.signIn,
        signUp: auth.signUp
      });
      setAuthServiceError(false); // Reset error state if auth is available
    } catch (err) {
      console.error("Error accessing auth context:", err);
      setAuthServiceError(true);
    }
  }, []);
  
  // Get the intended destination from location state, defaulting to dashboard
  const from = location.state?.from || "/dashboard";
  
  // For debugging
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth] ${message}`, data ? data : '');
    }
  };
  
  // Check if we're breaking an auth loop
  useEffect(() => {
    const breakingLoop = sessionStorage.getItem('auth:breakingLoop') === 'true';
    if (breakingLoop) {
      setIsBreakingLoop(true);
      logDebug("Detected we're breaking an authentication loop");
      // Clear the breaking loop flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('auth:breakingLoop');
      }, 1000);
    }
  }, []);
  
  // Clear redirect history on mount to prevent redirect loops
  useEffect(() => {
    if (isBreakingLoop) {
      // If we're breaking a loop, don't clear the history yet
      return;
    }
    
    sessionStorage.removeItem('auth:redirectHistory');
  }, [isBreakingLoop]);
  
  useEffect(() => {
    // If user is already signed in and we're done loading, redirect
    if (authState.isAuthenticated && authState.user && !authState.isLoading && !isRedirecting && !authInProgress && !authServiceError) {
      logDebug("Auth page: User is signed in, redirecting to", from);
      setIsRedirecting(true);
      
      // Clean up any redirect tracking to prevent loops
      sessionStorage.removeItem('auth:redirectHistory');
      
      // Use setTimeout to ensure state updates have propagated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    }
  }, [authState.user, authState.isLoading, from, navigate, authState.isAuthenticated, isRedirecting, authInProgress, authServiceError]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || isRedirecting || authInProgress || !authState.signIn || !authState.signUp) {
      toast.error("Authentication service not available. Please try again later.");
      return;
    }
    
    setLoading(true);
    setAuthInProgress(true);
    logDebug(`Starting ${isSignUp ? 'signup' : 'signin'} process`);
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      if (isSignUp) {
        const { error } = await authState.signUp(email, password);
        
        if (error) throw error;
        
        toast.success("Check your email to confirm your account");
        logDebug("Signup successful, check email message shown");
      } else {
        const { error } = await authState.signIn(email, password);
        
        if (error) throw error;
        
        toast.success("Successfully signed in!");
        logDebug("Sign in successful");
        // We don't need to navigate here as the AuthContext will handle it
      }
    } catch (error: any) {
      logDebug("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
      
      // Allow some time before clearing auth in progress
      setTimeout(() => {
        setAuthInProgress(false);
      }, 1000);
    }
  };

  const handleReloadPage = () => {
    window.location.reload();
  };

  // Show auth service error state
  if (authServiceError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sage-50 p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Authentication Error</h1>
            <p className="text-slate-600 mt-2">
              Unable to access authentication service. Please try again later.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleReloadPage}
              className="w-full max-w-xs"
            >
              Reload Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if auth methods aren't available
  if (!authState.signIn || !authState.signUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sage-50 p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Authentication Error</h1>
            <p className="text-slate-600 mt-2">
              Unable to access authentication service. Please try again later.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={handleReloadPage}
              className="w-full max-w-xs"
            >
              Reload Page
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Don't show loading indicator during initial load to avoid flicker
  if (authState.isLoading && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sage-50 p-4"
    >
      <Card className="w-full max-w-md p-6 space-y-6">
        {isBreakingLoop && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-3">
            <p className="text-sm text-yellow-800">
              Authentication issue detected. Please sign in again or try refreshing the page.
            </p>
          </div>
        )}

        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isSignUp ? "Sign up to start your compliance journey" : "Sign in to continue your compliance journey"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              className="bg-yellow-50"
              disabled={loading || isRedirecting || authInProgress}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              className="bg-yellow-50"
              disabled={loading || isRedirecting || authInProgress}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading || isRedirecting || authInProgress} 
            className="w-full"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-primary hover:text-primary-dark text-sm"
            disabled={loading || isRedirecting || authInProgress}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-center text-muted-foreground mt-4">
            <p>Auth state: {authState.isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p>Loading: {authState.isLoading ? 'Yes' : 'No'}</p>
            <p>Redirecting: {isRedirecting ? 'Yes' : 'No'}</p>
            <p>Breaking loop: {isBreakingLoop ? 'Yes' : 'No'}</p>
            <p>Auth service error: {authServiceError ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Auth;
