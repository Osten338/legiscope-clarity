
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { RegulationTab } from "@/components/compliance/RegulationTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { RegulationImpactAnalysis } from "@/components/legislation/RegulationImpactAnalysis";

const Legislation = () => {
  const { id } = useParams<{ id: string }>();
  const [regulation, setRegulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRegulation = async () => {
      if (!id) {
        toast({
          title: "Error: Missing Regulation ID",
          description: "The regulation ID is missing. Please check the URL.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("regulations")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Error fetching regulation",
            description:
              error.message || "Failed to load regulation. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (data) {
          setRegulation(data);
        } else {
          toast({
            title: "Regulation not found",
            description: "The regulation with the specified ID was not found.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Unexpected error:", error);
        toast({
          title: "Unexpected error",
          description:
            error.message ||
            "An unexpected error occurred. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegulation();
  }, [id, toast]);

  if (loading) {
    return (
      <TopbarLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading...</p>
        </div>
      </TopbarLayout>
    );
  }

  if (!regulation) {
    return (
      <TopbarLayout>
        <div className="flex justify-center items-center h-full">
          <p>Regulation not found.</p>
        </div>
      </TopbarLayout>
    );
  }

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {regulation.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {regulation.description}
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <RegulationTab regulation={regulation} />
          </TabsContent>
          <TabsContent value="details">
            <div className="grid gap-4">
              <Card>
                <CardContent>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Motivation</h2>
                    <p className="text-slate-700 dark:text-slate-300">
                      {regulation.motivation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="requirements">
            <div className="grid gap-4">
              <Card>
                <CardContent>
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Requirements</h2>
                    <p className="text-slate-700 dark:text-slate-300">
                      {regulation.requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="impact">
            <div className="grid gap-4">
              <RegulationImpactAnalysis
                regulation={{
                  id: regulation.id,
                  title: regulation.name,
                  description: regulation.description,
                  content: `${regulation.description} ${regulation.requirements} ${regulation.motivation}`
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button onClick={() => window.history.back()}>Back</Button>
        </div>
      </div>
    </TopbarLayout>
  );
};

export default Legislation;
