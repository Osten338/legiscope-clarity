
import { Layout } from "@/components/dashboard/Layout";

export const AnalysisLoading = () => {
  return (
    <Layout>
      <div className="container mx-auto p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analysis...</p>
          <p className="text-sage-600 text-sm mt-2">This may take a moment as we generate a detailed compliance analysis</p>
        </div>
      </div>
    </Layout>
  );
};
