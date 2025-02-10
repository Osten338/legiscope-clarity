
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RegulationTab } from "@/components/compliance/RegulationTab";
import { ClipboardList } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ClipboardList className="h-8 w-8 text-sage-600" />
            <h1 className="text-2xl font-bold text-slate-900">
              Compliance Checklist
            </h1>
          </div>

          {isLoadingSaved ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-sage-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
              <p className="text-sage-600">Loading your regulations...</p>
            </div>
          ) : savedRegulations?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-100">
              <ClipboardList className="h-12 w-12 text-sage-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No Regulations Added
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                You haven't added any regulations to your checklist yet. Visit the regulations page to add some to your checklist.
              </p>
            </div>
          ) : (
            <Tabs
              value={selectedRegulation || undefined}
              onValueChange={setSelectedRegulation}
              className="w-full"
            >
              <TabsList className="mb-4 bg-white p-1 border border-slate-200 rounded-lg">
                {savedRegulations?.map((saved) => (
                  <TabsTrigger
                    key={saved.regulation.id}
                    value={saved.regulation.id}
                    className="px-4 py-2 data-[state=active]:bg-sage-50 data-[state=active]:text-sage-900"
                  >
                    {saved.regulation.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {savedRegulations?.map((saved) => (
                <TabsContent
                  key={saved.regulation.id}
                  value={saved.regulation.id}
                  className="mt-4 focus-visible:outline-none focus-visible:ring-0"
                >
                  <RegulationTab
                    regulation={saved.regulation}
                    responses={responses}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecklist;
