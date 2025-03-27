
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/dashboard/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useAnalysis(id!);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("summary");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching analysis",
        description: "Failed to retrieve analysis data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Check if regulations are already saved
  useEffect(() => {
    const checkSavedRegulations = async () => {
      if (data?.regulations && data.regulations.length > 0) {
        const { data: savedRegs, error } = await supabase
          .from('saved_regulations')
          .select('regulation_id')
          .in('regulation_id', data.regulations.map(reg => reg.id));
        
        if (!error && savedRegs.length === data.regulations.length) {
          setSaved(true);
        }
      }
    };
    
    checkSavedRegulations();
  }, [data]);

  const saveRegulationsToUser = async () => {
    if (!data?.regulations || data.regulations.length === 0) {
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
      const promises = data.regulations.map(regulation => {
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

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading analysis...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="container mx-auto p-8">
          <div className="text-center">
            <p className="text-slate-600">No analysis data available.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <div className="flex justify-end mb-4 space-x-4">
          {!saved ? (
            <Button onClick={saveRegulationsToUser} disabled={saving || saved}>
              {saving ? "Saving..." : "Save Regulations to Dashboard"}
            </Button>
          ) : (
            <Button onClick={goToDashboard}>
              View Regulations in Dashboard
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Analysis Summary
                </h2>
                <p>{data.analysis.description || "No summary available."}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Detailed Analysis
                </h2>
                <div className="whitespace-pre-wrap">{data.analysis.analysis || "No detailed analysis available."}</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="regulations">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Identified Regulations
                </h2>
                {data.regulations && data.regulations.length > 0 ? (
                  <div className="space-y-4">
                    {data.regulations.map(reg => (
                      <div key={reg.id} className="p-4 border rounded-md">
                        <h3 className="font-medium text-lg">{reg.name}</h3>
                        <p className="text-slate-600 my-2">{reg.description}</p>
                        <div className="mt-3">
                          <h4 className="font-medium">Requirements:</h4>
                          <p className="text-slate-700">{reg.requirements}</p>
                        </div>
                        {reg.checklist_items && reg.checklist_items.length > 0 && (
                          <div className="mt-3">
                            <h4 className="font-medium">Checklist:</h4>
                            <ul className="list-disc ml-5 mt-2">
                              {reg.checklist_items.map(item => (
                                <li key={item.id} className="text-slate-700">{item.description}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600">No regulations identified for this analysis.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <Button onClick={() => refetch()} variant="outline">Refresh Analysis</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
