
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusOverview } from "./StatusOverview";

const ComplianceOverview = () => {
  const [timeFilter, setTimeFilter] = useState<string>("30");
  const [view, setView] = useState<string>("all");

  const { data: savedRegulations } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('saved_regulations')
        .select(`
          id,
          status,
          progress,
          regulations (
            id,
            name,
            description
          )
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    }
  });

  const complianceViews = [
    { value: "all", label: "All" },
    { value: "review", label: "Review" },
    { value: "in_progress", label: "In Progress" },
    { value: "compliant", label: "Compliant" },
    { value: "not_compliant", label: "Non-Compliant" }
  ];

  const timeFilters = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" }
  ];

  return (
    <section className="space-y-6">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-xl font-medium">Compliance Workflow</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="text-sm">
                My documents
              </Button>
              <Tabs value={timeFilter} onValueChange={setTimeFilter}>
                <TabsList className="bg-muted">
                  {timeFilters.map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className="text-sm"
                    >
                      {filter.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Status Overview Grid */}
          {savedRegulations && <StatusOverview savedRegulations={savedRegulations} />}

          {/* Compliance Status Tabs */}
          <div className="border-b border-border mt-6">
            <Tabs value={view} onValueChange={setView} className="w-full">
              <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0">
                {complianceViews.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-muted rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground h-9"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Empty State */}
          {(!savedRegulations || savedRegulations.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium mb-2">No compliance documents</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Start by adding regulations to track or upload compliance documents.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Regulation
              </Button>
            </div>
          )}
        </CardHeader>
      </Card>
    </section>
  );
};

export { ComplianceOverview };
