
export const customerTypeToBusinessModel = (customerType: string): string => {
  switch(customerType) {
    case "b2b":
      return "b2b";
    case "b2c":
      return "b2c";
    case "both":
      return "b2b_b2c";
    default:
      return "b2b"; // Default fallback
  }
};

export const businessStructureMap: Record<string, string> = {
  "limitedCompany": "limited_company",
  "plc": "plc",
  "partnership": "partnership",
  "soleTrader": "sole_trader",
  "other": "other"
};

export const mapBusinessStructure = (structure: string): string => {
  return businessStructureMap[structure] || structure;
};
