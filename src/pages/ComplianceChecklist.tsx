
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { ChecklistItem } from "@/components/compliance/ChecklistItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ChecklistItemType {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimated_effort?: string;
}

interface RegulationType {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItemType[];
}

const ComplianceChecklist = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          console.log("Current user ID:", user.id);
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    
    getUserId();
  }, []);

  const { data: regulations, isLoading, error, refetch } = useQuery({
    queryKey: ["regulations", userId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        const { data: savedRegs, error: savedError } = await supabase
          .from("saved_regulations")
          .select("regulation_id")
          .eq("user_id", user.id);
          
        if (savedError) {
          throw savedError;
        }
        
        if (!savedRegs || savedRegs.length === 0) {
          console.log("No saved regulations found for user:", user.id);
          return [];
        }
        
        const { data: regulations, error: regulationsError } = await supabase
          .from("regulations")
          .select("*")
          .in("id", savedRegs.map(r => r.regulation_id));

        if (regulationsError) {
          console.error("Error fetching regulations:", regulationsError);
          toast("Failed to load regulations");
          throw regulationsError;
        }

        const regulationsWithItems = await Promise.all(
          regulations.map(async (regulation) => {
            const { data: checklistItems, error: itemsError } = await supabase
              .from("checklist_items")
              .select("*")
              .eq("regulation_id", regulation.id);

            if (itemsError) {
              console.error(
                `Error fetching checklist items for regulation ${regulation.id}:`,
                itemsError
              );
              return {
                ...regulation,
                checklist_items: [],
              };
            }

            return {
              ...regulation,
              checklist_items: checklistItems || [],
            };
          })
        );

        console.log("Fetched regulations with items:", regulationsWithItems);
        return regulationsWithItems as RegulationType[];
      } catch (error) {
        console.error("Error in query function:", error);
        throw error;
      }
    },
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  if (isLoading) {
    return (
      <TopbarLayout>
        <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
          <div className="text-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading regulations...</p>
          </div>
        </div>
      </TopbarLayout>
    );
  }

  if (error) {
    return (
      <TopbarLayout>
        <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
          <div className="p-6 bg-red-50 border border-red-100 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading regulations</h3>
            <p className="text-red-700 mb-4">There was a problem loading your compliance checklist.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </TopbarLayout>
    );
  }

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="mb-4">
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
                    {regulations && regulations.length > 0 ? (
                      <div className="space-y-4">
                        <p>Select a regulation from the tabs above to view its checklist.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                          {regulations.map((reg) => (
                            <div 
                              key={reg.id} 
                              className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer"
                              onClick={() => setActiveTab(reg.id)}
                            >
                              <h3 className="font-medium text-lg">{reg.name}</h3>
                              <p className="text-slate-600 mt-2 text-sm">{reg.description}</p>
                              <div className="mt-3 text-sage-600 text-sm">
                                {reg.checklist_items?.length || 0} checklist items
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-amber-50 border border-amber-100 rounded-lg mt-4">
                        <h3 className="text-lg font-medium text-amber-800 mb-2">No regulations found</h3>
                        <p className="text-amber-700 mb-4">
                          It looks like you don't have any regulations in your system yet. 
                          Try performing a business analysis first to get personalized regulations.
                        </p>
                        <Button asChild>
                          <a href="/assessment">Perform Business Analysis</a>
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                {regulations?.map((regulation) => (
                  <TabsContent key={regulation.id} value={regulation.id}>
                    <div>
                      <h2 className="text-lg font-semibold mb-4">{regulation.name} Checklist</h2>
                      <p className="text-slate-600 mb-6">{regulation.description}</p>
                      
                      {regulation.checklist_items && regulation.checklist_items.length > 0 ? (
                        <div className="space-y-6">
                          {regulation.checklist_items.map((item) => (
                            <ChecklistItem 
                              key={item.id} 
                              id={item.id}
                              description={item.description} 
                              importance={item.importance}
                              category={item.category}
                              estimatedEffort={item.estimated_effort}
                              regulationId={regulation.id}
                              regulationName={regulation.name}
                              regulationDescription={regulation.description}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No checklist items found for this regulation.</p>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TopbarLayout>
  );
};

export default ComplianceChecklist;
