
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { RiskMatrix } from "@/components/risk-assessment/RiskMatrix";
import { RiskList } from "@/components/risk-assessment/RiskList";
import { AddRiskDialog } from "@/components/risk-assessment/AddRiskDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: number;
  likelihood: number;
  level: "low" | "medium" | "high";
  category: "compliance" | "operational" | "financial" | "reputational";
  status: string;
  due_date: string | null;
  regulations?: { name: string } | null;
  is_generated?: boolean;
}

const RiskAssessment = () => {
  const { view } = useParams<{ view: string }>();
  const [isAddRiskDialogOpen, setIsAddRiskDialogOpen] = useState(false);
  const [risks, setRisks] = useState<Risk[]>([
    { 
      id: "1", 
      title: "Data Breach", 
      description: "Risk of unauthorized access to sensitive data",
      impact: 5, 
      likelihood: 4, 
      level: "high",
      category: "security" as "compliance",
      status: "open",
      due_date: null,
      is_generated: false
    },
    { 
      id: "2", 
      title: "System Failure", 
      description: "Risk of critical system outage",
      impact: 3, 
      likelihood: 3, 
      level: "medium",
      category: "operational",
      status: "open",
      due_date: null,
      is_generated: false
    },
  ]);

  useEffect(() => {
    // Simulate loading risks from an API
    // In a real application, you would fetch the risks here
  }, []);

  const handleAddRisk = (newRisk: any) => {
    const fullRisk: Risk = {
      ...newRisk,
      id: String(Date.now()),
      level: calculateRiskLevel(newRisk.likelihood, newRisk.impact),
      status: "open",
      due_date: null,
      is_generated: false
    };
    
    setRisks([...risks, fullRisk]);
    setIsAddRiskDialogOpen(false);
  };
  
  const calculateRiskLevel = (likelihood: number, impact: number): "low" | "medium" | "high" => {
    const score = likelihood * impact;
    if (score <= 6) return "low";
    if (score <= 15) return "medium";
    return "high";
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
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
          onOpenChange={setIsAddRiskDialogOpen}
        />
      </div>
    </TopbarLayout>
  );
};

export default RiskAssessment;
