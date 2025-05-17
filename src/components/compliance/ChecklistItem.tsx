
// Import statements and interfaces
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, CalendarDays, Clipboard, ClipboardCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Response {
  status: 'completed' | 'will_do' | 'will_not_do';
  justification?: string;
}

interface ChecklistItemProps {
  id: string;
  description: string;
  importance?: number;
  category?: string;
  estimatedEffort?: string;
  regulationId: string;
  regulationName: string;
  regulationDescription: string;
  expertVerified?: boolean;
  response?: Response;
}

export const ChecklistItem = ({
  id,
  description,
  importance,
  category,
  estimatedEffort,
  regulationId,
  regulationName,
  expertVerified,
  response,
}: ChecklistItemProps) => {
  const [status, setStatus] = useState<'completed' | 'will_do' | 'will_not_do'>(
    response?.status || 'will_do'
  );
  const [justification, setJustification] = useState(response?.justification || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJustification, setShowJustification] = useState(!!response?.justification);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your response",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from("checklist_item_responses")
        .upsert({
          checklist_item_id: id,
          user_id: user.id,
          status,
          justification: justification || null,
          updated_at: new Date().toISOString(),
        });
        
      if (error) throw error;
      
      toast({
        title: "Response saved",
        description: "Your response has been recorded",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getImportanceBadge = () => {
    if (!importance) return null;
    
    const labels = [
      "Low",
      "Low-Medium",
      "Medium",
      "Medium-High",
      "High"
    ];
    
    const colors = [
      "bg-slate-100 text-slate-700",
      "bg-blue-100 text-blue-700",
      "bg-yellow-100 text-yellow-700",
      "bg-orange-100 text-orange-700",
      "bg-red-100 text-red-700"
    ];
    
    const index = Math.min(Math.max(1, importance), 5) - 1;
    
    return (
      <Badge className={`${colors[index]} font-normal`}>
        {labels[index]} Priority
      </Badge>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {expertVerified && (
                <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
                  <ClipboardCheck className="h-3 w-3" />
                  <span>Expert-verified</span>
                </Badge>
              )}
              {category && (
                <Badge variant="outline">{category}</Badge>
              )}
              {getImportanceBadge()}
            </div>
            <p className="text-base">{description}</p>
            {estimatedEffort && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Est. effort: {estimatedEffort}</span>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <Select value={status} onValueChange={(value: 'completed' | 'will_do' | 'will_not_do') => {
              setStatus(value);
              setShowJustification(value === 'will_not_do');
            }}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Completed</span>
                </SelectItem>
                <SelectItem value="will_do" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-500" />
                  <span>Will do</span>
                </SelectItem>
                <SelectItem value="will_not_do" className="flex items-center gap-2">
                  <Clipboard className="h-4 w-4 text-slate-500" />
                  <span>Will not do</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {showJustification && (
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Please provide justification:
            </label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why this item is not applicable to your business..."
              className="resize-none h-20"
            />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || (showJustification && !justification.trim())}
            size="sm"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                Saving...
              </>
            ) : (
              'Save Response'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
