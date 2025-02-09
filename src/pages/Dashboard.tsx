
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RegulationCard } from "@/components/RegulationCard";

const Dashboard = () => {
  const [openRegulation, setOpenRegulation] = useState<string | null>(null);

  const { data: savedRegulations, isLoading } = useQuery({
    queryKey: ['savedRegulations'],
    queryFn: async () => {
      const { data: savedRegs, error } = await supabase
        .from('saved_regulations')
        .select(`
          regulation_id,
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
      <div className="min-h-screen bg-gradient-to-b from-white to-sage-50 flex items-center justify-center">
        <div className="text-sage-600">Loading saved regulations...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-white to-sage-50 py-16 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Saved Regulations</h1>
        <div className="space-y-6">
          {savedRegulations?.map((saved) => (
            saved.regulations && (
              <RegulationCard
                key={saved.regulations.id}
                regulation={{
                  ...saved.regulations,
                  checklist_items: saved.regulations.checklist_items || []
                }}
                isOpen={openRegulation === saved.regulations.id}
                onOpenChange={() =>
                  setOpenRegulation(
                    openRegulation === saved.regulations.id ? null : saved.regulations.id
                  )
                }
                isSaved={true}
              />
            )
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
