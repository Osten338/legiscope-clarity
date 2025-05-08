
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { RegulationListItem } from "../types";
import { useEffect, useState } from "react";

interface RequirementItem {
  id: string;
  requirement: string;
  applicability: string;
  lawReferences: string;
  description: string;
}

interface RegulationRequirementsTableProps {
  regulation: RegulationListItem;
}

export const RegulationRequirementsTable = ({
  regulation,
}: RegulationRequirementsTableProps) => {
  const [requirementItems, setRequirementItems] = useState<RequirementItem[]>([]);
  
  useEffect(() => {
    // In a real implementation, this would parse actual structured data
    // For now, we'll generate some sample data based on the regulation
    if (regulation && regulation.regulations) {
      // Generate sample requirements based on the regulation
      const sampleRequirements: RequirementItem[] = [
        {
          id: "req-1",
          requirement: "Data Protection Measures",
          applicability: "All businesses handling personal data",
          lawReferences: "Article 5, Recitals 39-50",
          description: "Implement appropriate technical and organizational measures to ensure data security, including encryption and regular security testing.",
        },
        {
          id: "req-2",
          requirement: "Documentation Requirements",
          applicability: "All regulated entities",
          lawReferences: "Article 24, Recitals 75-77",
          description: "Maintain documentation of all processing activities and make them available to regulatory authorities upon request.",
        },
        {
          id: "req-3",
          requirement: "Risk Assessment",
          applicability: "Medium to high-risk operations",
          lawReferences: "Article 35, Recitals 84, 89-93",
          description: "Conduct regular risk assessments to identify and mitigate potential compliance risks relating to this regulation.",
        },
        {
          id: "req-4",
          requirement: "Staff Training",
          applicability: "All businesses with employees",
          lawReferences: "Article 39, Recitals 97",
          description: "Ensure all staff are properly trained on compliance requirements and understand their responsibilities.",
        },
        {
          id: "req-5",
          requirement: "Incident Response Plan",
          applicability: "All regulated entities",
          lawReferences: "Articles 33-34, Recitals 85-88",
          description: "Develop and maintain an incident response plan to address potential breaches or compliance failures.",
        }
      ];
      
      setRequirementItems(sampleRequirements);
    }
  }, [regulation]);

  if (!requirementItems.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No specific requirements found for this regulation.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[250px]">Requirement</TableHead>
            <TableHead className="w-[200px]">Applicability</TableHead>
            <TableHead className="w-[180px]">Law Recitals & Articles</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirementItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.requirement}</TableCell>
              <TableCell>{item.applicability}</TableCell>
              <TableCell>{item.lawReferences}</TableCell>
              <TableCell>{item.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
