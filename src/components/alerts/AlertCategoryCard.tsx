
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

interface AlertCategoryCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  count: number;
  enabled: boolean;
}

export const AlertCategoryCard = ({
  title,
  description,
  icon,
  count,
  enabled,
}: AlertCategoryCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold text-sage-900">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id={`${title.toLowerCase()}-alerts`}
            checked={enabled}
          />
          <Label htmlFor={`${title.toLowerCase()}-alerts`}>Enable</Label>
        </div>
      </div>
      {enabled && (
        <div className="space-y-4">
          <Alert>
            <AlertTitle>{count} {count === 1 ? 'alert' : 'alerts'}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
};
