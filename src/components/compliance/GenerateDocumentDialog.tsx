
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      }
      return [...prev, itemId];
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === regulation.checklist_items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(regulation.checklist_items.map(item => item.id));
    }
  };

  const handleGenerate = async () => {
    try {
      if (selectedItems.length === 0) {
        toast({
          title: "No items selected",
          description: "Please select at least one requirement to generate documentation.",
          variant: "destructive",
        });
        return;
      }

      setIsGenerating(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Filter checklist items based on selection
      const selectedChecklist = regulation.checklist_items.filter(item => 
        selectedItems.includes(item.id)
      );

      // Generate a structured document based on selected checklist items
      const documentTitle = `${regulation.name} - Selected Requirements Documentation`;
      
      // Group items by category and generate content
      const categorizedItems = selectedChecklist.reduce((acc: { [key: string]: string[] }, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item.description);
        return acc;
      }, {});

      const documentContent = `
# ${regulation.name} - Selected Requirements Documentation

## Overview
Selected compliance requirements from ${regulation.name}.

## Selected Requirements

${Object.entries(categorizedItems).map(([category, items]) => `
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
          user_id: user.id
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
      
      toast({
        title: "Documentation Generated",
        description: "The compliance documentation for selected requirements has been generated and saved as a draft.",
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
            Select the requirements you want to include in the documentation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="select-all"
              checked={selectedItems.length === regulation.checklist_items.length}
              onCheckedChange={handleSelectAll}
            />
            <label 
              htmlFor="select-all" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select All Requirements
            </label>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {regulation.checklist_items.map((item) => (
                <div key={item.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={item.id}
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className="text-sm text-slate-600 leading-tight"
                  >
                    {item.description}
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
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
