
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Compliance Documents</h1>
          <p className="text-slate-500 mt-1">
            Upload and manage your compliance-related documents
          </p>
        </div>
        <Button onClick={onUpload} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      {regulations && regulations.length > 0 && (
        <div className="border-t pt-6">
          <label className="text-sm font-medium text-slate-700 mb-2 block">
            Filter by Regulation
          </label>
          <ToggleGroup
            type="single"
            value={selectedRegulation}
            onValueChange={(value) => onRegulationChange(value || undefined)}
            className="justify-start"
          >
            <ToggleGroupItem value="all" className="gap-2">
              All Documents
            </ToggleGroupItem>
            {regulations.map((reg) => (
              <ToggleGroupItem key={reg.id} value={reg.id} className="gap-2">
                {reg.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
};
