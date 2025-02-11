
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
          <Tabs
            value={selectedRegulation}
            onValueChange={(value) => onRegulationChange(value)}
            className="w-full"
          >
            <ScrollArea className="w-full">
              <TabsList className="inline-flex min-w-full border-b border-slate-200 bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="all"
                  className="flex-shrink-0 px-6 py-3 rounded-none border-r border-slate-200 last:border-r-0 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-sage-700 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-sage-600 hover:text-sage-700 transition-colors"
                >
                  <span className="truncate block">All Documents</span>
                </TabsTrigger>
                {regulations.map((reg) => (
                  <TabsTrigger
                    key={reg.id}
                    value={reg.id}
                    className="flex-shrink-0 px-6 py-3 rounded-none border-r border-slate-200 last:border-r-0 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-sage-700 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-b-sage-600 hover:text-sage-700 transition-colors"
                  >
                    <span className="truncate block">{reg.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </Tabs>
        </div>
      )}
    </div>
  );
};
