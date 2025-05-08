
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TopbarLayout } from "@/components/dashboard/new-ui";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GdprPreset = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gdprRegulation = {
    name: "General Data Protection Regulation (GDPR)",
    description: "A regulation on data protection and privacy in the European Union (EU) and the European Economic Area (EEA), as well as the transfer of personal data outside the EU and EEA areas.",
    motivation: "Applies to all businesses that process personal data of EU residents, regardless of where the business is located.",
    requirements: "Businesses must implement appropriate technical and organizational measures to ensure data security, maintain records of processing activities, ensure proper consent mechanisms, and have procedures for handling data subject rights requests.",
  };

  const gdprChecklistItems = [
    {
      description: "Lawfulness, Fairness & Transparency Principle: All processing must be lawful (have a legal basis), fair to individuals, and transparent. Data subjects should know what, why, and how their data is used. Document the legal basis for each processing and provide clear privacy notices.",
      importance: 5,
      category: "Core Principles",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Purpose Limitation Principle: Collect and use personal data only for specific, explicit, and legitimate purposes. Do not process data for new, incompatible purposes without further user consent or other legal basis. Clearly define the purpose before collecting data, and avoid \"function creep\".",
      importance: 4,
      category: "Core Principles",
      estimated_effort: "3-5 days",
    },
    {
      description: "Data Minimization Principle: Process only the minimum amount of data necessary for the stated purpose. Do not collect or retain data that isn't needed. Implement input controls and regular reviews to ensure you only ask for or keep data that is truly required.",
      importance: 4,
      category: "Core Principles",
      estimated_effort: "3-5 days",
    },
    {
      description: "Accuracy Principle: Keep personal data accurate and up-to-date. Take reasonable steps to correct or delete inaccurate data. Implement data quality checks and allow individuals to update their information.",
      importance: 3,
      category: "Core Principles",
      estimated_effort: "3-5 days",
    },
    {
      description: "Storage Limitation Principle: Do not keep personal data in identifiable form longer than necessary for the purpose. Define retention periods or criteria to periodically review and erase data no longer needed. Use a retention schedule and automate deletion or anonymization of data that's past its business need.",
      importance: 4,
      category: "Core Principles",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Integrity & Confidentiality (Security) Principle: Ensure appropriate security of personal data – including protection against unauthorized or unlawful processing, loss, destruction or damage. Apply encryption, access controls, and other measures as needed to safeguard data.",
      importance: 5,
      category: "Core Principles",
      estimated_effort: "2-4 weeks",
    },
    {
      description: "Accountability Principle: The controller is responsible for GDPR compliance and must be able to demonstrate it. Implement effective measures and keep evidence of compliance. Establish a privacy governance program, assign compliance responsibility, conduct training, and maintain documentation.",
      importance: 5,
      category: "Core Principles",
      estimated_effort: "2-3 weeks",
    },
    {
      description: "Lawful Basis for Processing: Every processing activity must rest on a valid legal basis (e.g. consent, contract, legal obligation, vital interests, public task, or legitimate interests). Identify and document the lawful basis before processing.",
      importance: 5,
      category: "Processing Requirements",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Consent Conditions: If you rely on consent, it must be freely given, specific, informed, and unambiguous, given by a clear affirmative action. Individuals must also be able to withdraw consent as easily as they gave it. Use opt-in checkboxes, provide concise consent language, and keep records of consents.",
      importance: 5,
      category: "Processing Requirements",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Children's Consent: If you offer an online service directly to children and use consent as your legal basis, you must obtain parental consent for children under the applicable age (16 or lower depending on the country). Implement age verification or parental consent workflows.",
      importance: 5,
      category: "Special Processing",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Special Categories of Data (Sensitive Data): Avoid processing sensitive data unless absolutely necessary and ensure you meet one of the strict conditions in Article 9(2). Apply extra security measures for sensitive data.",
      importance: 5,
      category: "Special Processing",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Transparent Information (Privacy Notice): When collecting data, provide a clear privacy notice including your identity, purposes, legal basis, recipients, retention period, and data subject rights. Use plain language, especially for children.",
      importance: 4,
      category: "Transparency",
      estimated_effort: "1 week",
    },
    {
      description: "Right of Access: Implement procedures to provide individuals with confirmation if you're processing their data and a copy of that data along with specific information about the processing.",
      importance: 4,
      category: "Data Subject Rights",
      estimated_effort: "1 week",
    },
    {
      description: "Right to Rectification: Implement procedures to correct inaccurate personal data and complete incomplete data when requested.",
      importance: 3,
      category: "Data Subject Rights",
      estimated_effort: "2-3 days",
    },
    {
      description: "Right to Erasure (\"Right to be Forgotten\"): Implement procedures to erase personal data when requested, if certain conditions are met. Have a process to search and delete data across all systems.",
      importance: 4,
      category: "Data Subject Rights",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Data Protection by Design and by Default: Design systems with data protection principles in mind from the start and ensure privacy-friendly default settings. Follow the guidance in EDPB Guidelines on Article 25.",
      importance: 4,
      category: "Organizational Measures",
      estimated_effort: "Ongoing",
    },
    {
      description: "Records of Processing Activities (RoPA): Maintain an internal record documenting details of your processing operations, such as purposes, categories of data, recipients, and security measures.",
      importance: 4,
      category: "Documentation",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Security of Processing: Implement appropriate technical and organizational security measures based on risk assessment, including encryption, access control, backup procedures, and regular testing.",
      importance: 5,
      category: "Security",
      estimated_effort: "2-4 weeks",
    },
    {
      description: "Personal Data Breach Procedures: Develop an incident response plan to detect, investigate and report breaches. Have procedures to notify authorities within 72 hours and affected individuals when required.",
      importance: 4,
      category: "Security",
      estimated_effort: "1-2 weeks",
    },
    {
      description: "Data Protection Impact Assessment (DPIA): Conduct DPIAs before carrying out high-risk processing. Assess risks to individuals and implement mitigations.",
      importance: 4,
      category: "Risk Management",
      estimated_effort: "1-2 weeks per assessment",
    },
  ];

  const handleCreatePreset = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Step 1: Check if GDPR regulation already exists
      const { data: existingRegulations, error: checkError } = await supabase
        .from("regulations")
        .select("id")
        .eq("name", gdprRegulation.name)
        .maybeSingle();

      if (checkError) throw checkError;

      // If it already exists, navigate to it
      if (existingRegulations) {
        toast({
          title: "GDPR regulation already exists",
          description: "The GDPR regulation has already been created in your system."
        });
        navigate(`/admin/regulations/${existingRegulations.id}/checklist`);
        return;
      }

      // Step 2: Create the GDPR regulation
      const { data: regulationData, error: regError } = await supabase
        .from("regulations")
        .insert(gdprRegulation)
        .select()
        .single();

      if (regError) throw regError;

      // Step 3: Add the checklist items
      const checklistItemsWithRegId = gdprChecklistItems.map(item => ({
        ...item,
        regulation_id: regulationData.id
      }));

      const { error: itemsError } = await supabase
        .from("checklist_items")
        .insert(checklistItemsWithRegId);

      if (itemsError) throw itemsError;

      setIsComplete(true);
      toast({
        title: "GDPR preset created",
        description: "The GDPR regulation and its expert checklist have been created successfully."
      });

      // Navigate to the checklist after a short delay
      setTimeout(() => {
        navigate(`/admin/regulations/${regulationData.id}/checklist`);
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An error occurred while creating the GDPR preset");
      toast({
        title: "Error creating GDPR preset",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TopbarLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">GDPR Preset</h1>
        <p className="text-muted-foreground mb-8">
          Create a pre-defined GDPR regulation with expert-created checklist items
        </p>

        <Card>
          <CardContent className="p-6">
            {isComplete ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">GDPR Preset Created!</h2>
                <p className="text-muted-foreground mb-6">
                  The GDPR regulation and its {gdprChecklistItems.length} checklist items have been created successfully.
                </p>
                <Button onClick={() => navigate("/admin/regulations")}>
                  Go to Regulations
                </Button>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Error Creating Preset</h2>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={() => navigate("/admin/regulations")}>
                  Return to Regulations
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">About the GDPR Preset</h2>
                  <p className="text-muted-foreground mb-4">
                    This will create a pre-configured General Data Protection Regulation (GDPR) entry with {gdprChecklistItems.length} expert-created checklist items covering key compliance requirements.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Core GDPR principles and requirements</li>
                    <li>Data subject rights implementation guidelines</li>
                    <li>Documentation requirements</li>
                    <li>Security measures and breach protocols</li>
                    <li>Special processing considerations</li>
                  </ul>
                </div>

                <div className="flex justify-center pt-4">
                  <Button 
                    size="lg" 
                    onClick={handleCreatePreset} 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create GDPR Preset"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TopbarLayout>
  );
};

export default GdprPreset;
