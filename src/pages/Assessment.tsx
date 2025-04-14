
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BusinessAssessmentForm } from "@/components/BusinessAssessmentForm";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { BusinessDescription } from "@/components/business-assessment/BusinessDescription";

const Assessment = () => {
  const navigate = useNavigate();
  const [assessmentMethod, setAssessmentMethod] = useState<"form" | "description">("form");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.log("No active session, redirecting to auth");
        navigate("/auth");
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="relative">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative min-h-screen z-[1] py-8"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl font-serif mb-4">Business Assessment</h1>
              <p className="text-lg text-slate-600">
                Complete this assessment to help us understand your business and identify relevant compliance requirements.
              </p>
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please ensure all information provided is accurate and up-to-date.
                </AlertDescription>
              </Alert>
            </motion.div>
            
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-6">
              <div className="mb-6">
                <div className="flex gap-4 mb-6">
                  <button 
                    onClick={() => setAssessmentMethod("form")}
                    className={`px-4 py-2 rounded-lg ${assessmentMethod === "form" 
                      ? "bg-neutral-800 text-white" 
                      : "bg-white/50 border border-neutral-300 text-neutral-700"}`}
                  >
                    Structured Form
                  </button>
                  <button 
                    onClick={() => setAssessmentMethod("description")}
                    className={`px-4 py-2 rounded-lg ${assessmentMethod === "description" 
                      ? "bg-neutral-800 text-white" 
                      : "bg-white/50 border border-neutral-300 text-neutral-700"}`}
                  >
                    Free-form Description
                  </button>
                </div>
                
                <p className="text-sm text-neutral-600">
                  {assessmentMethod === "form" 
                    ? "Complete the structured form to provide detailed information about your business."
                    : "Provide a free-form description of your business and our AI will analyze it."}
                </p>
              </div>
              
              {assessmentMethod === "form" ? (
                <BusinessAssessmentForm />
              ) : (
                <BusinessDescription />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Assessment;
