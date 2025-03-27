
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, Bot } from "lucide-react";
import { GenerateDocumentDialog } from "./GenerateDocumentDialog";
import { ComplianceBuddyDialog } from "./ComplianceBuddyDialog";

interface ChecklistItemProps {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimatedEffort?: string;
  regulationId: string;
  regulationName: string;
  regulationDescription: string;
  response?: {
    status: "completed" | "will_do" | "will_not_do";
    justification?: string | null;
  };
}

export const ChecklistItem = ({ 
  id, 
  description, 
  importance, 
  category, 
  estimatedEffort,
  regulationId,
  regulationName,
  regulationDescription,
  response 
}: ChecklistItemProps) => {
  const { toast } = useToast();
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [buddyDialogOpen, setBuddyDialogOpen] = useState(false);

  const handleChecklistResponse = async (
    status: "completed" | "will_do" | "will_not_do",
    justification?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data: existingResponse } = await supabase
        .from("checklist_item_responses")
        .select("id")
        .eq("checklist_item_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      let error;
      
      if (existingResponse) {
        const { error: updateError } = await supabase
          .from("checklist_item_responses")
          .update({
            status,
            justification: status === "will_not_do" ? justification : null,
            completion_date: status === "completed" ? new Date().toISOString() : null,
          })
          .eq("id", existingResponse.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("checklist_item_responses")
          .insert({
            checklist_item_id: id,
            user_id: user.id,
            status,
            justification: status === "will_not_do" ? justification : null,
            completion_date: status === "completed" ? new Date().toISOString() : null,
          });
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Response saved",
        description: "Your checklist response has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getImportanceBadge = (importance?: number) => {
    if (!importance) return null;
    const colors = {
      1: "bg-slate-100 text-slate-600",
      2: "bg-blue-100 text-blue-600",
      3: "bg-yellow-100 text-yellow-600",
      4: "bg-orange-100 text-orange-600",
      5: "bg-red-100 text-red-600",
    };
    return (
      <Badge className={colors[importance as keyof typeof colors]}>
        Priority {importance}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={response?.status === "completed"}
          onCheckedChange={(checked) =>
            handleChecklistResponse(checked ? "completed" : "will_do")
          }
        />
        <div className="space-y-2 flex-1">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-900">{description}</p>
            <div className="flex flex-wrap gap-2 items-center">
              {importance && getImportanceBadge(importance)}
              {category && (
                <Badge variant="outline" className="text-sage-600">
                  {category}
                </Badge>
              )}
              {estimatedEffort && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Info className="h-3 w-3" />
                  Estimated effort: {estimatedEffort}
                </div>
              )}
            </div>
          </div>
          {response?.status === "will_not_do" && (
            <div className="pl-4 border-l-2 border-red-500">
              <p className="text-sm text-red-600">
                Justification: {response.justification}
              </p>
            </div>
          )}
          {!response?.status && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                size="sm"
                onClick={() => handleChecklistResponse("will_do")}
              >
                Will Do
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const justification = window.prompt(
                    "Please provide justification for not implementing this requirement:"
                  );
                  if (justification) {
                    handleChecklistResponse("will_not_do", justification);
                  }
                }}
              >
                Will Not Do
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={() => setGenerateDialogOpen(true)}
              >
                <FileText className="h-4 w-4" />
                Generate Documentation
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={() => setBuddyDialogOpen(true)}
              >
                <Bot className="h-4 w-4" />
                Ask Compliance Buddy
              </Button>
            </div>
          )}
        </div>
      </div>

      <GenerateDocumentDialog 
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        regulation={{
          id: regulationId,
          name: regulationName,
          description: regulationDescription,
          checklist_items: [{
            id,
            description
          }]
        }}
      />

      <ComplianceBuddyDialog
        open={buddyDialogOpen}
        onOpenChange={setBuddyDialogOpen}
        checklistItem={{
          description
        }}
      />
    </div>
  );
};
