
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/dashboard/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, ArrowLeft, CheckCircle, Clock, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  const renderAnalysisContent = (content: string) => {
    // Split content by headers (###) for better formatting
    const sections = content.split(/^###\s+/m).filter(Boolean);
    
    if (sections.length <= 1) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    return (
      <div className="space-y-6">
        {sections.map((section, index) => {
          const [title, ...body] = section.split('\n');
          return (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="text-xl font-semibold mb-3">{title.trim()}</h3>
              <div className="whitespace-pre-wrap">{body.join('\n')}</div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading analysis...</p>
            <p className="text-sage-600 text-sm mt-2">This may take a moment as we generate a detailed compliance analysis</p>
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
            <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Compliance Analysis</h1>
            <p className="text-slate-600">AI-powered analysis of your business compliance requirements</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
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
        </div>
        
        {data?.analysis?.analysis?.includes("Analysis in progress") && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              The detailed analysis is still being generated. Please check back in a few minutes or refresh this page.
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="regulations">Identified Regulations ({data.regulations?.length || 0})</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Business Profile
                </h2>
                <p className="whitespace-pre-wrap">{data.analysis.description || "No summary available."}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-semibold mb-4">
                  Detailed Compliance Analysis
                </h2>
                {data.analysis.analysis === "Analysis in progress..." ? (
                  <div className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
                    <p className="text-slate-600">Detailed analysis is still being generated...</p>
                    <Button onClick={() => refetch()} variant="outline" size="sm">Refresh Analysis</Button>
                  </div>
                ) : (
                  renderAnalysisContent(data.analysis.analysis || "No detailed analysis available.")
                )}
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
                      <div key={reg.id} className="p-4 border rounded-md hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-lg text-sage-800">{reg.name}</h3>
                        <p className="text-slate-600 my-2">{reg.description}</p>
                        <div className="mt-3">
                          <h4 className="font-medium text-sage-700">Motivation:</h4>
                          <p className="text-slate-700 mb-3">{reg.motivation}</p>
                          
                          <h4 className="font-medium text-sage-700">Requirements:</h4>
                          <p className="text-slate-700">{reg.requirements}</p>
                        </div>
                        {reg.checklist_items && reg.checklist_items.length > 0 && (
                          <div className="mt-3">
                            <h4 className="font-medium text-sage-700">Checklist:</h4>
                            <ul className="list-disc ml-5 mt-2 space-y-1">
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
                  <div className="text-center p-8">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No regulations have been identified for this analysis yet.</p>
                    <Button onClick={() => refetch()} variant="outline" className="mt-4">Refresh Analysis</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-between">
          <Button onClick={() => refetch()} variant="outline">
            Refresh Analysis
          </Button>
          {!saved && data.regulations && data.regulations.length > 0 && (
            <Button onClick={saveRegulationsToUser} disabled={saving}>
              {saving ? "Saving..." : "Save All Regulations"}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analysis;
