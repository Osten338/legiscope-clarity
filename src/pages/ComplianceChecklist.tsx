
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/dashboard/Sidebar";

const ComplianceChecklist = () => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch saved regulations for the current user
  const { data: savedRegulations, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["saved-regulations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("saved_regulations")
        .select(`
          id,
          regulation:regulations (
            id,
            name,
            description,
            checklist_items (
              id,
              description
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  // Fetch responses for checklist items
  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ["checklist-responses", selectedRegulation],
    enabled: !!selectedRegulation,
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("checklist_item_responses")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
  });

  const handleChecklistResponse = async (
    itemId: string,
    status: "completed" | "will_do" | "will_not_do",
    justification?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("checklist_item_responses")
        .upsert({
          checklist_item_id: itemId,
          user_id: user.id,
          status,
          justification: status === "will_not_do" ? justification : null,
          completion_date: status === "completed" ? new Date().toISOString() : null,
        });

      if (error) throw error;

      toast({
        title: "Response saved",
        description: "Your checklist response has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingSaved || isLoadingResponses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Compliance Checklist
        </h1>
        <Tabs
          value={selectedRegulation || undefined}
          onValueChange={setSelectedRegulation}
          className="w-full"
        >
          <TabsList className="mb-4">
            {savedRegulations?.map((saved) => (
              <TabsTrigger
                key={saved.regulation.id}
                value={saved.regulation.id}
                className="px-4 py-2"
              >
                {saved.regulation.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {savedRegulations?.map((saved) => (
            <TabsContent
              key={saved.regulation.id}
              value={saved.regulation.id}
              className="mt-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{saved.regulation.name}</CardTitle>
                  <CardDescription>
                    {saved.regulation.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-6">
                      {saved.regulation.checklist_items?.map((item) => {
                        const response = responses?.find(
                          (r) => r.checklist_item_id === item.id
                        );
                        return (
                          <div key={item.id} className="space-y-4">
                            <div className="flex items-start gap-4">
                              <Checkbox
                                checked={response?.status === "completed"}
                                onCheckedChange={(checked) =>
                                  handleChecklistResponse(
                                    item.id,
                                    checked ? "completed" : "will_do"
                                  )
                                }
                              />
                              <div className="space-y-2">
                                <p className="text-sm text-slate-900">
                                  {item.description}
                                </p>
                                {response?.status === "will_not_do" && (
                                  <div className="pl-4 border-l-2 border-red-500">
                                    <p className="text-sm text-red-600">
                                      Justification: {response.justification}
                                    </p>
                                  </div>
                                )}
                                {!response?.status && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleChecklistResponse(item.id, "will_do")
                                      }
                                    >
                                      Will Do
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const justification = window.prompt(
                                          "Please provide justification for not implementing this requirement:"
                                        );
                                        if (justification) {
                                          handleChecklistResponse(
                                            item.id,
                                            "will_not_do",
                                            justification
                                          );
                                        }
                                      }}
                                    >
                                      Will Not Do
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceChecklist;

