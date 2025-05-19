import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Regulation } from "./types";

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableRegulations, setAvailableRegulations] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingRegulation, setIsAddingRegulation] = useState(false);
  
  const handleOpenRegulationsDialog = async () => {
    setIsLoading(true);
    setIsDialogOpen(true);
    
    try {
      // Fetch available regulations from the database
      const { data, error } = await supabase
        .from('regulations')
        .select('*');
      
      if (error) throw error;
      
      // Cast the data to include the checklist_items property expected by Regulation type
      setAvailableRegulations((data || []) as Regulation[]);
    } catch (error: any) {
      console.error("Error fetching regulations:", error);
      toast({
        title: "Error",
        description: "Failed to load regulations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRegulation = async (regulation: Regulation) => {
    setIsAddingRegulation(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to add regulations.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if regulation is already added
      const { data: existingReg } = await supabase
        .from('saved_regulations')
        .select('id')
        .eq('user_id', user.id)
        .eq('regulation_id', regulation.id)
        .maybeSingle();
        
      if (existingReg) {
        toast({
          title: "Already Added",
          description: "This regulation is already on your dashboard.",
        });
        return;
      }
      
      // Add the regulation to the user's saved_regulations
      const { error } = await supabase
        .from('saved_regulations')
        .insert({
          user_id: user.id,
          regulation_id: regulation.id,
          status: 'in_progress',
          progress: 0
        });
      
      if (error) throw error;
      
      // Invalidate the savedRegulations query to refresh data
      queryClient.invalidateQueries({ queryKey: ['savedRegulations'] });
      
      toast({
        title: "Regulation Added",
        description: `${regulation.name} has been added to your dashboard.`,
      });
      
      // Close the dialog
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error adding regulation:", error);
      toast({
        title: "Error",
        description: "Failed to add regulation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingRegulation(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 border-b py-4 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Compliance Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor and manage your regulatory compliance
            </p>
          </div>
          
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input 
                placeholder="Search regulations..." 
                className="pl-8 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="default"
              onClick={handleOpenRegulationsDialog}
            >
              Add Regulation
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Regulation to Dashboard</DialogTitle>
            <DialogDescription>
              Select a regulation to add to your compliance dashboard.
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto space-y-3 py-4">
              {availableRegulations.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No regulations found</p>
              ) : (
                availableRegulations.map((regulation) => (
                  <div key={regulation.id} className="border rounded-lg p-4 hover:bg-slate-50">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{regulation.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {regulation.description}
                        </p>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 flex-shrink-0"
                        onClick={() => handleAddRegulation(regulation)}
                        disabled={isAddingRegulation}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
