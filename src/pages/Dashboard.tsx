
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { UpcomingReviews } from "@/components/dashboard/UpcomingReviews";
import { RegulationsList } from "@/components/dashboard/RegulationsList";
import { Layout } from "@/components/dashboard/Layout";
import { useToast } from "@/hooks/use-toast";

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
    error
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      try {
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
          `);
          
        if (error) {
          console.error("Supabase error:", error);
          toast({
            title: "Data loading error",
            description: "Could not load your saved regulations. Please try again.",
            variant: "destructive"
          });
          throw error;
        }
        
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
    }
  });

  return (
    <Layout>
      <div className="container mx-auto p-8 max-w-7xl">
        <WelcomeCard />
        {error ? (
          <div className="p-6 bg-red-50 border border-red-100 rounded-lg mb-8">
            <h3 className="text-lg font-medium text-red-800 mb-2">Could not load your data</h3>
            <p className="text-red-700 mb-4">
              We're having trouble connecting to our database. This might be due to network issues or temporary service disruption.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <StatusOverview savedRegulations={savedRegulations || []} />
            <UpcomingReviews savedRegulations={savedRegulations || []} />
            {isLoading ? (
              <div className="text-center p-12 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading your regulations...</p>
              </div>
            ) : (
              <RegulationsList
                savedRegulations={savedRegulations || []}
                openRegulation={openRegulation}
                setOpenRegulation={setOpenRegulation}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
