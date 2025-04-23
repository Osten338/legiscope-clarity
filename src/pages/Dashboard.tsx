
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { UpcomingReviews } from "@/components/dashboard/UpcomingReviews";
import { RegulationsList } from "@/components/dashboard/RegulationsList";
import { DashboardLegislationFeed } from "@/components/dashboard/LegislationFeed";
import { Layout } from "@/components/dashboard/Layout";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// Define types for the data structure
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

type SavedRegulation = {
  id: string;
  regulation_id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  completion_date: string | null;
  notes: string | null;
  regulations: Regulation;
};

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: savedRegulations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      try {
        console.log("Fetching saved regulations...");
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          throw new Error("User not authenticated");
        }
        
        const {
          data: savedRegs,
          error
        } = await supabase.from('saved_regulations').select(`
            id,
            regulation_id,
            status,
            progress,
            next_review_date,
            completion_date,
            notes,
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
          console.error("Supabase error:", error);
          toast({
            title: "Data loading error",
            description: "Could not load your saved regulations. Please try again.",
            variant: "destructive"
          });
          throw error;
        }
        
        console.log("Saved regulations data:", savedRegs);
        
        // Transform the data to match our types
        const typedRegulations = savedRegs?.map(reg => ({
          id: reg.id,
          regulation_id: reg.regulation_id,
          status: reg.status,
          progress: reg.progress,
          next_review_date: reg.next_review_date,
          completion_date: reg.completion_date,
          notes: reg.notes,
          regulations: reg.regulations
        })) as SavedRegulation[];
        
        return typedRegulations || [];
      } catch (err) {
        console.error("Error in query function:", err);
        throw err;
      }
    },
    staleTime: 10000, // Refetch after 10 seconds
  });

  // Refetch on initial load to ensure we have the latest data
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl">
        <WelcomeCard />
        {error ? (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md mb-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="text-base font-medium text-destructive">Could not load your data</h3>
            </div>
            <p className="text-sm text-destructive/80 mb-4">
              We're having trouble connecting to our database. This might be due to network issues or temporary service disruption.
            </p>
            <Button
              onClick={() => refetch()}
              variant="destructive"
              size="sm"
              className="text-xs"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <StatusOverview savedRegulations={savedRegulations || []} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <UpcomingReviews savedRegulations={savedRegulations || []} />
              <DashboardLegislationFeed />
            </div>
            
            {isLoading ? (
              <div className="text-center p-8 bg-card rounded-md border border-border shadow-sm">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading your regulations...</p>
              </div>
            ) : savedRegulations && savedRegulations.length > 0 ? (
              <RegulationsList
                savedRegulations={savedRegulations}
                openRegulation={openRegulation}
                setOpenRegulation={setOpenRegulation}
              />
            ) : (
              <div className="p-6 bg-card border border-border rounded-md">
                <h3 className="text-base font-medium mb-2">No saved regulations found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You haven't saved any regulations to your dashboard yet. To add regulations:
                </p>
                <ol className="list-decimal ml-5 mb-6 text-sm text-muted-foreground space-y-2">
                  <li>Perform a business analysis to get personalized regulations</li>
                  <li>Save regulations to your dashboard from the analysis results</li>
                  <li>Browse regulations in the Legislation section</li>
                </ol>
                <div className="flex gap-3">
                  <Button asChild size="sm">
                    <a href="/assessment">Perform Business Analysis</a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href="/legislation">Browse Regulations</a>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
