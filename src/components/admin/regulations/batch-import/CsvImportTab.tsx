
import { useState, useRef } from "react";
import * as Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";
import { CsvDownloadSample } from "./CsvDownloadSample";
import { FileUploadArea } from "./FileUploadArea";
import { FileReviewImport } from "./FileReviewImport";
import { CsvFormatInfo } from "./CsvFormatInfo";

interface CsvImportTabProps {
  onImport: (items: any[]) => Promise<void>;
  isImporting: boolean;
}

export const CsvImportTab = ({ onImport, isImporting }: CsvImportTabProps) => {
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    Papa.parse(file, {
      header: true, // Treat the first row as headers
      complete: (results) => {
        try {
          console.log("CSV parsing results:", results);
          
          // Extract structured data from CSV
          const items = results.data
            .filter((row: any) => row && (row.Task || row.Description)) // Ensure we have at least one main field
            .map((row: any) => {
              // Try to parse subtasks if they exist
              let subtasks = [];
              if (row.Subtasks) {
                try {
                  // Check if it's already a JSON array
                  if (typeof row.Subtasks === 'string' && row.Subtasks.trim()) {
                    // Try to parse JSON, otherwise split by commas or semicolons
                    if (row.Subtasks.trim().startsWith('[')) {
                      subtasks = JSON.parse(row.Subtasks);
                    } else {
                      // Split by comma or semicolon and trim each item
                      subtasks = row.Subtasks.split(/[,;]/).map((s: string) => s.trim()).filter(Boolean);
                    }
                  } else if (Array.isArray(row.Subtasks)) {
                    subtasks = row.Subtasks;
                  }
                } catch (e) {
                  console.warn("Could not parse subtasks:", e);
                }
              }
              
              return {
                task: row.Task || "",
                description: row.Description || "",
                best_practices: row["Best Practices"] || row.BestPractices || "",
                department: row.Department || "",
                subtasks: subtasks,
                // Optional fields can be included too
                importance: parseInt(row.Importance) || 3,
                category: row.Category || "general",
                estimated_effort: row.EstimatedEffort || row["Estimated Effort"] || ""
              };
            });
          
          console.log("Extracted structured items:", items);
          setParsedItems(items);
          
          toast({
            title: "CSV Parsed",
            description: `Found ${items.length} items in the CSV file.`,
          });
        } catch (error) {
          console.error("Error processing CSV data:", error);
          toast({
            title: "Error processing CSV",
            description: error instanceof Error ? error.message : "Unknown error parsing CSV",
            variant: "destructive",
          });
        }
      },
      error: (error) => {
        console.error("Papa parse error:", error);
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleCsvImport = async () => {
    console.log("Importing CSV items:", parsedItems);
    try {
      await onImport(parsedItems);
      // Reset after import
      setParsedItems([]);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("CSV import error:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4 min-h-[500px] block">
      <CsvDownloadSample />
      
      <FileUploadArea
        onFileChange={handleCsvFileChange}
        fileRef={fileInputRef}
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
