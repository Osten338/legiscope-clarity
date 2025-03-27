
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bot } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ReviewDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    file_name: string;
    description?: string;
    regulations?: { name: string } | null;
  };
}

export function ReviewDocumentDialog({
  open,
  onOpenChange,
  document,
}: ReviewDocumentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [review, setReview] = useState<string | null>(null);

  const requestReview = async () => {
    try {
      setIsLoading(true);
      
      // Call the ComplianceBuddy edge function to review the document
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke(
        "compliance-buddy-chat",
        {
          body: {
            messages: [{
              role: "user",
              content: `Please review this document "${document.file_name}" ${document.description ? `with description: ${document.description}` : ''} 
              ${document.regulations ? `related to regulation: ${document.regulations.name}` : ''}.
              Analyze its compliance aspects and provide recommendations.`
            }],
            checklistItem: "Document Review Request"
          },
        }
      );

      if (error) throw error;

      // Save the review in the database
      const { error: insertError } = await supabase
        .from('document_reviews')
        .insert({
          document_id: document.id,
          content: data.reply,
          user_id: user.id
        });

      if (insertError) throw insertError;

      setReview(data.reply);
      
    } catch (error: any) {
      toast({
        title: "Error reviewing document",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-sage-600" />
            Document Review
          </DialogTitle>
          <DialogDescription>
            ComplianceBuddy will analyze {document.file_name} for compliance requirements and provide recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          {!review && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <Bot className="h-12 w-12 text-sage-400" />
              <Button onClick={requestReview}>
                Start Document Review
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-sage-600" />
              <p className="text-sage-600">Analyzing document with Perplexity AI...</p>
            </div>
          )}

          {review && (
            <ScrollArea className="h-full pr-4">
              <div className="prose prose-sage max-w-none">
                {review}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
