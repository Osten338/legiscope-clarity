
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CsvDownloadSample() {
  const handleDownloadSample = () => {
    // Sample CSV content with headers and a few rows
    const csvContent = 'Task,Description,Best Practices,Department,Subtasks,Importance,Category,Estimated Effort\n' +
      'Implement Data Protection Policy,Create a comprehensive data protection policy document,Follow ISO 27001 guidelines,Legal,"Review policy annually, Train staff on policy, Document consent procedures",5,Policy,2-3 days\n' +
      'Data Breach Response Plan,Develop a plan for handling potential data breaches,Include notification procedures and recovery steps,Security,"Identify response team members, Create notification templates",4,Security,1-2 days';

    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'checklist_items_sample.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadSample}
        className="w-full sm:w-auto flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Download Sample CSV
      </Button>
      <p className="text-xs text-slate-600">
        Download a sample CSV format. Both comma and semicolon delimiters are supported.
      </p>
    </div>
  );
}
