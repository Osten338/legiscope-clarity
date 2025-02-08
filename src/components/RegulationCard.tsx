
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Check, Info } from "lucide-react";

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
}

export const RegulationCard = ({
  regulation,
  isOpen,
  onOpenChange,
}: RegulationCardProps) => {
  return (
    <Card className="p-6">
      <Collapsible open={isOpen} onOpenChange={onOpenChange}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-start gap-4 text-left">
            <Info className="h-6 w-6 text-sage-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {regulation.name}
              </h3>
              <p className="text-slate-600">{regulation.description}</p>
            </div>
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
