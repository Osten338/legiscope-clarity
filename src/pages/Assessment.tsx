
import { useState } from "react";
import { motion } from "framer-motion";
import { BusinessAssessmentForm } from "@/components/BusinessAssessmentForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { BusinessDescription } from "@/components/business-assessment/BusinessDescription";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Card, CardContent } from "@/components/ui/card";

const Assessment = () => {
  const [assessmentMethod, setAssessmentMethod] = useState<"form" | "description">("form");

  return (
    <TopbarLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-semibold mb-4 text-gray-900">Business Assessment</h1>
                <p className="text-lg text-gray-600">
                  Complete this assessment to help us understand your business and identify relevant compliance requirements.
                </p>
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please ensure all information provided is accurate and up-to-date.
                  </AlertDescription>
                </Alert>
              </motion.div>
              
              <Card className="shadow-md border border-gray-200 overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex gap-4 mb-6">
                      <button 
                        onClick={() => setAssessmentMethod("form")}
                        className={`px-4 py-2 rounded-lg transition-colors ${assessmentMethod === "form" 
                          ? "bg-primary text-white" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      >
                        Structured Form
                      </button>
                      <button 
                        onClick={() => setAssessmentMethod("description")}
                        className={`px-4 py-2 rounded-lg transition-colors ${assessmentMethod === "description" 
                          ? "bg-primary text-white" 
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                      >
                        Free-form Description
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {assessmentMethod === "form" 
                        ? "Complete the structured form to provide detailed information about your business."
                        : "Provide a free-form description of your business and our AI will analyze it."}
                    </p>
                  </div>
                  
                  {assessmentMethod === "form" ? (
                    <BusinessAssessmentForm />
                  ) : (
                    <BusinessDescription />
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </TopbarLayout>
  );
};

export default Assessment;
