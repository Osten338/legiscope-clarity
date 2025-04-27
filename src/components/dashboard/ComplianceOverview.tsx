
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { StatusOverview } from "./StatusOverview";

export const ComplianceOverview = () => {
  const {
    data: savedRegulations,
    isLoading,
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
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
      return data || [];
    }
  });

  return (
    <div className="py-16 w-full">
      <div className="container mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-black mb-2">Compliance Overview</h2>
          <p className="text-muted-foreground">Track your compliance status and tasks across all regulations.</p>
        </div>

        {!isLoading && savedRegulations && (
          <>
            <StatusOverview savedRegulations={savedRegulations} />
            
            <Card className="mt-8">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Compliance Tasks</CardTitle>
              </CardHeader>
              
              <Tabs defaultValue="all" className="px-6 pb-6">
                <ScrollArea>
                  <TabsList className="mb-3 gap-1 bg-transparent">
                    <TabsTrigger
                      value="all"
                      className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                    >
                      <Clock
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                      />
                      All Tasks
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                    >
                      <CheckCircle2
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                      />
                      Completed
                    </TabsTrigger>
                    <TabsTrigger
                      value="pending"
                      className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
                    >
                      <AlertTriangle
                        className="-ms-0.5 me-1.5 opacity-60"
                        size={16}
                        strokeWidth={2}
                      />
                      Pending
                    </TabsTrigger>
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {savedRegulations.map((reg) => (
                      <div key={reg.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h3 className="font-medium">{reg.regulations?.name}</h3>
                          <p className="text-sm text-muted-foreground">{reg.regulations?.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            Progress: {reg.progress}%
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs
                            ${reg.status === 'compliant' ? 'bg-green-100 text-green-700' : 
                              reg.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'}`}>
                            {reg.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                  <div className="space-y-4">
                    {savedRegulations
                      .filter(reg => reg.status === 'compliant')
                      .map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{reg.regulations?.name}</h3>
                            <p className="text-sm text-muted-foreground">{reg.regulations?.description}</p>
                          </div>
                          <div className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            {reg.status}
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="pending" className="mt-4">
                  <div className="space-y-4">
                    {savedRegulations
                      .filter(reg => reg.status !== 'compliant')
                      .map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div>
                            <h3 className="font-medium">{reg.regulations?.name}</h3>
                            <p className="text-sm text-muted-foreground">{reg.regulations?.description}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs
                            ${reg.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {reg.status}
                          </div>
                        </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
