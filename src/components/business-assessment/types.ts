
export type BusinessAssessmentForm = {
  companyName: string;
  employeeCount: string;
  annualRevenue?: string;
  yearEstablished: string;
  businessStructure: "limitedCompany" | "plc" | "partnership" | "soleTrader" | "other";
  primaryLocation: string;
  operatingLocations?: string;
  crossBorderActivities: "none" | "euOnly" | "global";
  industryClassification: string;
  subIndustry?: string;
  coreBusinessActivities: string;
  customerType: "b2b" | "b2c" | "both";
  handlesPersonalData: boolean;
  handlesSpecialCategoryData: boolean;
  dataVolume: "small" | "medium" | "large" | "veryLarge";
  usesAI: boolean;
  usesChemicals: boolean;
  usesMedicalDevices: boolean;
  usesRegulatedProducts: boolean;
  knownRegulations?: string;
  existingCompliance?: string;
};
