
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";

const ComplianceOverviewPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="container mx-auto pt-8">
          <ComplianceOverview />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceOverviewPage;
