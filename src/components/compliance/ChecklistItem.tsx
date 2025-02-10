
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChecklistItemProps {
  id: string;
  description: string;
  response?: {
    status: "completed" | "will_do" | "will_not_do";
    justification?: string | null;
  };
}

export const ChecklistItem = ({ id, description, response }: ChecklistItemProps) => {
  const { toast } = useToast();

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

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Checkbox
          checked={response?.status === "completed"}
          onCheckedChange={(checked) =>
            handleChecklistResponse(checked ? "completed" : "will_do")
          }
        />
        <div className="space-y-2">
          <p className="text-sm text-slate-900">{description}</p>
          {response?.status === "will_not_do" && (
            <div className="pl-4 border-l-2 border-red-500">
              <p className="text-sm text-red-600">
                Justification: {response.justification}
              </p>
            </div>
          )}
          {!response?.status && (
            <div className="flex gap-2 mt-2">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
