
import { Button } from "@/components/ui/button";
import { FileText, Check } from "lucide-react";

interface FileReviewImportProps {
  fileName: string | null;
  parsedItems: string[];
  onImport: () => Promise<void>;
  isImporting: boolean;
  onChangeFile: () => void;
}

export const FileReviewImport = ({ 
  fileName, 
  parsedItems, 
  onImport, 
  isImporting,
  onChangeFile 
}: FileReviewImportProps) => {
  return (
    <div className="bg-slate-100 p-6 rounded-md border-2 border-slate-200 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</div>
        <h3 className="font-medium text-base">Import your data</h3>
      </div>
      <p className="text-sm text-slate-600 ml-11 mb-3">Review and import your checklist items</p>
      
      {fileName ? (
        <div className="bg-white p-4 rounded-md border flex items-center justify-between mb-3 ml-11">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-2 rounded">
              <FileText className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <div className="text-sm font-medium">{fileName}</div>
              <div className="text-xs text-slate-600">{parsedItems.length} items ready to import</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onChangeFile}
          >
            Change
          </Button>
        </div>
      ) : (
        <div className="text-sm text-slate-500 italic mb-3 ml-11">
          No file selected yet. Upload a CSV file in step 2.
        </div>
      )}
      
      <div className="ml-11">
        <Button 
          onClick={onImport}
          disabled={isImporting || parsedItems.length === 0}
          className="w-full bg-slate-700 hover:bg-slate-800"
          size="lg"
        >
          {isImporting ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
              Importing...
            </>
          ) : (
            <>
              <Check className="mr-2 h-5 w-5" />
              Import {parsedItems.length > 0 ? `${parsedItems.length} Items` : "CSV Data"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
