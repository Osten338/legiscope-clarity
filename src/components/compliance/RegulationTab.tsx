
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChecklistItem } from "./ChecklistItem";
import { ClipboardCheck, FileText } from "lucide-react";
import { useState } from "react";
import { GenerateDocumentDialog } from "./GenerateDocumentDialog";

interface RegulationTabProps {
  regulation: {
    id: string;
    name: string;
    description: string;
    checklist_items: Array<{
      id: string;
      description: string;
      importance?: number;
      category?: string;
      estimated_effort?: string;
    }>;
  };
  responses?: Array<{
    checklist_item_id: string;
    status: "completed" | "will_do" | "will_not_do";
    justification: string | null;
  }>;
}

export const RegulationTab = ({ regulation, responses }: RegulationTabProps) => {
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  
  // Sort checklist items by importance (if available)
  const sortedItems = [...regulation.checklist_items].sort((a, b) => 
    (b.importance || 1) - (a.importance || 1)
  );

  return (
    <Card className="border-sage-200 shadow-sm">
      <CardHeader className="border-b border-sage-100 bg-sage-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-5 w-5 text-sage-600" />
            <div>
              <CardTitle className="text-xl text-sage-900">{regulation.name}</CardTitle>
              <CardDescription className="text-sage-600 mt-1">
                {regulation.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setGenerateDialogOpen(true)}
          >
            <FileText className="h-4 w-4" />
            Generate Documentation
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {sortedItems.map((item) => {
              const response = responses?.find(
                (r) => r.checklist_item_id === item.id
              );
              return (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  description={item.description}
                  importance={item.importance}
                  category={item.category}
                  estimatedEffort={item.estimated_effort}
                  response={response}
                />
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <GenerateDocumentDialog 
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        regulation={regulation}
      />
    </Card>
  );
};
