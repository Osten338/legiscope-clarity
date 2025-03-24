
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RegulationTab } from "@/components/compliance/RegulationTab";
import { ClipboardList, ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComplianceBuddyDialog } from "@/components/compliance/ComplianceBuddyDialog";
import { Layout } from "@/components/dashboard/Layout";

// Define the types for the regulation data
type RegulationWithChecklistItems = {
  id: string;
  name: string;
  description: string;
  checklist_items: {
    id: string;
    description: string;
    importance?: number;
    category?: string;
    estimated_effort?: string;
  }[];
};

type SavedRegulationWithDetails = {
  id: string;
  regulation: RegulationWithChecklistItems;
};

type ChecklistItemResponse = {
  checklist_item_id: string;
  status: 'completed' | 'will_do' | 'will_not_do';
  justification: string | null;
};

const ComplianceChecklist = () => {
  const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

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
              description,
              importance,
              category,
              estimated_effort
            )
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      return data as SavedRegulationWithDetails[];
    },
  });

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
      return data as ChecklistItemResponse[];
    },
  });

  const currentRegulation = savedRegulations?.find(
    saved => saved.regulation.id === selectedRegulation
  )?.regulation;

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {selectedRegulation && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRegulation(null)}
                  className="mr-2"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              )}
              <ClipboardList className="h-8 w-8 text-slate-600" />
              <h1 className="text-2xl font-serif text-slate-900">
                Compliance Checklist
              </h1>
            </div>
          </div>

          {isLoadingSaved ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-600 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4" />
              <p className="text-slate-600 font-serif">Loading your regulations...</p>
            </div>
          ) : !savedRegulations || savedRegulations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-100">
              <ClipboardList className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2 font-serif">
                No Regulations Added
              </h3>
              <p className="text-slate-600 max-w-md mx-auto font-serif">
                You haven't added any regulations to your checklist yet. Visit the regulations page to add some to your checklist.
              </p>
            </div>
          ) : !selectedRegulation ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRegulations.map((saved) => (
                <Card
                  key={saved.regulation.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md border-slate-200",
                    "hover:border-slate-300"
                  )}
                  onClick={() => setSelectedRegulation(saved.regulation.id)}
                >
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-lg text-slate-900 font-serif">
                      {saved.regulation.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-slate-600 text-sm font-serif">
                      {saved.regulation.description}
                    </p>
                    <div className="mt-4 text-sm text-slate-600 font-serif">
                      {saved.regulation.checklist_items.length} checklist items
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
              <Tabs
                value={selectedRegulation}
                onValueChange={setSelectedRegulation}
                className="w-full"
              >
                <ScrollArea className="w-full">
                  <TabsList className="inline-flex min-w-full border-b border-slate-200 bg-transparent p-0 h-auto">
                    {savedRegulations?.map((saved) => (
                      <TabsTrigger
                        key={saved.regulation.id}
                        value={saved.regulation.id}
                        className="flex-shrink-0 px-6 py-3 rounded-none border-r border-slate-200 last:border-r-0 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-700 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-slate-600 hover:text-slate-700 transition-colors"
                      >
                        <span className="truncate block">
                          {saved.regulation.name}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollArea>
                {savedRegulations?.map((saved) => (
                  <TabsContent
                    key={saved.regulation.id}
                    value={saved.regulation.id}
                    className="focus-visible:outline-none focus-visible:ring-0"
                  >
                    {currentRegulation && (
                      <RegulationTab
                        regulation={currentRegulation}
                        responses={responses}
                      />
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      </div>

      <Button
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full shadow-lg bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        onClick={() => setShowChat(true)}
      >
        <Bot className="h-6 w-6" />
      </Button>

      <ComplianceBuddyDialog
        open={showChat}
        onOpenChange={setShowChat}
        checklistItem={{ description: "How can I improve my compliance?" }}
      />
    </Layout>
  );
};

export default ComplianceChecklist;
