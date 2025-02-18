
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [documentation, setDocumentation] = useState<string | null>(null);
  const { toast } = useToast();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sage-600" />
            Generate Implementation Documentation
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0">
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
            <ScrollArea className="h-full pr-4">
              <div className="prose prose-sage max-w-none">
                {documentation}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
