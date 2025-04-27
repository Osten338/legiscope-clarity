import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusOverview } from "./StatusOverview";
import { ComplianceTasks } from "./ComplianceTasks";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { GooeyFilter } from "@/components/ui/gooey-filter";
import { useScreenSize } from "@/hooks/use-screen-size";

const ComplianceOverview = () => {
  const [timeFilter, setTimeFilter] = useState<string>("30");
  const [view, setView] = useState<string>("all");
  const [isGooeyEnabled, setIsGooeyEnabled] = useState(true);
  const screenSize = useScreenSize();

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
          next_review_date,
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

  const tasks = savedRegulations?.map(reg => ({
    id: reg.id,
    regulation: reg.regulations.name,
    description: `Complete compliance requirements for ${reg.regulations.name}`,
    dueDate: reg.next_review_date ? format(new Date(reg.next_review_date), 'MMM d, yyyy') : 'Not set'
  })) || [];

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
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

              {savedRegulations && <StatusOverview savedRegulations={savedRegulations} />}

              <div className="border-b border-border mt-6 relative">
                <GooeyFilter
                  id="gooey-filter"
                  strength={screenSize.lessThan("md") ? 8 : 15}
                />
                
                <div
                  className="relative"
                  style={{ filter: isGooeyEnabled ? "url(#gooey-filter)" : "none" }}
                >
                  <div className="flex w-full">
                    {complianceViews.map((tab) => (
                      <div key={tab.value} className="relative flex-1 h-12">
                        {view === tab.value && (
                          <motion.div
                            layoutId="active-tab"
                            className="absolute inset-0 bg-muted"
                            transition={{
                              type: "spring",
                              bounce: 0.0,
                              duration: 0.4,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Tabs value={view} onValueChange={setView} className="w-full">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-0">
                    {complianceViews.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="data-[state=active]:bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground data-[state=active]:text-foreground h-12 relative z-10"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

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
        </div>
        
        <div className="md:col-span-1">
          <ComplianceTasks tasks={tasks} />
        </div>
      </div>
    </section>
  );
};

export { ComplianceOverview };
