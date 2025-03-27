import { useState } from "react";
import { Layout } from "@/components/dashboard/Layout"; // Updated to use named import
import { AlertsHeader } from "@/components/alerts/AlertsHeader";
import { AlertCategoryCard } from "@/components/alerts/AlertCategoryCard";
import { Button } from "@/components/ui/button";
import { Bell, ShieldAlert, FileWarning, AlertTriangle } from "lucide-react";
import { useAlertSettings } from "@/hooks/useAlertSettings";

const Alerts = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { alertSettings } = useAlertSettings();

  const alertCategories = [
    {
      id: "regulatory",
      title: "Regulatory Updates",
      description: "New regulations or changes to existing ones that may affect your compliance status.",
      icon: <ShieldAlert className="h-6 w-6 text-amber-500" />,
      count: 3,
    },
    {
      id: "documentation",
      title: "Documentation Alerts",
      description: "Policies or procedures that need review or are approaching expiration dates.",
      icon: <FileWarning className="h-6 w-6 text-blue-500" />,
      count: 2,
    },
    {
      id: "compliance",
      title: "Compliance Gaps",
      description: "Areas where your organization may not be fully compliant with applicable regulations.",
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      count: 1,
    },
    {
      id: "review",
      title: "Scheduled Reviews",
      description: "Upcoming compliance reviews or audits that require preparation.",
      icon: <Bell className="h-6 w-6 text-purple-500" />,
      count: 4,
    },
  ];

  const filteredAlerts = activeTab === "all" 
    ? alertCategories 
    : alertCategories.filter(category => category.id === activeTab);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <AlertsHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          totalAlerts={alertCategories.reduce((sum, cat) => sum + cat.count, 0)}
        />
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {filteredAlerts.map((category) => (
            <AlertCategoryCard 
              key={category.id}
              category={category}
              enabled={alertSettings[category.id]?.enabled ?? true}
            />
          ))}
        </div>
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No alerts in this category</p>
            <Button variant="outline" onClick={() => setActiveTab("all")}>
              View all alerts
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Alerts;
