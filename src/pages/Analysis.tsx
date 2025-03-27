
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/dashboard/Layout"; // Updated to use named import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useAnalysis(id!);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching analysis",
        description: "Failed to retrieve analysis data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold mb-4">
                  Analysis Summary
                </h2>
                <p>{data.analysis.description || "No summary available."}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold mb-4">
                  Detailed Analysis
                </h2>
                <pre className="whitespace-pre-wrap">{data.analysis.analysis || "No detailed analysis available."}</pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button onClick={() => refetch()}>Refetch Analysis</Button>
      </div>
    </Layout>
  );
};

export default Analysis;
