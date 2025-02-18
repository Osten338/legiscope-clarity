
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bot, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface GenerateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regulation: {
    id: string;
    name: string;
    description: string;
    checklist_items: Array<{
      id: string;
      description: string;
      category?: string;
    }>;
  };
}

export function GenerateDocumentDialog({
  open,
  onOpenChange,
  regulation,
}: GenerateDocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [documentation, setDocumentation] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateDocumentation = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke(
        'generate-documentation',
        {
          body: {
            regulation: {
              name: regulation.name,
              description: regulation.description
            },
            checklistItem: regulation.checklist_items[0]
          },
        }
      );

      if (error) throw error;

      setDocumentation(data.documentation);
      
    } catch (error: any) {
      toast({
        title: "Error generating documentation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveDocumentation = async () => {
    try {
      setIsSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Create a blob from the documentation text
      const blob = new Blob([documentation || ''], { type: 'text/plain' });
      const fileName = `implementation-guide-${regulation.name.toLowerCase().replace(/\s+/g, '-')}.txt`;
      
      // Upload the file to storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('compliance_documents')
        .upload(`${user.id}/${fileName}`, blob);

      if (uploadError) throw uploadError;

      // Save the document metadata
      const { error: insertError } = await supabase
        .from('compliance_documents')
        .insert({
          file_name: fileName,
          file_path: fileData.path,
          document_type: 'Implementation Guide',
          description: `AI-generated implementation guide for ${regulation.name}`,
          regulation_id: regulation.id,
          user_id: user.id,
        });

      if (insertError) throw insertError;

      // Invalidate the compliance documents query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });

      toast({
        title: "Documentation saved",
        description: "The implementation guide has been saved and can be accessed from the Documents view.",
      });

      // Close the dialog
      onOpenChange(false);
      
    } catch (error: any) {
      toast({
        title: "Error saving documentation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sage-600" />
            Generate Implementation Documentation
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {!documentation && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <Bot className="h-12 w-12 text-sage-400" />
              <p className="text-sage-600 text-center max-w-md">
                Generate detailed documentation for implementing this compliance requirement using AI
              </p>
              <Button onClick={generateDocumentation}>
                Generate Documentation
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
              <p className="text-sage-600">Generating documentation...</p>
            </div>
          )}

          {documentation && (
            <>
              <div className="flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <div className="prose prose-sage max-w-none p-4">
                    {documentation}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <Button 
                  onClick={saveDocumentation} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {!isSaving && <Save className="h-4 w-4" />}
                  Save to Documentation
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
