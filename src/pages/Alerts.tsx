
import { Card } from "@/components/ui/card";
import {
  BellRing,
  AlertCircle,
  Clock,
  Scale,
  Bell,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Alerts = () => {
  const { toast } = useToast();
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [deadlineAlertsEnabled, setDeadlineAlertsEnabled] = useState(true);
  const [riskAlertsEnabled, setRiskAlertsEnabled] = useState(true);
  const [complianceAlertsEnabled, setComplianceAlertsEnabled] = useState(true);
  const [systemAlertsEnabled, setSystemAlertsEnabled] = useState(true);

  // Fetch alert settings
  const { data: alertSettings, refetch } = useQuery({
    queryKey: ["alertSettings"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        throw new Error("No user found");
      }

      // Try to get existing settings
      const { data, error } = await supabase
        .from("alert_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      // If no settings exist, create them
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from("alert_settings")
          .insert([{ user_id: userId }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newData;
      }

      return data;
    },
  });

  // Update alert settings mutation
  const updateAlertSettings = useMutation({
    mutationFn: async (settings: {
      alerts_enabled?: boolean;
      deadline_alerts_enabled?: boolean;
      risk_alerts_enabled?: boolean;
      compliance_alerts_enabled?: boolean;
      system_alerts_enabled?: boolean;
    }) => {
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      if (!userId) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from("alert_settings")
        .update(settings)
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert preferences updated",
        description: "Your alert preferences have been saved",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error updating alert preferences",
        description: error.message,
        variant: "destructive",
      });
    },
  });

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

  const renderIcon = (type: string) => {
    switch (type) {
      case "deadline":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "risk":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "compliance":
        return <Scale className="h-5 w-5 text-blue-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-green-500" />;
      default:
        return <BellRing className="h-5 w-5" />;
    }
  };

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
                  onCheckedChange={handleAlertToggle}
                />
                <Label htmlFor="alerts-enabled">Enable All Alerts</Label>
              </div>
            </div>
          </div>

          {alertsEnabled ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Upcoming Deadlines */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <h2 className="text-xl font-semibold text-sage-900">Upcoming Deadlines</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="deadline-alerts"
                      checked={deadlineAlertsEnabled}
                      onCheckedChange={(checked) => handleCategoryToggle('deadline', checked)}
                    />
                    <Label htmlFor="deadline-alerts">Enable</Label>
                  </div>
                </div>
                {deadlineAlertsEnabled && (
                  <div className="space-y-4">
                    {alerts.upcomingDeadlines.map((alert) => (
                      <Alert key={alert.id}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </Card>

              {/* Risk Status Changes */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-semibold text-sage-900">Risk Status Changes</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="risk-alerts"
                      checked={riskAlertsEnabled}
                      onCheckedChange={(checked) => handleCategoryToggle('risk', checked)}
                    />
                    <Label htmlFor="risk-alerts">Enable</Label>
                  </div>
                </div>
                {riskAlertsEnabled && (
                  <div className="space-y-4">
                    {alerts.riskStatus.map((alert) => (
                      <Alert key={alert.id} variant="destructive">
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </Card>

              {/* Compliance Updates */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-sage-900">Compliance Updates</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="compliance-alerts"
                      checked={complianceAlertsEnabled}
                      onCheckedChange={(checked) => handleCategoryToggle('compliance', checked)}
                    />
                    <Label htmlFor="compliance-alerts">Enable</Label>
                  </div>
                </div>
                {complianceAlertsEnabled && (
                  <div className="space-y-4">
                    {alerts.complianceUpdates.map((alert) => (
                      <Alert key={alert.id}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </Card>

              {/* System Notifications */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-green-500" />
                    <h2 className="text-xl font-semibold text-sage-900">System Notifications</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system-alerts"
                      checked={systemAlertsEnabled}
                      onCheckedChange={(checked) => handleCategoryToggle('system', checked)}
                    />
                    <Label htmlFor="system-alerts">Enable</Label>
                  </div>
                </div>
                {systemAlertsEnabled && (
                  <div className="space-y-4">
                    {alerts.systemNotifications.map((alert) => (
                      <Alert key={alert.id}>
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </Card>
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
