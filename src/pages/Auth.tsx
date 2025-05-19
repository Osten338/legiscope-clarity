
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

// Utility function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const authCheckCompleted = useRef(false);
  const authInProgress = useRef(false);
  
  // Get the intended destination from location state, defaulting to assessment
  const from = location.state?.from || "/dashboard";
  
  useEffect(() => {
    // Only check session once to prevent loops
    if (authCheckCompleted.current) {
      return;
    }
    
    // Set the flag to avoid repeated checks
    authCheckCompleted.current = true;
    
    // Check if user is already signed in
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          console.log("Auth page: Session found, no need to login");
          // AuthGuard will handle the redirect, we just need to finish checking
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        // Always update this state to stop showing loading
        setIsCheckingAuth(false);
      }
    };
    
    checkSession();
    
    // We don't need an auth listener here since AuthGuard will handle that
  }, [from, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || authInProgress.current) return;
    
    setLoading(true);
    authInProgress.current = true;
    
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Global sign out failed, continuing:", err);
      }
      
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
        setLoading(false);
        authInProgress.current = false;
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) throw error;
        
        if (data.user) {
          toast.success("Successfully signed in!");
          // Let AuthGuard handle the redirect based on the session state
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
      setLoading(false);
      authInProgress.current = false;
    }
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
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
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-sage-600 hover:bg-sage-700 text-slate-900 bg-zinc-400 hover:bg-zinc-300"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-sage-600 hover:text-sage-700 text-sm"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Auth;
