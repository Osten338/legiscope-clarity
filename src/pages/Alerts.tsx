
import { Card } from "@/components/ui/card";
import {
  Clock,
  AlertCircle,
  Scale,
  Bell,
  BellRing,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AlertCategoryCard } from "@/components/alerts/AlertCategoryCard";
import { AlertsHeader } from "@/components/alerts/AlertsHeader";
import { useAlertSettings } from "@/hooks/useAlertSettings";

const Alerts = () => {
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [deadlineAlertsEnabled, setDeadlineAlertsEnabled] = useState(true);
  const [riskAlertsEnabled, setRiskAlertsEnabled] = useState(true);
  const [complianceAlertsEnabled, setComplianceAlertsEnabled] = useState(true);
  const [systemAlertsEnabled, setSystemAlertsEnabled] = useState(true);

  const { alertSettings, updateAlertSettings } = useAlertSettings();

  // This would typically come from your backend
  const alerts = {
    upcomingDeadlines: [
      {
        id: 1,
        title: "Annual Compliance Review Due",
        description: "Complete the annual compliance review by December 31, 2024",
        type: "deadline",
      },
      {
        id: 2,
        title: "License Renewal",
        description: "Business operation license expires in 30 days",
        type: "deadline",
      },
    ],
    riskStatus: [
      {
        id: 3,
        title: "High Risk Alert",
        description: "Data protection risk level has been elevated to HIGH",
        type: "risk",
      },
    ],
    complianceUpdates: [
      {
        id: 4,
        title: "New Regulation Update",
        description: "Changes to environmental compliance requirements effective next quarter",
        type: "compliance",
      },
    ],
    systemNotifications: [
      {
        id: 5,
        title: "Document Review Required",
        description: "Safety protocol document needs your review and approval",
        type: "system",
      },
    ],
  };

  // Update local state when settings are fetched
  useEffect(() => {
    if (alertSettings) {
      setAlertsEnabled(alertSettings.alerts_enabled);
      setDeadlineAlertsEnabled(alertSettings.deadline_alerts_enabled);
      setRiskAlertsEnabled(alertSettings.risk_alerts_enabled);
      setComplianceAlertsEnabled(alertSettings.compliance_alerts_enabled);
      setSystemAlertsEnabled(alertSettings.system_alerts_enabled);
    }
  }, [alertSettings]);

  const handleAlertToggle = async (checked: boolean) => {
    setAlertsEnabled(checked);
    updateAlertSettings.mutate({ alerts_enabled: checked });
  };

  const handleCategoryToggle = async (category: string, checked: boolean) => {
    switch (category) {
      case 'deadline':
        setDeadlineAlertsEnabled(checked);
        updateAlertSettings.mutate({ deadline_alerts_enabled: checked });
        break;
      case 'risk':
        setRiskAlertsEnabled(checked);
        updateAlertSettings.mutate({ risk_alerts_enabled: checked });
        break;
      case 'compliance':
        setComplianceAlertsEnabled(checked);
        updateAlertSettings.mutate({ compliance_alerts_enabled: checked });
        break;
      case 'system':
        setSystemAlertsEnabled(checked);
        updateAlertSettings.mutate({ system_alerts_enabled: checked });
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          <AlertsHeader 
            alertsEnabled={alertsEnabled}
            onToggle={handleAlertToggle}
          />

          {alertsEnabled ? (
            <div className="grid gap-6 md:grid-cols-2">
              <AlertCategoryCard
                title="Upcoming Deadlines"
                icon={Clock}
                alerts={alerts.upcomingDeadlines}
                isEnabled={deadlineAlertsEnabled}
                onToggle={(checked) => handleCategoryToggle('deadline', checked)}
              />

              <AlertCategoryCard
                title="Risk Status Changes"
                icon={AlertCircle}
                alerts={alerts.riskStatus}
                isEnabled={riskAlertsEnabled}
                onToggle={(checked) => handleCategoryToggle('risk', checked)}
                variant="destructive"
              />

              <AlertCategoryCard
                title="Compliance Updates"
                icon={Scale}
                alerts={alerts.complianceUpdates}
                isEnabled={complianceAlertsEnabled}
                onToggle={(checked) => handleCategoryToggle('compliance', checked)}
              />

              <AlertCategoryCard
                title="System Notifications"
                icon={Bell}
                alerts={alerts.systemNotifications}
                isEnabled={systemAlertsEnabled}
                onToggle={(checked) => handleCategoryToggle('system', checked)}
              />
            </div>
          ) : (
            <Card className="p-6">
              <div className="text-center text-sage-600">
                <BellRing className="h-12 w-12 mx-auto mb-4 text-sage-400" />
                <h2 className="text-xl font-semibold mb-2">Alerts are disabled</h2>
                <p>Enable alerts using the toggle above to see your notifications.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;
