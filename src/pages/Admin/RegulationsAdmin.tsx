import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ClipboardList, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

const RegulationsAdmin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegulationDialogOpen, setIsRegulationDialogOpen] = useState(false);
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [duplicates, setDuplicates] = useState<{[key: string]: Regulation[]}>({});
  const [currentRegulation, setCurrentRegulation] = useState<Regulation | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [checklistCounts, setChecklistCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchRegulations();
  }, []);

  const fetchRegulations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .order("name");

      if (error) throw error;
      setRegulations(data || []);
      
      // Fetch checklist item counts for each regulation
      if (data && data.length > 0) {
        const counts: {[key: string]: number} = {};
        
        for (const reg of data) {
          const { count, error: countError } = await supabase
            .from("checklist_items")
            .select("id", { count: 'exact', head: true })
            .eq("regulation_id", reg.id);
            
          if (!countError) {
            counts[reg.id] = count || 0;
          }
        }
        
        setChecklistCounts(counts);
      }
      
      // Check for duplicates
      const duplicateMap: {[key: string]: Regulation[]} = {};
      data?.forEach(reg => {
        const normName = reg.name.trim().toLowerCase();
        if (!duplicateMap[normName]) {
          duplicateMap[normName] = [];
        }
        duplicateMap[normName].push(reg);
      });
      
      // Filter out non-duplicates
      const duplicatesOnly = Object.entries(duplicateMap)
        .filter(([_, regs]) => regs.length > 1)
        .reduce((acc, [key, regs]) => {
          acc[key] = regs;
          return acc;
        }, {} as {[key: string]: Regulation[]});
      
      setDuplicates(duplicatesOnly);
    } catch (error: any) {
      toast({
        title: "Error fetching regulations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: ""
    });
    setCurrentRegulation(null);
  };

  const openRegulationDialog = (regulation?: Regulation) => {
    if (regulation) {
      setCurrentRegulation(regulation);
      setFormData({
        name: regulation.name
      });
    } else {
      resetForm();
    }
    setIsRegulationDialogOpen(true);
  };

  const openChecklistDialog = (regulation: Regulation) => {
    setCurrentRegulation(regulation);
    setIsChecklistDialogOpen(true);
  };

  // Check for existing regulations by name
  const checkExistingRegulation = async (name: string, id?: string): Promise<boolean> => {
    const normalizedName = name.trim().toLowerCase();
    let query = supabase
      .from("regulations")
      .select("id")
      .ilike("name", normalizedName);
    
    // Exclude current regulation when updating
    if (id) {
      query = query.neq("id", id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      toast({
        title: "Error checking for duplicates",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    
    return data && data.length > 0;
  };

  const handleDeleteRegulation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this regulation? This will also delete all associated checklist items.")) {
      return;
    }

    try {
      // First, delete the checklist items
      const { error: checklistError } = await supabase
        .from("checklist_items")
        .delete()
        .eq("regulation_id", id);

      if (checklistError) throw checklistError;

      // Then delete the regulation
      const { error } = await supabase
        .from("regulations")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Regulation deleted",
        description: "The regulation and its checklist items have been deleted successfully."
      });
      
      fetchRegulations();
    } catch (error: any) {
      toast({
        title: "Error deleting regulation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
      
      fetchRegulations();
    } catch (error: any) {
      toast({
        title: "Error merging duplicates",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveRegulation = async () => {
    try {
      if (!formData.name.trim()) {
        throw new Error("Regulation name is required");
      }

      // Check for duplicates before saving
      const exists = await checkExistingRegulation(
        formData.name, 
        currentRegulation?.id
      );
      
      if (exists) {
        throw new Error("A regulation with this name already exists");
      }

      // Placeholder values for description, motivation, and requirements
      const placeholderText = "Determined by AI based on checklist items";

      if (currentRegulation) {
        // Update existing regulation
        const { error } = await supabase
          .from("regulations")
          .update({
            name: formData.name,
            description: currentRegulation.description || placeholderText,
            motivation: currentRegulation.motivation || placeholderText,
            requirements: currentRegulation.requirements || placeholderText
          })
          .eq("id", currentRegulation.id);

        if (error) throw error;
        
        toast({
          title: "Regulation updated",
          description: "The regulation has been updated successfully."
        });
      } else {
        // Create new regulation
        const { error } = await supabase
          .from("regulations")
          .insert({
            name: formData.name,
            description: placeholderText,
            motivation: placeholderText,
            requirements: placeholderText
          });

        if (error) throw error;
        
        toast({
          title: "Regulation created",
          description: "The regulation has been created successfully. Add checklist items to help the AI determine when it applies."
        });
      }

      setIsRegulationDialogOpen(false);
      resetForm();
      fetchRegulations();
    } catch (error: any) {
      toast({
        title: "Error saving regulation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const navigateToChecklistEditor = (regulationId: string) => {
    navigate(`/admin/regulations/${regulationId}/checklist`);
  };

  const getDuplicatesCount = () => {
    return Object.keys(duplicates).length;
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Regulations Administration</h1>
            <p className="text-muted-foreground">
              Manage compliance regulations and expert checklists
            </p>
          </div>
          <Button onClick={() => openRegulationDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Regulation
          </Button>
        </div>

        {getDuplicatesCount() > 0 && (
          <Alert variant="destructive" className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Duplicate Regulations Detected</AlertTitle>
            <AlertDescription>
              We found {getDuplicatesCount()} regulation name(s) with duplicates. 
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => setIsDuplicateDialogOpen(true)}
              >
                Manage Duplicates
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="regulations">
          <TabsList className="mb-6">
            <TabsTrigger value="regulations">Regulations</TabsTrigger>
            <TabsTrigger value="import">Import/Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regulations">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : regulations.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-muted-foreground mb-4">
                  No regulations found. Add your first regulation to get started.
                </p>
                <Button onClick={() => openRegulationDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Regulation
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regulations.map((regulation) => (
                  <Card key={regulation.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50">
                      <CardTitle className="line-clamp-2">{regulation.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <ClipboardList className="h-4 w-4" />
                        <span>{checklistCounts[regulation.id] || 0} checklist items</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">
                            Last updated: {new Date(regulation.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openRegulationDialog(regulation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => navigateToChecklistEditor(regulation.id)}
                          >
                            <ClipboardList className="h-4 w-4 mr-2" /> Manage Checklist
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteRegulation(regulation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import/Export Regulations and Checklists</CardTitle>
                <CardDescription>
                  Bulk import or export regulations and their associated checklists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Import Regulations</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV or JSON file with regulation data to import in bulk.
                  </p>
                  <div className="flex gap-4">
                    <Input type="file" accept=".csv,.json" />
                    <Button>Upload and Import</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Regulations</h3>
                  <p className="text-sm text-muted-foreground">
                    Download all regulations and their checklists as a CSV or JSON file.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline">Export as CSV</Button>
                    <Button variant="outline">Export as JSON</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Note: Import and export functionality is coming soon. This will allow you to 
                    easily transfer regulations between environments or create backups.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Simplified Regulation Dialog */}
        <Dialog open={isRegulationDialogOpen} onOpenChange={setIsRegulationDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentRegulation ? "Edit Regulation" : "Add New Regulation"}
              </DialogTitle>
              <DialogDescription>
                Enter the name of this compliance regulation. The AI will determine when it applies based on its checklist items.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Regulation Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., GDPR, HIPAA, PCI-DSS"
                />
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">How AI determines applicability</h4>
                <p className="text-sm text-muted-foreground">
                  After creating a regulation, add checklist items to define its requirements.
                  The AI will analyze these items to determine when this regulation applies to a business.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRegulationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveRegulation}>
                {currentRegulation ? "Update Regulation" : "Add Regulation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Duplicates Management Dialog */}
        <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
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
                                onClick={() => navigateToChecklistEditor(reg.id)}
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
              <Button variant="outline" onClick={() => setIsDuplicateDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TopbarLayout>
  );
};

export default RegulationsAdmin;
