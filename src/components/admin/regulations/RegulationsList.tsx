
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Edit, Trash2 } from "lucide-react";
import { AddRegulationButton } from "./RegulationFormDialog";

type Regulation = {
  id: string;
  name: string;
  description: string;
  motivation: string;
  requirements: string;
  created_at: string;
  updated_at: string;
};

interface RegulationsListProps {
  regulations: Regulation[];
  checklistCounts: { [key: string]: number };
  onEditRegulation: (regulation: Regulation) => void;
  onDeleteRegulation: (id: string) => void;
  onAddClick: () => void;
  isLoading: boolean;
}

export const RegulationsList = ({
  regulations,
  checklistCounts,
  onEditRegulation,
  onDeleteRegulation,
  onAddClick,
  isLoading,
}: RegulationsListProps) => {
  const navigate = useNavigate();

  const navigateToChecklistEditor = (regulationId: string) => {
    navigate(`/admin/regulations/${regulationId}/checklist`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (regulations.length === 0) {
    return (
      <Card className="text-center p-12">
        <p className="text-muted-foreground mb-4">
          No regulations found. Add your first regulation to get started.
        </p>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            console.log("Add regulation button clicked from empty state");
            onAddClick();
          }}
          type="button"
        >
          Add Regulation
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {regulations.map((regulation) => (
        <Card key={regulation.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="line-clamp-2">{regulation.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              <span>{checklistCounts[regulation.id] || 0} checklist items</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(regulation.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditRegulation(regulation)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => navigateToChecklistEditor(regulation.id)}
                >
                  <ClipboardList className="h-4 w-4 mr-2" /> Manage Checklist
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteRegulation(regulation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
