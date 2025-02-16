import { useState } from "react";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Progress } from "./ui/progress";
export const BusinessDescription = () => {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
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
    try {
      const {
        data: {
          session
        }
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
          description
        })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze business description');
      }
      const data = await response.json();
      toast({
        title: "Analysis Complete",
        description: "Your business description has been analyzed successfully."
      });
      navigate(`/analysis/${data.analysis}`);
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze business description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  return <section className="py-16 px-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="max-w-4xl mx-auto">
        <motion.span initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.4
      }} className="px-4 py-1.5 text-sm font-medium bg-white/80 text-neutral-800 rounded-full inline-block mb-6 backdrop-blur-sm">
          Business Assessment
        </motion.span>

        <motion.h2 initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.6
      }} className="text-4xl md:text-5xl font-serif font-normal mb-8 text-neutral-900 tracking-tight">
          Tell Us About Your Business
        </motion.h2>

        <motion.p initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.8
      }} className="text-neutral-900 text-lg md:text-xl mb-10 leading-relaxed">
          Help us understand your business better to provide tailored compliance recommendations.
        </motion.p>

        <Card className="backdrop-blur-sm border-white/40 shadow-lg transition-all duration-300 p-8 bg-white/[0.84]">
          <div className="space-y-6">
            <div>
              <Label htmlFor="guidance" className="text-xl font-serif text-neutral-900">
                What information should you include?
              </Label>
              <ul className="mt-4 list-disc list-inside text-neutral-600 space-y-2.5">
                <li>Your business model and primary activities</li>
                <li>How you interact with customers or clients</li>
                <li>Industry sector and any relevant subsectors</li>
                <li>Geographic areas of operation</li>
                <li>Types of data you collect and process</li>
                <li>Products or services you offer</li>
                <li>Number of employees (approximate)</li>
                <li>Annual revenue range (if applicable)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-xl font-serif text-neutral-900">
                  Business Description
                </Label>
                <Textarea id="description" placeholder="Describe your business here..." className="mt-3 h-48 bg-white/70 border-white/40 focus:border-white/60 transition-all duration-300" value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div>
                <Label htmlFor="document" className="text-xl font-serif text-neutral-900">
                  Or Upload a Document
                </Label>
                <div className="mt-3">
                  <Input id="document" type="file" accept=".pdf,.doc,.docx" className="hidden" />
                  <Button variant="outline" className="w-full border-white/40 border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2 bg-white/30 hover:bg-white/50 transition-all duration-300" onClick={() => document.getElementById("document")?.click()}>
                    <Upload className="h-6 w-6 text-neutral-800" />
                    <span className="text-neutral-800">Upload business documentation</span>
                    <span className="text-sm text-neutral-600">PDF, DOC, or DOCX up to 10MB</span>
                  </Button>
                </div>
              </div>
            </div>

            {isAnalyzing && <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Analyzing your business...</span>
                  <span className="text-sm text-neutral-600">Please wait</span>
                </div>
                <Progress value={100} className="w-full" />
              </div>}

            <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 rounded-full text-lg transition-all duration-300" onClick={handleSubmit} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Start Compliance Check"}
            </Button>

            {analysis && <div className="mt-6">
                <Label className="text-xl font-serif text-neutral-900">
                  Analysis Results
                </Label>
                <Card className="p-4 mt-3 bg-white/30 border-white/40 backdrop-blur-sm">
                  <p className="text-neutral-700 whitespace-pre-wrap">{analysis}</p>
                </Card>
              </div>}
          </div>
        </Card>
      </motion.div>
    </section>;
};