
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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, isAuthenticated, signIn, signUp } = useAuth();
  
  // Get the intended destination from location state, defaulting to dashboard
  const from = location.state?.from || "/dashboard";
  
  // For debugging
  const logDebug = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Auth] ${message}`, data ? data : '');
    }
  };
  
  // Clear redirect history on mount to prevent redirect loops
  useEffect(() => {
    sessionStorage.removeItem('auth:redirectHistory');
  }, []);
  
  useEffect(() => {
    // If user is already signed in and we're done loading, redirect
    if (isAuthenticated && user && !isLoading && !isRedirecting && !authInProgress) {
      logDebug("Auth page: User is signed in, redirecting to", from);
      setIsRedirecting(true);
      
      // Clean up any redirect tracking to prevent loops
      sessionStorage.removeItem('auth:redirectHistory');
      
      // Use setTimeout to ensure state updates have propagated
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    }
  }, [user, isLoading, from, navigate, isAuthenticated, isRedirecting, authInProgress]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || isRedirecting || authInProgress) return;
    
    setLoading(true);
    setAuthInProgress(true);
    logDebug(`Starting ${isSignUp ? 'signup' : 'signin'} process`);
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      if (isSignUp) {
        const { error } = await signUp(email, password);
        
        if (error) throw error;
        
        toast.success("Check your email to confirm your account");
        logDebug("Signup successful, check email message shown");
      } else {
        const { error } = await signIn(email, password);
        
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

  // Don't show loading indicator during initial load to avoid flicker
  if (isLoading && !loading) {
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
            <p>Auth state: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Redirecting: {isRedirecting ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Auth;
