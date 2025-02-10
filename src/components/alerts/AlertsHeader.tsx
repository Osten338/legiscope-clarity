
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AlertsHeaderProps {
  alertsEnabled: boolean;
  onToggle: (checked: boolean) => void;
}

export const AlertsHeader = ({ alertsEnabled, onToggle }: AlertsHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Alerts Center</h1>
          <p className="text-sage-600 mt-2">
            Stay updated with important notifications about your compliance and risk management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="alerts-enabled"
            checked={alertsEnabled}
            onCheckedChange={onToggle}
          />
          <Label htmlFor="alerts-enabled">Enable All Alerts</Label>
        </div>
      </div>
    </div>
  );
};
