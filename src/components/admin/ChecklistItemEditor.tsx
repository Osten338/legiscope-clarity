
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Clock, AlertTriangle } from "lucide-react";

interface ChecklistItemEditorProps {
  item?: {
    id: string;
    description: string;
    category?: string;
    importance?: number;
    estimated_effort?: string;
    expert_verified?: boolean;
  };
  regulationId: string;
  categories: string[];
  onSave: () => void;
  onCancel: () => void;
}

export const ChecklistItemEditor = ({
  item,
  regulationId,
  categories = [],
  onSave,
  onCancel
}: ChecklistItemEditorProps) => {
  const [description, setDescription] = useState(item?.description || "");
  const [category, setCategory] = useState(item?.category || "general");
  const [importance, setImportance] = useState<number>(item?.importance || 3);
  const [estimatedEffort, setEstimatedEffort] = useState(item?.estimated_effort || "");
  const [isExpertVerified, setIsExpertVerified] = useState(item?.expert_verified || false);
  const [isSaving, setIsSaving] = useState(false);
  const [versionNote, setVersionNote] = useState("");
  
  const { toast } = useToast();
  
  const isEditing = !!item;

  const handleSave = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        // Update existing item
        const { error } = await supabase
          .from("checklist_items")
          .update({
            description,
            category,
            importance,
            estimated_effort: estimatedEffort,
            expert_verified: isExpertVerified,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (error) throw error;
        
        // Record version history if there's a version note
        if (versionNote.trim()) {
          const { error: historyError } = await supabase
            .from("checklist_item_history")
            .insert({
              checklist_item_id: item.id,
              description,
              version_note: versionNote,
              category,
              importance
            });
            
          if (historyError) {
            console.error("Failed to save version history:", historyError);
          }
        }

        toast({
          title: "Item Updated",
          description: "Checklist item has been updated successfully.",
        });
      } else {
        // Create new item
        const { data, error } = await supabase
          .from("checklist_items")
          .insert({
            regulation_id: regulationId,
            description,
            category,
            importance,
            estimated_effort: estimatedEffort,
            expert_verified: isExpertVerified,
          })
          .select("id")
          .single();

        if (error) throw error;
        
        // Record initial version history if there's a version note
        if (versionNote.trim() && data?.id) {
          await supabase
            .from("checklist_item_history")
            .insert({
              checklist_item_id: data.id,
              description,
              version_note: versionNote || "Initial version",
              category,
              importance
            });
        }

        toast({
          title: "Item Created",
          description: "New checklist item has been created successfully.",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditing ? "Edit Checklist Item" : "Add New Checklist Item"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a clear, actionable description"
            className="min-h-[100px]"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="importance">Priority Level</Label>
            <Select 
              value={importance.toString()} 
              onValueChange={(val) => setImportance(parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Low</SelectItem>
                <SelectItem value="2">2 - Low-Medium</SelectItem>
                <SelectItem value="3">3 - Medium</SelectItem>
                <SelectItem value="4">4 - Medium-High</SelectItem>
                <SelectItem value="5">5 - High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedEffort">Estimated Effort</Label>
          <Input
            id="estimatedEffort"
            value={estimatedEffort}
            onChange={(e) => setEstimatedEffort(e.target.value)}
            placeholder="e.g., 2-3 days, 1 week"
          />
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="expertVerified" 
            checked={isExpertVerified}
            onCheckedChange={(checked) => setIsExpertVerified(!!checked)}
          />
          <Label htmlFor="expertVerified" className="text-sm font-medium">
            This checklist item has been verified by a compliance expert
          </Label>
        </div>
        
        {isEditing && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="versionNote" className="text-sm font-medium">
                Version History Note
              </Label>
            </div>
            <Input
              id="versionNote"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="What changed in this version? (optional)"
            />
            <p className="text-xs text-muted-foreground">
              Adding a note will create a new entry in the version history
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Save Changes" : "Create Item"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
