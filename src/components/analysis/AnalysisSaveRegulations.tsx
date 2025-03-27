
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface AnalysisSaveRegulationsProps {
  regulationsData: any;
  onSaved: (saved: boolean) => void;
}

export const useSaveRegulations = (regulationsData: any) => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  // Check if regulations are already saved
  useEffect(() => {
    const checkSavedRegulations = async () => {
      if (regulationsData?.regulations && regulationsData.regulations.length > 0) {
        const { data: savedRegs, error } = await supabase
          .from('saved_regulations')
          .select('regulation_id')
          .in('regulation_id', regulationsData.regulations.map((reg: any) => reg.id));
        
        if (!error && savedRegs.length === regulationsData.regulations.length) {
          setSaved(true);
        }
      }
    };
    
    checkSavedRegulations();
  }, [regulationsData]);

  const saveRegulationsToUser = async () => {
    if (!regulationsData?.regulations || regulationsData.regulations.length === 0) {
      toast({
        title: "No regulations to save",
        description: "There are no regulations available to save to your dashboard.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("You must be logged in to save regulations");
      
      const userId = session.session.user.id;
      
      // Create saved_regulations for each regulation
      const promises = regulationsData.regulations.map((regulation: any) => {
        return supabase
          .from('saved_regulations')
          .upsert({
            user_id: userId,
            regulation_id: regulation.id,
            status: 'in_progress',
            progress: 0
          }, { onConflict: 'user_id, regulation_id' });
      });
      
      await Promise.all(promises);
      
      setSaved(true);
      toast({
        title: "Regulations saved",
        description: "Regulations have been saved to your dashboard",
      });
      
    } catch (error: any) {
      console.error("Error saving regulations:", error);
      toast({
        title: "Error saving regulations",
        description: error.message || "Failed to save regulations to your dashboard",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return { saving, saved, saveRegulationsToUser };
};
