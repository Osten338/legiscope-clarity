import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";
import { StatusOverview } from "@/components/dashboard/StatusOverview";
import { UpcomingReviews } from "@/components/dashboard/UpcomingReviews";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { RegulationsList } from "@/components/dashboard/RegulationsList";

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);

  const {
    data: savedRegulations,
    isLoading
  } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
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
      if (error) throw error;
      return savedRegs;
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <div className="text-slate-900 m-auto">Loading saved regulations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-8 max-w-7xl">
          <WelcomeCard />
          <StatusOverview savedRegulations={savedRegulations || []} />
          <UpcomingReviews savedRegulations={savedRegulations || []} />
          <RegulationsList
            savedRegulations={savedRegulations || []}
            openRegulation={openRegulation}
            setOpenRegulation={setOpenRegulation}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
