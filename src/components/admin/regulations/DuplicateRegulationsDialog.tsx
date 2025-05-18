import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

interface DuplicateRegulationsDialogProps {
  duplicates: { [key: string]: Regulation[] };
  checklistCounts: { [key: string]: number };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onNavigateToChecklist: (regulationId: string) => void;
}

export const DuplicateRegulationsDialog = ({
  duplicates,
  checklistCounts,
  isOpen,
  onOpenChange,
  onSuccess,
  onNavigateToChecklist,
}: DuplicateRegulationsDialogProps) => {
  const { toast } = useToast();

  const handleDeleteDuplicates = async (regulations: Regulation[]) => {
    if (regulations.length <= 1) return;
    
    // Keep the first one, delete the rest
    const toKeep = regulations[0];
    const toDelete = regulations.slice(1);
    
    try {
      for (const reg of toDelete) {
        // Move all checklist items to the regulation we're keeping
        const { data: checklistItems, error: fetchError } = await supabase
          .from("checklist_items")
          .select("*")
          .eq("regulation_id", reg.id);
        
        if (fetchError) throw fetchError;
        
        // Update checklist items to point to the kept regulation
        if (checklistItems && checklistItems.length > 0) {
          for (const item of checklistItems) {
            const { error: updateError } = await supabase
              .from("checklist_items")
              .update({ regulation_id: toKeep.id })
              .eq("id", item.id);
              
            if (updateError) throw updateError;
          }
        }
        
        // Now delete the duplicate regulation
        const { error: deleteError } = await supabase
          .from("regulations")
          .delete()
          .eq("id", reg.id);
          
        if (deleteError) throw deleteError;
      }
      
      toast({
        title: "Duplicates merged",
        description: `Merged ${toDelete.length} duplicate(s) of "${toKeep.name}" successfully.`
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error merging duplicates",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Manage Duplicate Regulations</DialogTitle>
          <DialogDescription>
            We found multiple regulations with the same name. You can merge these duplicates
            by selecting which one to keep. The checklist items from all duplicates will be 
            preserved and assigned to the regulation you choose to keep.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {Object.entries(duplicates).map(([name, regs]) => (
            <Card key={name} className="mb-4">
              <CardHeader className="bg-muted/50 py-2">
                <CardTitle className="text-lg">{regs[0].name}</CardTitle>
                <CardDescription>{regs.length} duplicate entries found</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Checklist Items</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regs.map((reg) => (
                      <TableRow key={reg.id}>
                        <TableCell className="font-mono text-xs">{reg.id.substring(0, 8)}...</TableCell>
                        <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{checklistCounts[reg.id] || 0} items</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onNavigateToChecklist(reg.id)}
                          >
                            View Checklist
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => handleDeleteDuplicates(regs)}
                  >
                    Merge Duplicates
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
