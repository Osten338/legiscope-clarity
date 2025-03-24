
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, List, Plus, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/dashboard/Layout";

const RiskAssessmentLanding = () => {
  const navigate = useNavigate();

  // Fetch the latest business analysis to generate risks from
  const { data: latestAnalysis } = useQuery({
    queryKey: ['latest-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const generateDefaultRisks = async () => {
    try {
      if (!latestAnalysis?.id) {
        toast.error("No business analysis found. Please complete a business analysis first.");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const { data, error } = await supabase.rpc(
        'generate_default_risks_for_analysis',
        {
          p_analysis_id: latestAnalysis.id,
          p_user_id: user.id
        }
      );

      if (error) throw error;

      toast.success("Default risks have been generated successfully!");
      
      // Navigate to the risk list page (using the function directly)
      navigate("/risk-assessment/list");
    } catch (error) {
      console.error('Error generating default risks:', error);
      toast.error("Failed to generate default risks");
    }
  };

  // Define navigation functions separately to avoid type issues
  const goToMatrix = () => navigate("/risk-assessment/matrix");
  const goToList = () => navigate("/risk-assessment/list");
  const goToNewRisk = () => navigate("/risk-assessment/matrix?new=true");

  const options = [
    {
      title: "Risk Matrix",
      description: "Visualize risks based on likelihood and impact in a matrix format",
      icon: Grid,
      action: goToMatrix,
    },
    {
      title: "Risk List",
      description: "View all risks in a detailed list format with filtering options",
      icon: List,
      action: goToList,
    },
    {
      title: "Create New Risk",
      description: "Add a new risk to your assessment registry",
      icon: Plus,
      action: goToNewRisk,
    },
    {
      title: "Generate Default Risks",
      description: "Generate standard risks based on your applicable regulations",
      icon: RefreshCw,
      action: generateDefaultRisks,
    },
  ];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-sage-900">Risk Assessment</h1>
          <p className="text-slate-600 mt-2">Choose how you would like to view or manage your risks</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
          {options.map((option) => (
            <Card
              key={option.title}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => option.action()}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    option.action();
                  }}
                >
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default RiskAssessmentLanding;
