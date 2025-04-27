import { Clock, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RegulationCard } from "@/components/RegulationCard";
import { cn } from "@/lib/utils";
import { statusIcons, getStatusText } from "./utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

type ChecklistItem = {
  id: string;
  description: string;
};

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  checklist_items: ChecklistItem[];
};

type RegulationListItem = {
  id: string;
  status: string;
  progress: number;
  next_review_date: string | null;
  completion_date?: string | null;
  notes?: string | null;
  regulation_id?: string;
  regulations: Regulation;
};

interface RegulationsListProps {
  savedRegulations: RegulationListItem[];
  openRegulation: string | null;
  setOpenRegulation: (id: string | null) => void;
}

export const RegulationsList = ({
  savedRegulations,
  openRegulation,
  setOpenRegulation
}: RegulationsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRemoveRegulation = async (savedRegulationId: string) => {
    try {
      const {
        error
      } = await supabase.from('saved_regulations').delete().eq('id', savedRegulationId);
      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: ['savedRegulations']
      });
      toast({
        title: "Regulation removed",
        description: "The regulation has been removed from your dashboard"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to remove regulation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const uniqueRegulations = savedRegulations?.reduce((acc: RegulationListItem[], current: RegulationListItem) => {
    if (!current.regulations) return acc;
    
    const existingIndex = acc.findIndex(item => item.regulations?.id === current.regulations.id);
    if (existingIndex === -1) {
      return [...acc, current];
    }
    
    acc.splice(existingIndex, 1);
    return [...acc, current];
  }, [] as RegulationListItem[]);

  if (!uniqueRegulations || uniqueRegulations.length === 0) {
    return (
      <Card className="animate-appear delay-300 bg-card border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground font-inter">Active Regulations</CardTitle>
          <CardDescription className="text-base text-muted-foreground font-inter">
            No regulations have been saved to your dashboard yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center my-8">
            <Button asChild className="bg-brand hover:bg-brand/90">
              <a href="/assessment">Perform Business Analysis</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-appear delay-300 bg-card border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground font-inter">Active Regulations</CardTitle>
            <CardDescription className="text-base text-muted-foreground font-inter">
              Detailed view of all your compliance requirements
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20">
            {uniqueRegulations.length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {uniqueRegulations.map((saved, index) => {
            if (!saved.regulations) return null;
            const StatusIcon = statusIcons[saved.status as keyof typeof statusIcons]?.icon || Clock;
            const statusColor = statusIcons[saved.status as keyof typeof statusIcons]?.class || "text-muted-foreground";
            const badgeColor = saved.status === 'compliant' ? 'bg-emerald-500' : 
                             saved.status === 'in_progress' ? 'bg-amber-500' : 
                             saved.status === 'not_compliant' ? 'bg-red-500' : 'bg-blue-500';
            
            return (
              <div 
                key={saved.id} 
                className="space-y-4 animate-appear"
                style={{ animationDelay: `${300 + (index * 100)}ms` }}
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-4 flex-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-2">
                            <Badge className={cn("w-2 h-2 p-0 rounded-full", badgeColor)} />
                            <StatusIcon className={cn("w-4 h-4", statusColor)} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-inter">{getStatusText(saved.status)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="h-2 flex-1 bg-secondary rounded-full">
                      <div 
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          saved.status === 'compliant' ? 'bg-emerald-500' : 
                          saved.status === 'in_progress' ? 'bg-amber-500' : 
                          saved.status === 'not_compliant' ? 'bg-red-500' : 'bg-blue-500'
                        )}
                        style={{
                          width: `${saved.progress}%`
                        }} 
                      />
                    </div>
                    <span className="text-sm text-muted-foreground font-mono">{saved.progress}%</span>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Regulation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove this regulation from your dashboard? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveRegulation(saved.id)} className="bg-red-500 hover:bg-red-600">
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Link to={`/legislation/${saved.regulations.id}`} className="block hover:no-underline" onClick={e => {
                  e.stopPropagation();
                }}>
                  <RegulationCard 
                    regulation={{
                      ...saved.regulations,
                      checklist_items: saved.regulations.checklist_items || []
                    }} 
                    isOpen={openRegulation === saved.regulations.id} 
                    onOpenChange={() => setOpenRegulation(openRegulation === saved.regulations.id ? null : saved.regulations.id)} 
                    isSaved={true} 
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
