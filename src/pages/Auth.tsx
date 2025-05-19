
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/context/AuthContext";

// Safe debug logging function
const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Auth Page] ${message}`, data ? data : '');
  }
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [isBreakingLoop, setIsBreakingLoop] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, defaulting to dashboard
  const from = location.state?.from || "/dashboard";
  
  // Initialize component with direct Supabase auth check
  useEffect(() => {
    // Clear redirect history on mount to prevent redirect loops
    sessionStorage.removeItem('auth:redirectHistory');
    
    // Check if we're breaking an auth loop
    const breakingLoop = sessionStorage.getItem('auth:breakingLoop') === 'true';
    if (breakingLoop) {
      setIsBreakingLoop(true);
      logDebug("Detected we're breaking an authentication loop");
      
      // Clear the breaking loop flag after a short delay
      setTimeout(() => {
        sessionStorage.removeItem('auth:breakingLoop');
      }, 1000);
    }
    
    const checkSession = async () => {
      try {
        // Fast check from sessionStorage first
        const cachedAuth = sessionStorage.getItem('auth:isAuthenticated') === 'true';
        const userId = sessionStorage.getItem('auth:userId');
        
        if (cachedAuth && userId) {
          setUser({ id: userId });
          setIsAuthenticated(true);
          logDebug("Using cached auth state, user is authenticated");
        }
        
        // Now check with Supabase directly
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logDebug("Error checking Supabase session:", error);
          return;
        }
        
        if (data?.session) {
          logDebug("Found active Supabase session");
          setUser(data.session.user);
          setIsAuthenticated(true);
          
          // Store for future fast checks
          sessionStorage.setItem('auth:isAuthenticated', 'true');
          sessionStorage.setItem('auth:userId', data.session.user.id);
          
          // Redirect after a short delay
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 300);
        }
      } catch (err) {
        logDebug("Error during auth initialization:", err);
      } finally {
        setIsInitialized(true);
      }
    };
    
    checkSession();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      logDebug("Auth state changed:", event);
      
      if (session) {
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Store for future fast checks
        sessionStorage.setItem('auth:isAuthenticated', 'true');
        sessionStorage.setItem('auth:userId', session.user.id);
        
        if (event === 'SIGNED_IN') {
          // Redirect after a short delay
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 300);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem('auth:isAuthenticated');
        sessionStorage.removeItem('auth:userId');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, from]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || isRedirecting || authInProgress) {
      return;
    }
    
    setLoading(true);
    setAuthInProgress(true);
    logDebug(`Starting ${isSignUp ? 'signup' : 'signin'} process`);
    
    try {
      // Clean up existing auth state first
      cleanupAuthState();
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + '/auth/callback'
          }
        });
        
        if (error) throw error;
        
        toast.success("Check your email to confirm your account");
        logDebug("Signup successful, check email message shown");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        toast.success("Successfully signed in!");
        logDebug("Sign in successful");
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

  // Don't show loading indicator during initial load to avoid flicker
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated && user && !isRedirecting) {
    setIsRedirecting(true);
    navigate(from, { replace: true });
    return null;
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
              className="bg-white"
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
              className="bg-white"
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
        
        <div className="pt-2 flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleReloadPage}
            className="text-xs"
          >
            Reload Page
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-center text-muted-foreground mt-4">
            <p>Initialized: {isInitialized ? 'Yes' : 'No'}</p>
            <p>Auth state: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p>Redirecting: {isRedirecting ? 'Yes' : 'No'}</p>
            <p>Breaking loop: {isBreakingLoop ? 'Yes' : 'No'}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default Auth;
