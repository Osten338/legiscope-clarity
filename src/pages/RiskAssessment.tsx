
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { RiskMatrix } from "@/components/risk-assessment/RiskMatrix";
import { RiskList } from "@/components/risk-assessment/RiskList";
import { AddRiskDialog } from "@/components/risk-assessment/AddRiskDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/dashboard/Layout";
import { BarChart } from "lucide-react";

const RiskAssessment = () => {
  const { view } = useParams();
  const [searchParams] = useSearchParams();
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setIsAddRiskOpen(true);
    }
  }, [searchParams]);

  const { data: risks, isLoading } = useQuery({
    queryKey: ['risks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('risks')
        .select(`
          *,
          regulations (
            id,
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1">
          <div className="text-sage-600 m-auto">Loading risk assessment data...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-sage-600" />
            <h1 className="text-2xl font-serif text-slate-900">Risk Assessment</h1>
          </div>
          <Button onClick={() => setIsAddRiskOpen(true)}>Add New Risk</Button>
        </div>

        <Tabs defaultValue={view || "matrix"} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
            <TabsTrigger value="list">Risk List</TabsTrigger>
          </TabsList>

          <TabsContent value="matrix" className="space-y-4">
            <RiskMatrix risks={risks || []} />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <RiskList risks={risks || []} />
          </TabsContent>
        </Tabs>

        <AddRiskDialog 
          open={isAddRiskOpen} 
          onOpenChange={setIsAddRiskOpen}
        />
      </div>
    </Layout>
  );
};

export default RiskAssessment;
