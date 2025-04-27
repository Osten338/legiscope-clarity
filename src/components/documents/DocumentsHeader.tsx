
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownNavigation } from "@/components/ui/dropdown-navigation";

interface DocumentsHeaderProps {
  onUpload: () => void;
  selectedRegulation: string | undefined;
  onRegulationChange: (value: string | undefined) => void;
}

export const DocumentsHeader = ({ 
  onUpload, 
  selectedRegulation,
  onRegulationChange,
}: DocumentsHeaderProps) => {
  const { data: regulations } = useQuery({
    queryKey: ['regulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulations')
        .select('id, name');
      if (error) throw error;
      return data;
    },
  });

  // Transform regulations data into the format expected by DropdownNavigation
  const navItems = regulations ? [
    {
      id: 0,
      label: "All Documents",
      link: "#",
    },
    ...regulations.map((reg) => ({
      id: Number(reg.id),
      label: reg.name,
      link: "#",
    }))
  ] : [];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-slate-900">Compliance Documents</h1>
          <p className="text-slate-600 mt-1 font-serif">
            Upload and manage your compliance-related documents
          </p>
        </div>
        <Button onClick={onUpload} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      {regulations && regulations.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <DropdownNavigation 
            navItems={navItems}
            onSelect={(id) => onRegulationChange(id === 0 ? 'all' : String(id))}
            selectedId={selectedRegulation === 'all' ? 0 : selectedRegulation ? Number(selectedRegulation) : 0}
          />
        </div>
      )}
    </div>
  );
};

