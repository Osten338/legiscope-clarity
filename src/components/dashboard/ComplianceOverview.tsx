import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { StatusOverview } from "./StatusOverview";
import { useToast } from "@/hooks/use-toast";

export const ComplianceOverview = () => {
  const { toast } = useToast();
  
  const {
    data: savedRegulations,
    isLoading,
    error
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
        
      if (error) {
        console.error("Error fetching regulations:", error);
        toast({
          title: "Data loading error",
          description: "Could not load your saved regulations. Please try again.",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Saved regulations data:", data);
      return data || [];
    }
  });

  console.log("Is loading:", isLoading);
  console.log("Error:", error);
  console.log("Saved regulations:", savedRegulations);

  return (
    <section className="py-32 w-full overflow-hidden">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-black">Compliance Overview</h2>
            <p className="text-muted-foreground">Track your compliance status and tasks across all regulations.</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
          </div>
        )}

        {error && (
          <Card className="border-red-100 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Error loading compliance data</CardTitle>
              <p className="text-red-600 mt-2">There was a problem loading your compliance tasks. Please try again later.</p>
            </CardHeader>
          </Card>
        )}

        {!isLoading && !error && savedRegulations && savedRegulations.length > 0 ? (
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
                      <div key={reg.id} className="group flex items-center justify-between p-4 bg-muted/50 hover:bg-muted/70 rounded-lg transition-colors">
                        <div>
                          <h3 className="font-medium text-black">{reg.regulations?.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{reg.regulations?.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-muted-foreground">
                            Progress: {reg.progress}%
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium
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
        ) : (!isLoading && !error) ? (
          <Card className="border-amber-100 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">No compliance tasks found</CardTitle>
              <p className="text-amber-600 mt-2">
                It looks like you don't have any compliance tasks yet. Visit the Regulations page to add relevant regulations to your account.
              </p>
            </CardHeader>
          </Card>
        ) : null}
      </div>
    </section>
  );
};
