
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard/new-ui";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AnalysisNotFound = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-8">
        <div className="text-center">
          <p className="text-slate-600">No analysis data available.</p>
          <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
