
import { useParams } from "react-router-dom";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { PolicyAnalysisInterface } from "@/components/policy-analysis/PolicyAnalysisInterface";

const PolicyAnalysis = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) {
    return (
      <TopbarLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Document</h1>
            <p className="text-gray-600">No document ID provided for analysis.</p>
          </div>
        </div>
      </TopbarLayout>
    );
  }

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Analysis</h1>
          <p className="text-gray-600">
            Review document compliance against regulatory requirements
          </p>
        </div>
        
        <PolicyAnalysisInterface documentId={documentId} />
      </div>
    </TopbarLayout>
  );
};

export default PolicyAnalysis;
