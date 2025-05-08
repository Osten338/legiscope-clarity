
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Edit, Trash2, AlertCircle, ArrowUp, ArrowDown } from "lucide-react";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
};

type ChecklistItem = {
  id: string;
  regulation_id: string;
  description: string;
  importance: number;
  category: string | null;
  estimated_effort: string | null;
  created_at: string;
  updated_at: string;
};

const ChecklistEditor = () => {
  const { id: regulationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<ChecklistItem | null>(null);
  const [formData, setFormData] = useState({
    description: "",
    importance: "3",
    category: "",
    estimated_effort: "",
  });

  useEffect(() => {
    if (regulationId) {
      fetchRegulationAndChecklist();
    }
  }, [regulationId]);

  const fetchRegulationAndChecklist = async () => {
    setIsLoading(true);
    try {
      // Fetch regulation details
      const { data: regulationData, error: regulationError } = await supabase
        .from("regulations")
        .select("*")
        .eq("id", regulationId)
        .single();

      if (regulationError) throw regulationError;
      setRegulation(regulationData);

      // Fetch checklist items
      const { data: checklistData, error: checklistError } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("regulation_id", regulationId)
        .order("importance", { ascending: false });

      if (checklistError) throw checklistError;
      setChecklistItems(checklistData || []);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: "",
      importance: "3",
      category: "",
      estimated_effort: "",
    });
    setCurrentItem(null);
  };

  const openDialog = (item?: ChecklistItem) => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        description: item.description,
        importance: String(item.importance || 3),
        category: item.category || "",
        estimated_effort: item.estimated_effort || "",
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this checklist item?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Checklist item deleted",
        description: "The checklist item has been deleted successfully."
      });
      
      fetchRegulationAndChecklist();
    } catch (error: any) {
      toast({
        title: "Error deleting checklist item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveItem = async () => {
    try {
      if (!formData.description.trim()) {
        throw new Error("Checklist item description is required");
      }

      if (currentItem) {
        // Update existing item
        const { error } = await supabase
          .from("checklist_items")
          .update({
            description: formData.description,
            importance: parseInt(formData.importance),
            category: formData.category || null,
            estimated_effort: formData.estimated_effort || null,
          })
          .eq("id", currentItem.id);

        if (error) throw error;
        
        toast({
          title: "Checklist item updated",
          description: "The checklist item has been updated successfully."
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from("checklist_items")
          .insert({
            regulation_id: regulationId,
            description: formData.description,
            importance: parseInt(formData.importance),
            category: formData.category || null,
            estimated_effort: formData.estimated_effort || null,
          });

        if (error) throw error;
        
        toast({
          title: "Checklist item created",
          description: "The checklist item has been created successfully."
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRegulationAndChecklist();
    } catch (error: any) {
      toast({
        title: "Error saving checklist item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const adjustItemImportance = async (item: ChecklistItem, change: number) => {
    try {
      const newImportance = Math.max(1, Math.min(5, item.importance + change));
      
      if (newImportance === item.importance) return; // No change needed
      
      const { error } = await supabase
        .from("checklist_items")
        .update({ importance: newImportance })
        .eq("id", item.id);

      if (error) throw error;
      
      fetchRegulationAndChecklist();
    } catch (error: any) {
      toast({
        title: "Error updating priority",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getImportanceLabel = (importance: number) => {
    const labels = {
      1: "Low",
      2: "Medium-Low",
      3: "Medium",
      4: "Medium-High",
      5: "High"
    };
    return labels[importance as keyof typeof labels] || "Medium";
  };

  const importanceColorClasses = {
    1: "bg-slate-100 text-slate-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-green-100 text-green-700",
    4: "bg-amber-100 text-amber-700",
    5: "bg-red-100 text-red-700"
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto p-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/regulations")}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Regulations
        </Button>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !regulation ? (
          <Card className="text-center p-12">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <p className="text-xl font-medium mb-4">Regulation not found</p>
            <Button onClick={() => navigate("/admin/regulations")}>
              Return to Regulations
            </Button>
          </Card>
        ) : (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">{regulation.name} Checklist</h1>
                <p className="text-muted-foreground max-w-3xl">
                  {regulation.description}
                </p>
              </div>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
              </Button>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Regulation Details</CardTitle>
                <CardDescription>
                  Reference information for creating checklist items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Applicability / Motivation</h3>
                  <p className="text-muted-foreground">{regulation.motivation}</p>
                </div>
                <div>
                  <h3 className="font-medium">Requirements</h3>
                  <p className="text-muted-foreground">{regulation.requirements}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Expert Checklist Items ({checklistItems.length})
              </h2>
              <div className="text-sm text-muted-foreground">
                Listed by priority (highest first)
              </div>
            </div>

            {checklistItems.length === 0 ? (
              <Card className="text-center p-8">
                <p className="text-muted-foreground mb-4">
                  No checklist items yet. Add your first item to get started.
                </p>
                <Button onClick={() => openDialog()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Checklist Item
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                      <div className="p-5 lg:w-40 flex flex-row lg:flex-col justify-between items-center lg:items-start gap-4 bg-muted/30">
                        <div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full inline-flex items-center ${importanceColorClasses[item.importance as keyof typeof importanceColorClasses] || "bg-slate-100 text-slate-700"}`}>
                            Priority: {getImportanceLabel(item.importance)}
                          </div>
                          {item.category && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Category: {item.category}
                            </div>
                          )}
                          {item.estimated_effort && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Est. effort: {item.estimated_effort}
                            </div>
                          )}
                        </div>
                        <div className="flex lg:flex-col gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => adjustItemImportance(item, 1)}
                            disabled={item.importance >= 5}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => adjustItemImportance(item, -1)}
                            disabled={item.importance <= 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-5 flex-1 flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <p>{item.description}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Checklist Item Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {currentItem ? "Edit Checklist Item" : "Add Checklist Item"}
                  </DialogTitle>
                  <DialogDescription>
                    Enter the details for this compliance requirement
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Requirement Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the compliance requirement"
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="importance">Priority</Label>
                      <Select 
                        value={formData.importance}
                        onValueChange={(value) => handleSelectChange("importance", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Low</SelectItem>
                          <SelectItem value="2">2 - Medium-Low</SelectItem>
                          <SelectItem value="3">3 - Medium</SelectItem>
                          <SelectItem value="4">4 - Medium-High</SelectItem>
                          <SelectItem value="5">5 - High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category (Optional)</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="e.g., Documentation, Process, Technical"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="estimated_effort">Estimated Effort (Optional)</Label>
                    <Input
                      id="estimated_effort"
                      name="estimated_effort"
                      value={formData.estimated_effort}
                      onChange={handleInputChange}
                      placeholder="e.g., 2-4 hours, 1 week"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveItem}>
                    {currentItem ? "Update Item" : "Add Item"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </TopbarLayout>
  );
};

export default ChecklistEditor;
