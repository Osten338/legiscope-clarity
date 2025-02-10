
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, List, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RiskAssessmentLanding = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Risk Matrix",
      description: "Visualize risks based on likelihood and impact in a matrix format",
      icon: Grid,
      action: () => navigate("/risk-assessment/matrix"),
    },
    {
      title: "Risk List",
      description: "View all risks in a detailed list format with filtering options",
      icon: List,
      action: () => navigate("/risk-assessment/list"),
    },
    {
      title: "Create New Risk",
      description: "Add a new risk to your assessment registry",
      icon: Plus,
      action: () => navigate("/risk-assessment/matrix?new=true"),
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sage-900">Risk Assessment</h1>
          <p className="text-slate-600 mt-2">Choose how you would like to view or manage your risks</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
          {options.map((option) => (
            <Card
              key={option.title}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={option.action}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-sage-100">
                  <option.icon className="w-6 h-6 text-sage-600" />
                </div>
                <h2 className="text-lg font-semibold">{option.title}</h2>
                <p className="text-sm text-slate-600">{option.description}</p>
                <Button
                  variant="ghost"
                  className="mt-4 w-full"
                  onClick={option.action}
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentLanding;
