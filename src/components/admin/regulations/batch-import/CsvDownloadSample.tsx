
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ActionButton } from "@/components/ui/action-button";

export const CsvDownloadSample = () => {
  const { toast } = useToast();

  const downloadSampleCsv = () => {
    // Create sample CSV content
    const sampleData = "Item description\nMaintain records of processing activities\nConduct data protection impact assessments\nImplement appropriate security measures\nHave data processing agreements with processors";
    
    // Create a Blob with the CSV data
    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_checklist_items.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Sample CSV Downloaded",
      description: "You can use this as a template for your import",
    });
  };

  return (
    <div className="bg-slate-100 p-6 rounded-md mb-6 border-2 border-slate-200 shadow-sm">
      <div className="flex items-center mb-2">
        <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</div>
        <h3 className="font-medium text-base">Start with a template (optional)</h3>
      </div>
      <p className="text-sm text-slate-600 ml-11 mb-3">Download our sample CSV file to get started quickly</p>
      <div className="ml-11">
        <ActionButton 
          icon={<Download className="h-4 w-4" />}
          label="Download Sample CSV"
          onClick={downloadSampleCsv}
          tooltip="Get a pre-formatted CSV template to use"
        />
      </div>
    </div>
  );
};
