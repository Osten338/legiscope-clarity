
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export const CsvDownloadSample = () => {
  const handleDownloadSample = () => {
    // Creating sample CSV content with headers
    const csvContent = [
      // Headers
      ["Task", "Description", "Best Practices", "Department", "Subtasks", "Importance", "Category"],
      // Example 1
      ["Implement Data Protection Policy", "Create a comprehensive data protection policy document", "Follow ISO 27001 guidelines", "Legal", "Review policy annually, Train staff on policy, Document consent procedures", "5", "compliance"],
      // Example 2
      ["Setup Access Controls", "Configure system access controls based on least privilege principle", "Use MFA where possible", "IT", "Audit access logs regularly, Document access control policy", "4", "security"],
      // Example 3
      ["Appoint Data Protection Officer", "Designate a qualified person responsible for data protection", "Should have legal and technical knowledge", "Executive", "", "3", "governance"]
    ]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "checklist_items_sample.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-100 p-6 rounded-md border-2 border-slate-200 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</div>
        <h3 className="font-medium text-base">Download a sample CSV file</h3>
      </div>
      <p className="text-sm text-slate-600 ml-11 mb-3">
        Get a sample CSV file with the correct format for importing checklist items.
        This file includes examples of tasks, descriptions, best practices, departments,
        and subtasks.
      </p>
      <div className="ml-11">
        <Button 
          variant="outline" 
          onClick={handleDownloadSample}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download Sample CSV
        </Button>
      </div>
    </div>
  );
};
