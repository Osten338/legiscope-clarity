
import { Card } from "@/components/ui/card";
import {
  BellRing,
  AlertCircle,
  Clock,
  Scale,
  FileWarning,
  Bell,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Alerts = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sage-900">Alerts Center</h1>
        <p className="text-sage-600 mt-2">
          Stay updated with important notifications about your compliance and risk management
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold text-sage-900">Upcoming Deadlines</h2>
          </div>
          <div className="space-y-4">
            {alerts.upcomingDeadlines.map((alert) => (
              <Alert key={alert.id}>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        {/* Risk Status Changes */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-semibold text-sage-900">Risk Status Changes</h2>
          </div>
          <div className="space-y-4">
            {alerts.riskStatus.map((alert) => (
              <Alert key={alert.id} variant="destructive">
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        {/* Compliance Updates */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-sage-900">Compliance Updates</h2>
          </div>
          <div className="space-y-4">
            {alerts.complianceUpdates.map((alert) => (
              <Alert key={alert.id}>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        {/* System Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold text-sage-900">System Notifications</h2>
          </div>
          <div className="space-y-4">
            {alerts.systemNotifications.map((alert) => (
              <Alert key={alert.id}>
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
