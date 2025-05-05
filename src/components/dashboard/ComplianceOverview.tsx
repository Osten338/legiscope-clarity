
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { StatusOverview } from "./StatusOverview";
import { RegulationsList } from "./RegulationsList";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChecklistItem = {
  id: string;
  description: string;
};

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItem[];
};

type SavedRegulationData = {
  id: string;
  regulation_id?: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  completion_date?: string | null;
  notes?: string | null;
  regulations: Regulation;
};

export const ComplianceOverview = () => {
  const { toast } = useToast();
  // Simple local state for managing tabs
  const [currentTab, setCurrentTab] = useState("overview");
  
  const {
    data: savedRegulations,
    isLoading,
    error
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      console.log("ComplianceOverview: Fetching saved regulations");
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
          next_review_date,
          regulations (
            id,
            name,
            description,
            motivation,
            requirements,
            checklist_items!checklist_items_regulation_id_fkey (
              id, 
              description
            )
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
      
      console.log("ComplianceOverview: Fetched regulations:", data?.length || 0);
      return data as SavedRegulationData[] || [];
    }
  });
  
  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    console.log("ComplianceOverview: Tab changed to:", value);
    setCurrentTab(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50 p-4">
        <p className="text-red-800">Error loading compliance data</p>
        <p className="text-red-600 mt-2">There was a problem loading your compliance tasks. Please try again later.</p>
      </Card>
    );
  }

  if (!savedRegulations || savedRegulations.length === 0) {
    return (
      <Card className="border-amber-100 bg-amber-50 p-6">
        <h3 className="text-amber-800 font-semibold mb-2">No compliance tasks found</h3>
        <p className="text-amber-600">
          It looks like you don't have any compliance tasks yet. Visit the Regulations page to add relevant regulations to your account.
        </p>
      </Card>
    );
  }

  return (
    <section className="w-full">
      <div className={cn(
        "container mx-auto space-y-8",
        "p-6",
        "hover:shadow-lg transition-shadow duration-300"
      )}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">Compliance Overview</h2>
            <p className="text-muted-foreground">Track your compliance status and tasks across all regulations.</p>
          </div>
        </div>

        <Tabs defaultValue="overview" value={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Status</TabsTrigger>
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <StatusOverview savedRegulations={savedRegulations} />
          </TabsContent>
          
          <TabsContent value="details" className="pt-4">
            <Card className="p-6">
              <h3 className="text-xl font-medium mb-4">Detailed Compliance Status</h3>
              <p className="text-muted-foreground mb-4">
                This section provides an in-depth view of your compliance status across all regulations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedRegulations.map(reg => (
                  <div key={reg.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{reg.regulations.name}</h4>
                      <span className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        reg.status === "compliant" ? "bg-green-100 text-green-800" : 
                        reg.status === "non_compliant" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"
                      )}>
                        {reg.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{reg.regulations.description}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{reg.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${reg.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="regulations" className="pt-4">
            <RegulationsList savedRegulations={savedRegulations} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
