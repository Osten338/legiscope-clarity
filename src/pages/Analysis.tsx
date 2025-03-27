
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnalysis } from "../hooks/useAnalysis";
import { Layout } from "@/components/dashboard/Layout";
import { AnalysisLoading } from "@/components/analysis/AnalysisLoading";
import { AnalysisNotFound } from "@/components/analysis/AnalysisNotFound";
import { AnalysisContent } from "@/components/analysis/AnalysisContent";
import { useSaveRegulations } from "@/components/analysis/AnalysisSaveRegulations";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Analysis = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, refetch } = useAnalysis(id!);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { saving, saved, saveRegulationsToUser } = useSaveRegulations(data);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching analysis",
        description: "Failed to retrieve analysis data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return <AnalysisLoading />;
  }

  if (!data) {
    return <AnalysisNotFound />;
  }

  return (
    <Layout>
      <AnalysisContent 
        data={data}
        saved={saved}
        saving={saving}
        onSaveRegulations={saveRegulationsToUser}
        goToDashboard={goToDashboard}
        refetch={refetch}
      />
    </Layout>
  );
};

export default Analysis;
