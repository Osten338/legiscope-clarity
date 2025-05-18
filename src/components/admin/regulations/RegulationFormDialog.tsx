
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

interface RegulationFormDialogProps {
  regulation?: Regulation | null;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RegulationFormDialog = ({
  regulation,
  onSuccess,
  isOpen,
  onOpenChange,
}: RegulationFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
  });

  // Debug log when dialog state changes
  useEffect(() => {
    console.log("RegulationFormDialog - isOpen state:", isOpen);
  }, [isOpen]);

  // Reset form when regulation changes
  useEffect(() => {
    if (regulation) {
      setFormData({
        name: regulation.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [regulation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Check for existing regulations by name
  const checkExistingRegulation = async (
    name: string,
    id?: string
  ): Promise<boolean> => {
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

  const handleSaveRegulation = async () => {
    try {
      if (!formData.name.trim()) {
        throw new Error("Regulation name is required");
      }

      // Check for duplicates before saving
      const exists = await checkExistingRegulation(
        formData.name,
        regulation?.id
      );

      if (exists) {
        throw new Error("A regulation with this name already exists");
      }

      // Placeholder values for description, motivation, and requirements
      const placeholderText = "Determined by AI based on checklist items";

      if (regulation) {
        // Update existing regulation
        const { error } = await supabase
          .from("regulations")
          .update({
            name: formData.name,
            description: regulation.description || placeholderText,
            motivation: regulation.motivation || placeholderText,
            requirements: regulation.requirements || placeholderText,
          })
          .eq("id", regulation.id);

        if (error) throw error;

        toast({
          title: "Regulation updated",
          description: "The regulation has been updated successfully.",
        });
      } else {
        // Create new regulation
        const { error } = await supabase.from("regulations").insert({
          name: formData.name,
          description: placeholderText,
          motivation: placeholderText,
          requirements: placeholderText,
        });

        if (error) throw error;

        toast({
          title: "Regulation created",
          description:
            "The regulation has been created successfully. Add checklist items to help the AI determine when it applies.",
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error saving regulation",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] z-50">
        <DialogHeader>
          <DialogTitle>
            {regulation ? "Edit Regulation" : "Add New Regulation"}
          </DialogTitle>
          <DialogDescription>
            Enter the name of this compliance regulation. The AI will determine
            when it applies based on its checklist items.
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
            <h4 className="text-sm font-medium mb-2">
              How AI determines applicability
            </h4>
            <p className="text-sm text-muted-foreground">
              After creating a regulation, add checklist items to define its
              requirements. The AI will analyze these items to determine when
              this regulation applies to a business.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveRegulation} type="button">
            {regulation ? "Update Regulation" : "Add Regulation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
