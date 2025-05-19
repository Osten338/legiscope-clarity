
import { useState, useRef } from "react";
import * as Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { CsvDownloadSample } from "./CsvDownloadSample";
import { FileUploadArea } from "./FileUploadArea";
import { FileReviewImport } from "./FileReviewImport";
import { CsvFormatInfo } from "./CsvFormatInfo";

interface CsvImportTabProps {
  onImport: (items: string[]) => Promise<void>;
  isImporting: boolean;
}

export const CsvImportTab = ({ onImport, isImporting }: CsvImportTabProps) => {
  const [parsedItems, setParsedItems] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    Papa.parse(file, {
      complete: (results) => {
        // Extract descriptions from CSV data
        const items = results.data
          .filter((row: any) => Array.isArray(row) && row.length > 0)
          .map((row: any) => row[0]?.toString().trim())
          .filter((item: string) => item && item.length > 0);
        
        setParsedItems(items);
        
        toast({
          title: "CSV Parsed",
          description: `Found ${items.length} items in the CSV file.`,
        });
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleCsvImport = async () => {
    await onImport(parsedItems);
    // Reset after import
    setParsedItems([]);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 min-h-[500px] block">
      <CsvDownloadSample />
      
      <FileUploadArea
        onFileChange={handleCsvFileChange}
      />
      
      <FileReviewImport
        fileName={fileName}
        parsedItems={parsedItems}
        onImport={handleCsvImport}
        isImporting={isImporting}
        onChangeFile={triggerFileInput}
      />
      
      <CsvFormatInfo />
    </div>
  );
};
