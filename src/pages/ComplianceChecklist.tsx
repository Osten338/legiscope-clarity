
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RegulationTab } from "@/components/compliance/RegulationTab";

const ComplianceChecklist = () => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);

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
            checklist_items!checklist_items_regulation_id_fkey (
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
              <RegulationTab
                regulation={saved.regulation}
                responses={responses}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceChecklist;
