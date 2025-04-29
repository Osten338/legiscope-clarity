
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopbarLayout } from "@/components/dashboard/new-ui";

const RiskAssessmentLanding = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const navigate = useNavigate();

  const assessmentTypes = [
    {
      id: "matrix",
      title: "Risk Matrix Assessment",
      description: "Create a risk matrix to visualize and prioritize risks based on impact and likelihood.",
      icon: <ShieldCheck className="h-6 w-6 text-sage-600" />,
    },
    {
      id: "detailed",
      title: "Detailed Risk Analysis",
      description: "Conduct an in-depth analysis of specific risks with detailed documentation and mitigation plans.",
      icon: <FileSpreadsheet className="h-6 w-6 text-sage-600" />,
    },
  ];

  const handleContinue = () => {
    if (selectedAssessment) {
      navigate(`/risk-assessment/${selectedAssessment}`);
    }
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto px-6 md:px-8 lg:px-10 py-8 max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6">Risk Assessment Tools</h1>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            Risk assessments help you identify, analyze, and evaluate potential risks to your organization's compliance posture.
          </AlertDescription>
        </Alert>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {assessmentTypes.map((assessment) => (
            <Card 
              key={assessment.id} 
              className={`cursor-pointer transition-all ${selectedAssessment === assessment.id ? 'border-sage-500 bg-sage-50/50' : 'border-sage-200 hover:border-sage-300'}`}
              onClick={() => setSelectedAssessment(assessment.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  {assessment.icon}
                  <CardTitle className="text-lg">{assessment.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600">{assessment.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleContinue} 
            disabled={!selectedAssessment}
            className="gap-2"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TopbarLayout>
  );
};

export default RiskAssessmentLanding;
