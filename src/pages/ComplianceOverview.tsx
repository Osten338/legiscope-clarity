
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { ComplianceOverview } from "@/components/dashboard/ComplianceOverview";
import { useEffect } from "react";

const ComplianceOverviewPage = () => {
  // Add debug logging for the page
  useEffect(() => {
    console.log("ComplianceOverviewPage mounted");
    return () => {
      console.log("ComplianceOverviewPage unmounted");
    };
  }, []);

  console.log("ComplianceOverviewPage rendering");

  return (
    <TopbarLayout>
      <div className="flex flex-col">
        <div className="container mx-auto px-6 md:px-8 lg:px-10 pt-8 max-w-7xl">
          <ComplianceOverview />
        </div>
      </div>
    </TopbarLayout>
  );
};

export default ComplianceOverviewPage;
