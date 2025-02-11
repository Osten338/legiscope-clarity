
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { DocumentCard } from "./DocumentCard";

export const DocumentsList = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['compliance-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_documents')
        .select(`
          *,
          regulations (
            id,
            name
          )
        `)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center text-slate-500 my-8">
        Loading documents...
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <Card className="p-8 text-center text-slate-500">
        No documents uploaded yet. Click the upload button to add your first document.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((document) => (
        <DocumentCard key={document.id} document={document} />
      ))}
    </div>
  );
};
