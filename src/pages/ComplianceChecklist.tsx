
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/dashboard/Layout";
import { ChecklistItem } from "@/components/compliance/ChecklistItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Define proper types for the data
interface ChecklistItemType {
  id: string;
  description: string;
}

interface RegulationType {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items?: ChecklistItemType[];
}

const ComplianceChecklist = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: regulations, isLoading, error } = useQuery({
    queryKey: ["regulations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regulations")
        .select("*, checklist_items(*)");

      if (error) {
        console.error("Error fetching regulations:", error);
        throw error;
      }

      return data as RegulationType[];
    },
  });

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList>
                <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
                {regulations?.map((regulation) => (
                  <TabsTrigger key={regulation.id} value={regulation.id} onClick={() => setActiveTab(regulation.id)}>
                    {regulation.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="mt-4">
                <TabsContent value="overview">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Overview</h2>
                    <p>Select a regulation from the tabs above to view its checklist.</p>
                  </div>
                </TabsContent>
                {regulations?.map((regulation) => (
                  <TabsContent key={regulation.id} value={regulation.id}>
                    <div>
                      <h2 className="text-lg font-semibold mb-4">{regulation.name} Checklist</h2>
                      {regulation.checklist_items && regulation.checklist_items.length > 0 ? (
                        <ul>
                          {regulation.checklist_items.map((item) => (
                            <ChecklistItem key={item.id} description={item.description} status="pending" />
                          ))}
                        </ul>
                      ) : (
                        <p>No checklist items found for this regulation.</p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ComplianceChecklist;
