
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChecklistItemEditor } from "@/components/admin/ChecklistItemEditor";
import { BatchChecklistImport } from "@/components/admin/BatchChecklistImport";
import { ChecklistCategoryManager } from "@/components/admin/ChecklistCategoryManager";
import { ChecklistItemVersionHistory } from "@/components/admin/ChecklistItemVersionHistory";
import { AlertTriangle, ChevronLeft, ClipboardCheck, Clock, Edit, Plus, Search, Tag, Trash2 } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ChecklistItem {
  id: string;
  description: string;
  category?: string;
  importance?: number;
  estimated_effort?: string;
  created_at: string;
  updated_at: string;
  expert_verified?: boolean;
}

interface Regulation {
  id: string;
  name: string;
  description: string;
  motivation?: string;
  requirements?: string;
}

const ChecklistEditor = () => {
  const { regulationId } = useParams<{ regulationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [activeTab, setActiveTab] = useState("items");
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [expertVerifiedOnly, setExpertVerifiedOnly] = useState<CheckedState>(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedHistoryItemId, setSelectedHistoryItemId] = useState<string | null>(null);

  const fetchRegulation = async () => {
    if (!regulationId) return;

    try {
      const { data, error } = await supabase
        .from("regulations")
        .select("*")
        .eq("id", regulationId)
        .single();

      if (error) throw error;
      
      setRegulation(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load regulation details",
        variant: "destructive",
      });
      navigate("/admin/regulations");
    }
  };

  const fetchChecklistItems = async () => {
    if (!regulationId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("checklist_items")
        .select("*")
        .eq("regulation_id", regulationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setChecklistItems(data || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map(item => item.category).filter(Boolean) || [])
      ) as string[];
      
      setCategories(uniqueCategories);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load checklist items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegulation();
    fetchChecklistItems();
  }, [regulationId]);

  useEffect(() => {
    // Filter items based on search term and category
    let filtered = [...checklistItems];
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.description.toLowerCase().includes(lowerSearch) ||
        (item.category || "").toLowerCase().includes(lowerSearch)
      );
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Filter by expert verification if checked
    if (expertVerifiedOnly) {
      filtered = filtered.filter(item => item.expert_verified);
    }
    
    setFilteredItems(filtered);
  }, [checklistItems, searchTerm, categoryFilter, expertVerifiedOnly]);

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this checklist item? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("checklist_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Item Deleted",
        description: "Checklist item has been deleted successfully.",
      });
      
      // Also delete history records
      await supabase
        .from("checklist_item_history")
        .delete()
        .eq("checklist_item_id", id);
        
      // Refresh the list
      fetchChecklistItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleHistoryClick = (itemId: string) => {
    setSelectedHistoryItemId(itemId);
    setShowHistoryDialog(true);
  };

  const handleCategoriesChange = (updatedCategories: string[]) => {
    // Just update the UI state, we'll save these with each checklist item
    setCategories(updatedCategories);
  };

  const handleImportComplete = () => {
    fetchChecklistItems();
    toast({
      title: "Import Complete",
      description: "Checklist items have been imported successfully.",
    });
  };

  const renderPriorityBadge = (importance?: number) => {
    if (!importance) return null;
    
    const colors: Record<number, string> = {
      1: "bg-slate-100 text-slate-600",
      2: "bg-blue-100 text-blue-600",
      3: "bg-yellow-100 text-yellow-600", 
      4: "bg-orange-100 text-orange-600",
      5: "bg-red-100 text-red-600"
    };
    
    return (
      <Badge className={colors[importance]}>
        P{importance}
      </Badge>
    );
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/regulations")} 
            className="mb-2"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Regulations
          </Button>
          <h1 className="text-2xl font-bold mb-2">
            {regulation ? regulation.name : "Loading..."} Checklist
          </h1>
          {regulation && (
            <p className="text-muted-foreground">
              {regulation.description}
            </p>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="items">Checklist Items</TabsTrigger>
            <TabsTrigger value="batch">Batch Import</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Checklist Items</CardTitle>
                    <CardDescription>
                      {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-full sm:w-[250px]"
                      />
                    </div>
                    
                    <Button onClick={() => setShowAddItemForm(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>
                </div>
                
                {/* Filter controls */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <select
                      className="text-sm border rounded p-1"
                      value={categoryFilter || ""}
                      onChange={(e) => setCategoryFilter(e.target.value || null)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="expertVerifiedOnly" 
                      checked={expertVerifiedOnly}
                      onCheckedChange={setExpertVerifiedOnly}
                    />
                    <label 
                      htmlFor="expertVerifiedOnly" 
                      className="text-sm cursor-pointer"
                    >
                      Expert-verified only
                    </label>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin h-8 w-8 border-2 border-b-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading checklist items...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50%]">Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="align-top">
                            <div className="flex items-start gap-2">
                              {item.expert_verified && (
                                <Badge variant="outline" className="mt-0.5 shrink-0 py-0 px-1.5">
                                  <ClipboardCheck className="h-3 w-3" />
                                </Badge>
                              )}
                              <span>{item.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.category && (
                              <Badge variant="outline">{item.category}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {renderPriorityBadge(item.importance)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleHistoryClick(item.id)}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowAddItemForm(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      No checklist items found. {searchTerm || categoryFilter ? 
                        "Try adjusting your filters or search term." : 
                        "Add your first checklist item to get started."}
                    </p>
                    
                    {(searchTerm || categoryFilter) && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter(null);
                          setExpertVerifiedOnly(false);
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {showAddItemForm && regulationId && (
              <ChecklistItemEditor
                item={selectedItem || undefined}
                regulationId={regulationId}
                categories={categories}
                onSave={() => {
                  setSelectedItem(null);
                  setShowAddItemForm(false);
                  fetchChecklistItems();
                }}
                onCancel={() => {
                  setSelectedItem(null);
                  setShowAddItemForm(false);
                }}
              />
            )}
          </TabsContent>
          
          <TabsContent value="batch">
            {regulationId && (
              <BatchChecklistImport 
                regulationId={regulationId} 
                onImportComplete={handleImportComplete} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="categories">
            <ChecklistCategoryManager 
              existingCategories={categories}
              onCategoriesChange={handleCategoriesChange}
            />
          </TabsContent>
        </Tabs>
        
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>
                View previous versions of this checklist item
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedHistoryItemId && (
                <ChecklistItemVersionHistory checklistItemId={selectedHistoryItemId} />
              )}
            </CardContent>
          </DialogContent>
        </Dialog>
      </div>
    </TopbarLayout>
  );
};

export default ChecklistEditor;
