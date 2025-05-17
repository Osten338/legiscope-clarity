
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BatchChecklistImportProps {
  regulationId: string;
  onImportComplete: () => void;
}

export const BatchChecklistImport = ({ regulationId, onImportComplete }: BatchChecklistImportProps) => {
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please enter checklist items to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Split by new lines and filter out empty lines
      const items = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Check if we have any items to import
      if (items.length === 0) {
        toast({
          title: "No items found",
          description: "Please enter valid checklist items, one per line",
          variant: "destructive",
        });
        setIsImporting(false);
        return;
      }

      // Prepare the items for batch insert
      const checklistItems = items.map(description => ({
        regulation_id: regulationId,
        description,
        // Default values
        importance: 3, // Medium importance by default
        category: "general"
      }));

      // Insert the items
      const { error } = await supabase
        .from("checklist_items")
        .insert(checklistItems);

      if (error) throw error;

      toast({
        title: "Import Successful",
        description: `Imported ${items.length} checklist items`,
      });

      // Clear the textarea and notify parent
      setImportText("");
      onImportComplete();

    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4" /> Batch Import Checklist Items
        </CardTitle>
        <CardDescription>
          Enter multiple checklist items, one per line. Each line will become a separate checklist item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter checklist items, one per line
Example:
Appoint a Data Protection Officer
Maintain records of processing activities
Conduct regular data protection impact assessments"
          className="min-h-[200px] font-mono text-sm"
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
        />
        <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <AlertTriangle size={12} />
            <span>
              Each line will be imported as a separate checklist item
            </span>
          </div>
          <div>
            {importText.split("\n").filter(line => line.trim().length > 0).length} items
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button 
          onClick={handleImport}
          disabled={isImporting || !importText.trim()}
        >
          {isImporting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Importing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Import Items
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
