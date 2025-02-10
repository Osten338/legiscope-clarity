
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface AlertItem {
  id: number;
  title: string;
  description: string;
  type: string;
}

interface AlertCategoryCardProps {
  title: string;
  icon: LucideIcon;
  alerts: AlertItem[];
  isEnabled: boolean;
  onToggle: (checked: boolean) => void;
  variant?: "default" | "destructive";
}

export const AlertCategoryCard = ({
  title,
  icon: Icon,
  alerts,
  isEnabled,
  onToggle,
  variant = "default",
}: AlertCategoryCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-sage-900">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${title.toLowerCase()}-alerts`}
            checked={isEnabled}
            onCheckedChange={onToggle}
          />
          <Label htmlFor={`${title.toLowerCase()}-alerts`}>Enable</Label>
        </div>
      </div>
      {isEnabled && (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={variant}>
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </Card>
  );
};
