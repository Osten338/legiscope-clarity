import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Check your email to confirm your account"
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate("/assessment");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }} className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-sage-50 p-4">
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
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-sage-600 hover:bg-sage-700 text-slate-900 bg-zinc-400 hover:bg-zinc-300">
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sage-600 hover:text-sage-700 text-sm">
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </Card>
    </motion.div>;
};
export default Auth;