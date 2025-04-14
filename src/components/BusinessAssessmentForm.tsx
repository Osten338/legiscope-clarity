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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

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

type BusinessAssessmentForm = z.infer<typeof businessAssessmentSchema>;

export function BusinessAssessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<BusinessAssessmentForm>({
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

  const onSubmit = async (data: BusinessAssessmentForm) => {
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

      const { data: assessmentData, error } = await supabase
        .from('structured_business_assessments')
        .insert({
          user_id: user.id,
          company_name: data.companyName,
          business_structure: data.businessStructure,
          employee_count: parseInt(data.employeeCount),
          annual_revenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null,
          year_established: parseInt(data.yearEstablished),
          primary_country: data.primaryLocation,
          operating_locations: data.operatingLocations,
          business_model: data.customerType,
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Core Company Information</h2>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This information helps establish your company's size and structure, which determines which EU regulations apply.
                </AlertDescription>
              </Alert>
              
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
                      <FormDescription>
                        Employee count affects applicability of certain EU directives (e.g., Whistleblower Protection)
                      </FormDescription>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Geographical Scope</h2>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Cross-border operations affect which EU rules apply and how. Many EU regulations have extraterritorial effect.
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="primaryLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Country of Operation</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter primary country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operatingLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Operating Locations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List other countries/regions where you conduct business" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crossBorderActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cross-Border Activities</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="none" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            No cross-border activities (single country operation)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="euOnly" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            EU cross-border only (operating in multiple EU states)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="global" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Global operations (including EU and non-EU countries)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Cross-border operations may invoke specific EU frameworks and obligations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Business Activities and Customers</h2>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Your core business activities and customer type are critical for determining which sector-specific EU regulations apply to your company.
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="industryClassification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Industry Sector</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Financial Services</SelectItem>
                        <SelectItem value="technology">Technology/IT</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail/E-commerce</SelectItem>
                        <SelectItem value="telecom">Telecommunications</SelectItem>
                        <SelectItem value="energy">Energy</SelectItem>
                        <SelectItem value="transportation">Transportation/Logistics</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sector-specific EU legislation often applies based on your industry
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subIndustry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-industry/Specialization (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Medical devices, Mobile apps, Organic food" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coreBusinessActivities"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Core Business Activities</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe in detail what your company does, its products, services, and main operations" 
                        {...field} 
                        className="min-h-32"
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about your company's activities as many EU laws apply based on specific business functions
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="b2b" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Business-to-Business (B2B) only
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="b2c" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Business-to-Consumer (B2C) only
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="both" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Both B2B and B2C
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      B2C operations trigger EU consumer protection laws that don't apply to pure B2B activities
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Data and Technology Information</h2>
              
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Data handling and specialized technologies trigger specific EU regulations like GDPR, AI Act, and sector-specific requirements.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="handlesPersonalData"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Personal Data Handling</FormLabel>
                        <FormDescription>
                          Does your company collect or process personal data of individuals?
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
                  name="handlesSpecialCategoryData"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Special Category Data</FormLabel>
                        <FormDescription>
                          Do you process sensitive data (health, biometric, political opinions, etc.)?
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
                  name="dataVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Processing Volume</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select data volume" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small (limited data on few individuals)</SelectItem>
                          <SelectItem value="medium">Medium (moderate data processing)</SelectItem>
                          <SelectItem value="large">Large (extensive data on many individuals)</SelectItem>
                          <SelectItem value="veryLarge">Very Large (massive scale data processing)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Large-scale data processing may trigger additional GDPR requirements
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specialized Technologies and Materials</h3>
                
                <FormField
                  control={form.control}
                  name="usesAI"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Artificial Intelligence (AI)</FormLabel>
                        <FormDescription>
                          Does your company develop or use AI systems?
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
                  name="usesChemicals"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Chemical Substances</FormLabel>
                        <FormDescription>
                          Do you manufacture, import or use chemical substances?
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
                  name="usesMedicalDevices"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Medical Devices</FormLabel>
                        <FormDescription>
                          Does your business involve medical devices or healthcare products?
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
                  name="usesRegulatedProducts"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Other Regulated Products</FormLabel>
                        <FormDescription>
                          Do you deal with other heavily regulated products (cosmetics, food, electronics, etc.)?
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
              <h2 className="text-2xl font-semibold">Existing Compliance Information</h2>
              
              <FormField
                control={form.control}
                name="knownRegulations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Applicable Regulations</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List any specific EU regulations you're already aware of that apply to your business" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="existingCompliance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Compliance Measures</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe any compliance measures, certifications, or frameworks you already have in place" 
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
