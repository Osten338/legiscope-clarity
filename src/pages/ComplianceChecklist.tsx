
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistTabs } from "@/components/compliance/ChecklistTabs";
import { useComplianceChecklist } from "@/hooks/compliance";

const ComplianceChecklist = () => {
  const {
    regulations,
    isLoading,
    error,
    activeTab,
    handleTabChange,
    refetch
  } = useComplianceChecklist();

  // Debug component rendering
  console.log("ComplianceChecklist rendering with activeTab:", activeTab);

  if (isLoading) {
    return (
      <TopbarLayout>
        <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
          <div className="text-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading regulations...</p>
          </div>
        </div>
      </TopbarLayout>
    );
  }

  if (error) {
    return (
      <TopbarLayout>
        <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
          <div className="p-6 bg-red-50 border border-red-100 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading regulations</h3>
            <p className="text-red-700 mb-4">There was a problem loading your compliance checklist.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </TopbarLayout>
    );
  }

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ChecklistTabs 
              regulations={regulations || []}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </CardContent>
        </Card>
      </div>
    </TopbarLayout>
  );
};

export default ComplianceChecklist;
