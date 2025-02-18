import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { toast } from "./ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const businessAssessmentSchema = z.object({
  // 1. General Company Information
  companyName: z.string().min(1, "Company name is required"),
  businessStructure: z.enum([
    "limitedCompany", 
    "plc", 
    "partnership", 
    "soleTrader", 
    "other"
  ]),
  employeeCount: z.string().min(1, "Employee count is required"),
  annualRevenue: z.string(),
  yearEstablished: z.string().min(1, "Year established is required"),
  
  // 2. Geographical and Jurisdictional Data
  primaryCountry: z.string().min(1, "Primary country is required"),
  primaryState: z.string().min(1, "Primary state/province is required"),
  operatingLocations: z.string(),
  
  // 3. Industry and Sector Details
  industryClassification: z.string().min(1, "Industry classification is required"),
  subIndustry: z.string(),
  businessActivities: z.string().min(1, "Business activities description is required"),
  
  // 4. Operational Characteristics
  businessModel: z.enum(["online", "offline", "hybrid"]),
  handlesPersonalData: z.boolean(),
  handlesFinancialData: z.boolean(),
  handlesSensitiveData: z.boolean(),
  hasThirdPartyVendors: z.boolean(),
  
  // 5. IT Infrastructure
  dataStorage: z.enum(["onPremise", "cloud", "hybrid"]),
  hasCyberSecurityPolicy: z.boolean(),
  
  // 6. Compliance Concerns
  knownRegulations: z.string(),
  existingAssessments: z.string()
});

type BusinessAssessmentForm = z.infer<typeof businessAssessmentSchema>;

export function BusinessAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<BusinessAssessmentForm>({
    resolver: zodResolver(businessAssessmentSchema),
    defaultValues: {
      handlesPersonalData: false,
      handlesFinancialData: false,
      handlesSensitiveData: false,
      hasThirdPartyVendors: false,
      hasCyberSecurityPolicy: false,
    }
  });

  const onSubmit = async (data: BusinessAssessmentForm) => {
    try {
      setIsSubmitting(true);
      
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("You must be logged in to submit an assessment");
      }

      const { error } = await supabase
        .from('structured_business_assessments')
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          business_structure: data.businessStructure,
          employee_count: parseInt(data.employeeCount),
          annual_revenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null,
          year_established: parseInt(data.yearEstablished),
          primary_country: data.primaryCountry,
          primary_state: data.primaryState,
          operating_locations: data.operatingLocations,
          industry_classification: data.industryClassification,
          sub_industry: data.subIndustry,
          business_activities: data.businessActivities,
          business_model: data.businessModel,
          handles_personal_data: data.handlesPersonalData,
          handles_financial_data: data.handlesFinancialData,
          handles_sensitive_data: data.handlesSensitiveData,
          has_third_party_vendors: data.hasThirdPartyVendors,
          data_storage: data.dataStorage,
          has_cyber_security_policy: data.hasCyberSecurityPolicy,
          known_regulations: data.knownRegulations,
          existing_assessments: data.existingAssessments
        });

      if (error) throw error;

      toast({
        title: "Assessment Submitted",
        description: "Your business assessment has been submitted successfully.",
      });

      // Redirect to dashboard or another appropriate page
      navigate("/dashboard");
      
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

  const totalSteps = 6;

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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">General Company Information</h2>
              
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Structure</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business structure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="limitedCompany">Private Limited Company (Ltd)</SelectItem>
                        <SelectItem value="plc">Public Limited Company (PLC)</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="soleTrader">Sole Trader</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="employeeCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Employees</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter employee count" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearEstablished"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Established</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Geographical and Jurisdictional Data</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter primary country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter state/province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="operatingLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Locations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List additional locations where you conduct business" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include all countries and regions where you have operations or customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Industry and Sector Details</h2>
              
              <FormField
                control={form.control}
                name="industryClassification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Activities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your core business activities" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include main products/services and key operations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Operational Characteristics</h2>
              
              <FormField
                control={form.control}
                name="businessModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Model</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-3 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="online" id="online" />
                              <FormLabel htmlFor="online">Online</FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="offline" id="offline" />
                              <FormLabel htmlFor="offline">Offline</FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="hybrid" id="hybrid" />
                              <FormLabel htmlFor="hybrid">Hybrid</FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="handlesPersonalData"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Personal Data Handling</FormLabel>
                        <FormDescription>
                          Does your company collect or process personal data?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="handlesFinancialData"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Financial Data Handling</FormLabel>
                        <FormDescription>
                          Does your company process financial transactions or store financial data?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">IT Infrastructure and Security</h2>
              
              <FormField
                control={form.control}
                name="dataStorage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Storage Approach</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage approach" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="onPremise">On-Premise</SelectItem>
                        <SelectItem value="cloud">Cloud-Based</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasCyberSecurityPolicy"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Cybersecurity Policy</FormLabel>
                      <FormDescription>
                        Does your company have a formal cybersecurity policy?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Specific Compliance Concerns</h2>
              
              <FormField
                control={form.control}
                name="knownRegulations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Regulations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List any specific regulations you're aware of that apply to your business" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Include any regulatory requirements you're already aware of
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="existingAssessments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Assessments</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any existing compliance assessments or audits" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

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
}
