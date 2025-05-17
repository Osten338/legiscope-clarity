
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface HistoryItem {
  id: string;
  created_at: string;
  description: string;
  version_note: string | null;
  category?: string | null;
  importance?: number | null;
}

interface ChecklistItemVersionHistoryProps {
  checklistItemId: string;
}

export const ChecklistItemVersionHistory = ({ checklistItemId }: ChecklistItemVersionHistoryProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("checklist_item_history")
        .select("*")
        .eq("checklist_item_id", checklistItemId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [checklistItemId, isOpen]);

  if (history.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full mt-4"
    >
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 w-full justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Version History
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        {isLoading ? (
          <div className="py-4 text-center">
            <div className="animate-spin h-5 w-5 border-2 border-b-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-2">Loading history...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item, index) => (
              <Card key={item.id} className={index === 0 ? "border-primary/20" : ""}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "outline"} className="px-2 py-0">
                        {index === 0 ? "Latest" : `v${history.length - index}`}
                      </Badge>
                      <span className="text-sm font-medium">
                        {item.version_note || "No version note"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-2 text-sm">
                  <div className="border-l-2 border-muted pl-3">
                    <p>{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                      {item.importance && (
                        <Badge variant="outline" className="text-xs">
                          Priority: {item.importance}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            No version history available
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
