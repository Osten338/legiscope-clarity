
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/new-ui/DashboardLayout";
import { DashboardHome } from "@/components/dashboard/new-ui/DashboardHome";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <DashboardLayout>
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
        <DashboardHome />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
