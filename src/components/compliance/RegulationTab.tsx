
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChecklistItem } from "./ChecklistItem";

interface RegulationTabProps {
  regulation: {
    id: string;
    name: string;
    description: string;
    checklist_items: Array<{
      id: string;
      description: string;
    }>;
  };
  responses?: Array<{
    checklist_item_id: string;
    status: "completed" | "will_do" | "will_not_do";
    justification: string | null;
  }>;
}

export const RegulationTab = ({ regulation, responses }: RegulationTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{regulation.name}</CardTitle>
        <CardDescription>{regulation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh]">
          <div className="space-y-6">
            {regulation.checklist_items?.map((item) => {
              const response = responses?.find(
                (r) => r.checklist_item_id === item.id
              );
              return (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  response={response}
                />
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
