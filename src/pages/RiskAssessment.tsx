import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/dashboard/Layout";
import { RiskMatrix } from "@/components/risk-assessment/RiskMatrix";
import { RiskList } from "@/components/risk-assessment/RiskList";
import { AddRiskDialog } from "@/components/risk-assessment/AddRiskDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const RiskAssessment = () => {
  const { view } = useParams<{ view: string }>();
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false);
  const [risks, setRisks] = useState([
    { id: "1", name: "Data Breach", impact: 5, likelihood: 4 },
    { id: "2", name: "System Failure", impact: 3, likelihood: 3 },
  ]);

  useEffect(() => {
    // Simulate loading risks from an API
    // In a real application, you would fetch the risks here
  }, []);

  const handleAddRisk = (newRisk: any) => {
    setRisks([...risks, { ...newRisk, id: String(Date.now()) }]);
    setIsAddRiskDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={view || "matrix"} className="space-y-4">
              <TabsList>
                <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
                <TabsTrigger value="list">Risk List</TabsTrigger>
              </TabsList>
              <TabsContent value="matrix">
                <RiskMatrix risks={risks} />
              </TabsContent>
              <TabsContent value="list">
                <RiskList risks={risks} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsAddRiskDialogOpen(true)}>Add Risk</Button>
        </div>

        <AddRiskDialog
          open={isAddRiskDialogOpen}
          onClose={() => setIsAddRiskDialogOpen(false)}
          onAddRisk={handleAddRisk}
        />
      </div>
    </Layout>
  );
};

export default RiskAssessment;
