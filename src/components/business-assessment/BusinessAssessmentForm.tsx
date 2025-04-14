
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { customerTypeToBusinessModel, mapBusinessStructure } from "@/lib/enumMapping";
import { CompanyInformationStep } from "./CompanyInformationStep";
import { GeographicalScope } from "./GeographicalScope";
import { BusinessActivities } from "./BusinessActivities";
import { DataTechnology } from "./DataTechnology";
import { ExistingCompliance } from "./ExistingCompliance";
import type { BusinessAssessmentForm as BusinessAssessmentFormType } from "./types";

const businessAssessmentSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  employeeCount: z.string().min(1, "Employee count is required"),
  annualRevenue: z.string().optional(),
  yearEstablished: z.string().min(1, "Year established is required"),
  businessStructure: z.enum(["limitedCompany", "plc", "partnership", "soleTrader", "other"]),
  primaryLocation: z.string().min(1, "Primary country is required"),
  operatingLocations: z.string().optional(),
  crossBorderActivities: z.enum(["none", "euOnly", "global"]),
  industryClassification: z.string().min(1, "Industry classification is required"),
  subIndustry: z.string().optional(),
  coreBusinessActivities: z.string().min(1, "Core business activities description is required"),
  customerType: z.enum(["b2b", "b2c", "both"]),
  handlesPersonalData: z.boolean(),
  handlesSpecialCategoryData: z.boolean(),
  dataVolume: z.enum(["small", "medium", "large", "veryLarge"]),
  usesAI: z.boolean(),
  usesChemicals: z.boolean(),
  usesMedicalDevices: z.boolean(),
  usesRegulatedProducts: z.boolean(),
  knownRegulations: z.string().optional(),
  existingCompliance: z.string().optional()
});

export function BusinessAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<BusinessAssessmentFormType>({
    resolver: zodResolver(businessAssessmentSchema),
    defaultValues: {
      companyName: "",
      employeeCount: "",
      annualRevenue: "",
      yearEstablished: "",
      businessStructure: "limitedCompany",
      primaryLocation: "",
      operatingLocations: "",
      crossBorderActivities: "none",
      industryClassification: "",
      subIndustry: "",
      coreBusinessActivities: "",
      customerType: "both",
      handlesPersonalData: false,
      handlesSpecialCategoryData: false,
      dataVolume: "small",
      usesAI: false,
      usesChemicals: false,
      usesMedicalDevices: false,
      usesRegulatedProducts: false,
      knownRegulations: "",
      existingCompliance: ""
    }
  });

  const onSubmit = async (data: BusinessAssessmentFormType) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to submit an assessment");
      }

      console.log("Submitting assessment data:", {
        user_id: user.id,
        ...data
      });

      const businessModel = customerTypeToBusinessModel(data.customerType);
      console.log("Mapped business model:", businessModel);
      
      const businessStructure = mapBusinessStructure(data.businessStructure);
      console.log("Mapped business structure:", businessStructure);

      const { data: assessmentData, error } = await supabase
        .from('structured_business_assessments')
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          business_structure: businessStructure,
          employee_count: parseInt(data.employeeCount),
          annual_revenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null,
          year_established: parseInt(data.yearEstablished),
          primary_country: data.primaryLocation,
          operating_locations: data.operatingLocations,
          business_model: businessModel,
          industry_classification: data.industryClassification,
          sub_industry: data.subIndustry,
          business_activities: data.coreBusinessActivities,
          handles_personal_data: data.handlesPersonalData,
          handles_sensitive_data: data.handlesSpecialCategoryData,
          handles_financial_data: false,
          has_third_party_vendors: false,
          data_storage: "cloud",
          has_cyber_security_policy: false,
          primary_state: "",
          known_regulations: data.knownRegulations,
          existing_assessments: data.existingCompliance
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      const { data: analysisResponse, error: analysisError } = await supabase.functions.invoke('analyze-business', {
        body: {
          assessment_id: assessmentData.id,
          description: `${data.companyName} is a ${data.businessStructure} company established in ${data.yearEstablished}, 
            operating primarily in ${data.primaryLocation} with ${data.crossBorderActivities === 'none' ? 'no cross-border operations' : 
            data.crossBorderActivities === 'euOnly' ? 'operations across EU countries' : 'global operations'}. 
            
            The company operates in the ${data.industryClassification} industry ${data.subIndustry ? `(specifically ${data.subIndustry})` : ''} 
            and has ${data.employeeCount} employees. 
            
            Their core business activities include: ${data.coreBusinessActivities}
            
            Customer base: ${data.customerType === 'b2b' ? 'Business-to-business only' : 
                           data.customerType === 'b2c' ? 'Business-to-consumer only' : 
                           'Both B2B and B2C services/products'}
            
            Data processing characteristics:
            - Handles personal data: ${data.handlesPersonalData ? 'Yes' : 'No'}
            - Handles special category (sensitive) data: ${data.handlesSpecialCategoryData ? 'Yes' : 'No'}
            - Data processing volume: ${data.dataVolume}
            
            Specialized regulatory domains:
            - Uses AI technology: ${data.usesAI ? 'Yes' : 'No'}
            - Handles chemicals: ${data.usesChemicals ? 'Yes' : 'No'}
            - Manufactures/distributes medical devices: ${data.usesMedicalDevices ? 'Yes' : 'No'}
            - Deals with other regulated products: ${data.usesRegulatedProducts ? 'Yes' : 'No'}`,
        }
      });

      if (analysisError) {
        console.error("Analysis error:", analysisError);
        throw analysisError;
      }

      console.log("Analysis response:", analysisResponse);

      toast({
        title: "Assessment Submitted",
        description: "Your business assessment has been submitted and analyzed successfully.",
      });

      navigate(`/analysis/${assessmentData.id}`);
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <motion.div
          initial={{ opacity: 0,x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep === 1 && <CompanyInformationStep form={form} />}
          {currentStep === 2 && <GeographicalScope form={form} />}
          {currentStep === 3 && <BusinessActivities form={form} />}
          {currentStep === 4 && <DataTechnology form={form} />}
          {currentStep === 5 && <ExistingCompliance form={form} />}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            )}
          </div>
        </motion.div>
      </form>
    </Form>
  );
};
