
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Tag, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChecklistCategoryManagerProps {
  existingCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export const ChecklistCategoryManager = ({
  existingCategories = [],
  onCategoriesChange
}: ChecklistCategoryManagerProps) => {
  const [categories, setCategories] = useState<string[]>(existingCategories);
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setCategories(existingCategories);
  }, [existingCategories]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    // Check if category already exists
    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Category already exists",
        description: `"${newCategory.trim()}" is already in the list.`,
        variant: "destructive",
      });
      return;
    }

    const updatedCategories = [...categories, newCategory.trim()];
    setCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
    setNewCategory("");
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToRemove);
    setCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Tag className="h-4 w-4" /> Checklist Categories
        </CardTitle>
        <CardDescription>
          Create and manage categories for organizing checklist items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCategory();
                e.preventDefault();
              }
            }}
          />
          <Button onClick={handleAddCategory} type="button">
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No categories defined yet
            </p>
          ) : (
            categories.map((category) => (
              <Badge 
                key={category} 
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {category}
                <button 
                  onClick={() => handleRemoveCategory(category)}
                  className="ml-1 hover:text-destructive focus:outline-none"
                  aria-label={`Remove ${category} category`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
