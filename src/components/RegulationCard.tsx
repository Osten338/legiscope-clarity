
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, Info, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

interface ChecklistItem {
  id: string;
  description: string;
}

interface Regulation {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItem[];
}

interface RegulationCardProps {
  regulation: Regulation;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isSaved?: boolean;
}

export const RegulationCard = ({
  regulation,
  isOpen,
  onOpenChange,
  isSaved = false,
}: RegulationCardProps) => {
  const [saving, setSaving] = useState(false);
  const [isRegulationSaved, setIsRegulationSaved] = useState(isSaved);
  const { toast } = useToast();

  const handleSaveRegulation = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save regulations",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('saved_regulations')
        .insert([
          { 
            regulation_id: regulation.id,
            user_id: session.user.id,
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          toast({
            title: "Already Saved",
            description: "This regulation is already in your saved list",
          });
        } else {
          throw error;
        }
      } else {
        setIsRegulationSaved(true);
        toast({
          title: "Regulation Saved",
          description: "The regulation has been added to your dashboard",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save regulation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-start gap-4 text-left">
            <Info className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {regulation.name}
              </h3>
              <p className="text-slate-600">{regulation.description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 mt-1"
              onClick={(e) => {
                e.stopPropagation();
                if (!isRegulationSaved) {
                  handleSaveRegulation();
                }
              }}
              disabled={saving || isRegulationSaved}
            >
              {isRegulationSaved ? (
                <BookmarkCheck className="h-5 w-5 text-sage-600" />
              ) : (
                <Bookmark className="h-5 w-5 text-sage-600" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4">
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Why This Applies
            </h4>
            <p className="text-slate-600">{regulation.motivation}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Requirements
            </h4>
            <p className="text-slate-600">{regulation.requirements}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">
              Compliance Checklist
            </h4>
            <ul className="space-y-2">
              {regulation.checklist_items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 text-slate-600"
                >
                  <Check className="h-5 w-5 text-sage-600 flex-shrink-0 mt-0.5" />
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
