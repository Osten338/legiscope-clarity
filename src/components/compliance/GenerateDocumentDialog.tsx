
import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

export const GenerateDocumentDialog = ({
  open,
  onOpenChange,
  regulation,
}: GenerateDocumentDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Generate a structured document based on checklist items
      const documentTitle = `${regulation.name} Compliance Documentation`;
      const documentContent = `
# ${regulation.name} Compliance Documentation

## Overview
${regulation.description}

## Compliance Requirements

${regulation.checklist_items
  .reduce((acc: { [key: string]: string[] }, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item.description);
    return acc;
  }, {})
  .map((category, items) => `
### ${category}
${items.map(item => `- ${item}`).join('\n')}
  `).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
      `.trim();

      // Save the generated document
      const { error } = await supabase
        .from('generated_documents')
        .insert({
          title: documentTitle,
          content: documentContent,
          regulation_id: regulation.id,
          status: 'draft',
          user_id: user.id // Add the required user_id field
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
      
      toast({
        title: "Documentation Generated",
        description: "The compliance documentation has been generated and saved as a draft.",
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Compliance Documentation</DialogTitle>
          <DialogDescription>
            Generate structured documentation based on the compliance requirements and checklist items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-slate-600">
            <p>This will generate documentation that includes:</p>
            <ul className="list-disc pl-4 mt-2 space-y-1">
              <li>Overview of the regulation</li>
              <li>Detailed compliance requirements</li>
              <li>Categorized checklist items</li>
              <li>Generation timestamp</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="gap-2"
          >
            <Bot className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Documentation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
