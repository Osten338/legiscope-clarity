
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useAlertSettings } from "@/hooks/useAlertSettings";

export const NotificationSettings = () => {
  const { alertSettings, updateAlertSettings } = useAlertSettings();

  if (!alertSettings) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="all-alerts" className="text-base">All Notifications</Label>
            <p className="text-sm text-slate-500">Enable or disable all notifications</p>
          </div>
          <Switch
            id="all-alerts"
            checked={alertSettings.alerts_enabled}
            onCheckedChange={(checked) =>
              updateAlertSettings.mutate({ alerts_enabled: checked })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="deadline-alerts" className="text-base">Deadline Alerts</Label>
              <p className="text-sm text-slate-500">Notifications about upcoming deadlines</p>
            </div>
            <Switch
              id="deadline-alerts"
              checked={alertSettings.deadline_alerts_enabled}
              onCheckedChange={(checked) =>
                updateAlertSettings.mutate({ deadline_alerts_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="risk-alerts" className="text-base">Risk Alerts</Label>
              <p className="text-sm text-slate-500">Updates about risk assessments</p>
            </div>
            <Switch
              id="risk-alerts"
              checked={alertSettings.risk_alerts_enabled}
              onCheckedChange={(checked) =>
                updateAlertSettings.mutate({ risk_alerts_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compliance-alerts" className="text-base">Compliance Alerts</Label>
              <p className="text-sm text-slate-500">Updates about compliance status</p>
            </div>
            <Switch
              id="compliance-alerts"
              checked={alertSettings.compliance_alerts_enabled}
              onCheckedChange={(checked) =>
                updateAlertSettings.mutate({ compliance_alerts_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-alerts" className="text-base">System Alerts</Label>
              <p className="text-sm text-slate-500">Important system notifications</p>
            </div>
            <Switch
              id="system-alerts"
              checked={alertSettings.system_alerts_enabled}
              onCheckedChange={(checked) =>
                updateAlertSettings.mutate({ system_alerts_enabled: checked })
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
