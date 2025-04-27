
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RegulationDetails = {
  id: string;
  name: string;
  description: string;
};

type SavedRegulation = {
  id: string;
  status: string;
  progress: number;
  regulations: RegulationDetails;
};

export const ComplianceTasks = ({ savedRegulations }: { savedRegulations: SavedRegulation[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-emerald-100 text-emerald-700';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700';
      case 'under_review':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  const TaskItem = ({ regulation }: { regulation: SavedRegulation }) => (
    <div className="group flex items-center justify-between p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-all duration-300 animate-appear">
      <div className="space-y-2">
        <h3 className="font-medium text-foreground font-inter">{regulation.regulations?.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors font-inter">
          {regulation.regulations?.description}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground font-mono">
          {regulation.progress}%
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${getStatusColor(regulation.status)}`}>
          {regulation.status.replace('_', ' ')}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground font-inter">Compliance Tasks</CardTitle>
      </CardHeader>
      
      <Tabs defaultValue="all" className="px-6 pb-6">
        <ScrollArea>
          <TabsList className="mb-4 inline-flex h-9 items-center justify-center rounded-lg bg-secondary p-1 text-muted-foreground w-auto">
            <TabsTrigger
              value="all"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium font-inter ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Clock className="mr-2 h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium font-inter ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium font-inter ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Pending
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="all" className="space-y-4">
          {savedRegulations.map((reg) => (
            <TaskItem key={reg.id} regulation={reg} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {savedRegulations
            .filter(reg => reg.status === 'compliant')
            .map((reg) => (
              <TaskItem key={reg.id} regulation={reg} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {savedRegulations
            .filter(reg => reg.status !== 'compliant')
            .map((reg) => (
              <TaskItem key={reg.id} regulation={reg} />
          ))}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
