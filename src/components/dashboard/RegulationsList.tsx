import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RegulationCard } from "@/components/RegulationCard";
import { cn } from "@/lib/utils";
import { statusIcons, getStatusText } from "./utils";
import { Link } from "react-router-dom";

interface RegulationsListProps {
  savedRegulations: any[];
  openRegulation: string | null;
  setOpenRegulation: (id: string | null) => void;
}

export const RegulationsList = ({
  savedRegulations,
  openRegulation,
  setOpenRegulation,
}: RegulationsListProps) => {
  // Filter out duplicates by keeping only the latest entry for each regulation
  const uniqueRegulations = savedRegulations?.reduce((acc, current) => {
    if (!current.regulations) return acc;
    
    const existingEntry = acc.find(
      (item) => item.regulations?.id === current.regulations.id
    );
    
    if (!existingEntry || new Date(current.created_at) > new Date(existingEntry.created_at)) {
      // Remove existing entry if it exists
      const filtered = acc.filter(
        (item) => item.regulations?.id !== current.regulations?.id
      );
      return [...filtered, current];
    }
    
    return acc;
  }, [] as typeof savedRegulations);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Regulations</CardTitle>
        <CardDescription>
          Detailed view of all your compliance requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uniqueRegulations?.map((saved) => {
            if (!saved.regulations) return null;
            const StatusIcon = statusIcons[saved.status as keyof typeof statusIcons]?.icon || Clock;
            const statusColor = statusIcons[saved.status as keyof typeof statusIcons]?.class || "text-slate-400";
            
            return (
              <div key={saved.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <StatusIcon className={cn("w-5 h-5", statusColor)} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{getStatusText(saved.status)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <div className="h-2 flex-1 bg-slate-100 rounded-full">
                    <div
                      className="h-2 bg-sage-500 rounded-full transition-all duration-500"
                      style={{ width: `${saved.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-600">{saved.progress}%</span>
                </div>
                <Link 
                  to={`/legislation/${saved.regulations.id}`}
                  className="block hover:no-underline"
                  onClick={(e) => {
                    // Prevent the click from triggering the collapsible
                    e.stopPropagation();
                  }}
                >
                  <RegulationCard
                    regulation={{
                      ...saved.regulations,
                      checklist_items: saved.regulations.checklist_items || []
                    }}
                    isOpen={openRegulation === saved.regulations.id}
                    onOpenChange={() =>
                      setOpenRegulation(
                        openRegulation === saved.regulations.id ? null : saved.regulations.id
                      )
                    }
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
