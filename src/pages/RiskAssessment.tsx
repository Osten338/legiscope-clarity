
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RiskMatrix } from "@/components/risk-assessment/RiskMatrix";
import { RiskList } from "@/components/risk-assessment/RiskList";
import { AddRiskDialog } from "@/components/risk-assessment/AddRiskDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RiskAssessment = () => {
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);

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
      <div className="flex h-screen">
        <div className="text-sage-600 m-auto">Loading risk assessment data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-sage-900">Risk Assessment</h1>
        <Button onClick={() => setIsAddRiskOpen(true)}>Add New Risk</Button>
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
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
  );
};

export default RiskAssessment;
