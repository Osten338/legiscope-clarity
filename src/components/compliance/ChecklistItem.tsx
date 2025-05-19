
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, CalendarDays, Clipboard, ClipboardCheck, ListChecks, Building, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Response {
  status: 'completed' | 'will_do' | 'will_not_do';
  justification?: string;
}

interface SubtaskType {
  id: string;
  description: string;
  task?: string;
  is_subtask: boolean;
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
  task?: string;
  bestPractices?: string;
  department?: string;
  subtasks?: SubtaskType[];
  isSubtask?: boolean;
  showParentInfo?: boolean;
  parentDescription?: string;
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
  task,
  bestPractices,
  department,
  subtasks,
  isSubtask = false,
  showParentInfo = false,
  parentDescription,
}: ChecklistItemProps) => {
  const [status, setStatus] = useState<'completed' | 'will_do' | 'will_not_do'>(
    response?.status || 'will_do'
  );
  const [justification, setJustification] = useState(response?.justification || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showJustification, setShowJustification] = useState(!!response?.justification);
  const [showDetails, setShowDetails] = useState(false);
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

  const hasSubtasks = Array.isArray(subtasks) && subtasks.length > 0;
  const hasAdditionalInfo = !!bestPractices || !!department;

  return (
    <Card className={`overflow-hidden ${isSubtask ? "ml-6 border-l-4 border-l-slate-200" : ""}`}>
      <CardContent className="p-4 space-y-4">
        {showParentInfo && parentDescription && (
          <div className="mb-2 text-xs text-slate-500 flex items-center gap-1">
            <Clipboard className="h-3 w-3" />
            <span>Parent task: {parentDescription}</span>
          </div>
        )}
        
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
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
              
              {isSubtask && (
                <Badge variant="outline" className="bg-slate-100">Subtask</Badge>
              )}
              
              {hasSubtasks && (
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                  {subtasks?.length} subtask{subtasks!.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            {task && (
              <h4 className="font-medium">{task}</h4>
            )}
            
            <p className="text-base">{description}</p>
            
            {(hasAdditionalInfo || hasSubtasks) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs" 
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide details" : "Show details"}
              </Button>
            )}
            
            <Collapsible open={showDetails} onOpenChange={setShowDetails}>
              <CollapsibleContent className="space-y-3 border-t pt-3 mt-2">
                {bestPractices && (
                  <div className="flex gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-slate-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Best Practices</p>
                      <p className="text-slate-600">{bestPractices}</p>
                    </div>
                  </div>
                )}
                
                {department && (
                  <div className="flex gap-2 text-sm">
                    <Building className="h-4 w-4 text-slate-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Department</p>
                      <p className="text-slate-600">{department}</p>
                    </div>
                  </div>
                )}
                
                {estimatedEffort && (
                  <div className="flex gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Estimated Effort</p>
                      <p className="text-slate-600">{estimatedEffort}</p>
                    </div>
                  </div>
                )}
                
                {hasSubtasks && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ListChecks className="h-4 w-4 text-slate-600" />
                      <h5 className="font-medium text-sm">Subtasks</h5>
                    </div>
                    <div className="space-y-3 pl-2">
                      {subtasks?.map(subtask => (
                        <div key={subtask.id} className="border-l-2 border-l-slate-200 pl-3 text-sm">
                          <p className="font-medium">{subtask.task || subtask.description}</p>
                          {subtask.task && subtask.description && subtask.task !== subtask.description && (
                            <p className="text-slate-600 text-sm">{subtask.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
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
