
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Clock, FileText, ExternalLink, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RegulationImpactAnalysis } from "./RegulationImpactAnalysis";
import { formatDate, truncateDescription } from "./utils/legislationUtils";

interface LegislationItemProps {
  item: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    celex: string;
    hasAnalysis?: boolean;
  };
  onAnalysisComplete: () => void;
}

export const LegislationItem = ({ item, onAnalysisComplete }: LegislationItemProps) => {
  const [selectedItem, setSelectedItem] = useState<typeof item | null>(null);

  return (
    <div className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-slate-900 mb-1 leading-tight">
          {item.title}
        </h3>
        {item.hasAnalysis && (
          <Badge variant="secondary" className="ml-2">
            <BarChart size={12} className="mr-1" />
            Analyzed
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <Clock size={12} />
        <span>{formatDate(item.pubDate)}</span>
        {item.celex && (
          <>
            <span>•</span>
            <FileText size={12} />
            <span>{item.celex}</span>
          </>
        )}
      </div>
      <p className="text-sm text-slate-600 mb-2">
        {truncateDescription(item.description)}
      </p>
      <div className="flex gap-2 mt-2">
        {item.link && (
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
          >
            View on EUR-Lex
            <ExternalLink size={12} className="ml-1" />
          </a>
        )}
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2 h-6"
              onClick={() => setSelectedItem(item)}
            >
              <BarChart size={12} className="mr-1" />
              {item.hasAnalysis ? "View Impact Analysis" : "Analyze Impact"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Regulatory Impact Analysis</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <RegulationImpactAnalysis 
                regulation={{
                  title: selectedItem.title,
                  description: selectedItem.description,
                  celex: selectedItem.celex
                }}
                onAnalysisComplete={onAnalysisComplete}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
