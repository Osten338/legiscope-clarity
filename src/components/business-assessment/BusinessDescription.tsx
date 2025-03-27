
import { useState } from "react";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BusinessDescriptionForm } from "./BusinessDescriptionForm";
import { AnalysisProgressIndicator } from "./AnalysisProgressIndicator";
import { AnalysisInfoAlert } from "./AnalysisInfoAlert";

export const BusinessDescription = () => {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const progressSteps = [
    "Initializing analysis...",
    "Processing business information...",
    "Analyzing business description...",
    "Identifying compliance frameworks...",
    "Determining applicable regulations...",
    "Generating compliance checklist...",
    "Performing risk assessment...",
    "Finalizing compliance analysis...",
    "Preparing recommendations..."
  ];

  const simulateProgress = () => {
    setAnalysisProgress(0);
    
    let step = 0;
    const totalSteps = progressSteps.length;
    const progressInterval = 85 / totalSteps; // Cap at 85% to show it's still processing
    
    const interval = setInterval(() => {
      if (step < totalSteps) {
        setCurrentStep(progressSteps[step]);
        setAnalysisProgress((prevProgress) => {
          const newProgress = (step + 1) * progressInterval;
          return Math.min(newProgress, 85); // Cap at 85% until complete
        });
        step++;
      } else {
        clearInterval(interval);
      }
    }, 2500); // Slowed down to indicate more processing time

    return interval;
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please provide a business description",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const progressInterval = simulateProgress();

    try {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to analyze business descriptions",
          variant: "destructive"
        });
        navigate("/auth");
        return;
      }

      const response = await fetch('https://vmyzceyvkkcgdbgmbbqf.supabase.co/functions/v1/analyze-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          description,
          assessment_id: crypto.randomUUID()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze business description');
      }

      const data = await response.json();
      
      // Finish the progress animation
      setAnalysisProgress(100);
      setCurrentStep("Analysis complete!");
      
      clearInterval(progressInterval);

      toast({
        title: "Analysis Complete",
        description: data.has_enhanced_analysis 
          ? "Your business description has been analyzed using our advanced AI model for comprehensive results."
          : "Your business description has been analyzed successfully.",
      });

      // Short delay to show the completed progress
      setTimeout(() => {
        navigate(`/analysis/${data.analysis_id}`);
      }, 1000);
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze business description. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="px-4 py-1.5 text-sm font-medium bg-white/80 text-neutral-800 rounded-full inline-block mb-6 backdrop-blur-sm"
        >
          Comprehensive Compliance Assessment
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl md:text-5xl font-serif font-normal mb-8 text-neutral-900 tracking-tight"
        >
          Tell Us About Your Business
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-neutral-900 text-lg md:text-xl mb-10 leading-relaxed"
        >
          Provide details about your business for a thorough compliance analysis. The more information you share, the more accurate our assessment will be.
        </motion.p>

        <Card className="backdrop-blur-sm border-white/40 shadow-lg transition-all duration-300 p-8 bg-white/[0.84]">
          <div className="space-y-6">
            <AnalysisInfoAlert />

            <BusinessDescriptionForm 
              isAnalyzing={isAnalyzing} 
              description={description} 
              setDescription={setDescription} 
              handleSubmit={handleSubmit} 
            />

            {isAnalyzing && (
              <AnalysisProgressIndicator 
                analysisProgress={analysisProgress} 
                currentStep={currentStep} 
              />
            )}
          </div>
        </Card>
      </motion.div>
    </section>
  );
};
