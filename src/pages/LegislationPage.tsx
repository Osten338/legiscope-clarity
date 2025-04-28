
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { LegislationFeed } from "@/components/legislation/LegislationFeed";

const LegislationPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">EU Legislation Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track, analyze, and assess the impact of the latest EU legislation on your organization.
          </p>
        </div>
        <LegislationFeed />
      </div>
    </DashboardLayout>
  );
};

export default LegislationPage;
