
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, AlertTriangle, Upload, FileUp, ArrowDown, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import * as Papa from 'papaparse';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BatchChecklistImportProps {
  regulationId: string;
  onImportComplete: () => void;
}

export const BatchChecklistImport = ({ regulationId, onImportComplete }: BatchChecklistImportProps) => {
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "csv">("csv"); // Default to CSV now
  const [parsedItems, setParsedItems] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleTextImport = async () => {
    if (!importText.trim()) {
      toast({
        title: "Error",
        description: "Please enter checklist items to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Split by new lines and filter out empty lines
      const items = importText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      await importItems(items);
    } finally {
      setIsImporting(false);
    }
  };

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
    if (parsedItems.length === 0) {
      toast({
        title: "Error",
        description: "No items found in the CSV file or no file selected",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      await importItems(parsedItems);
      // Reset after import
      setParsedItems([]);
      setFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsImporting(false);
    }
  };

  const importItems = async (items: string[]) => {
    // Check if we have any items to import
    if (items.length === 0) {
      toast({
        title: "No items found",
        description: "Please enter valid checklist items",
        variant: "destructive",
      });
      return;
    }

    // Prepare the items for batch insert
    const checklistItems = items.map(description => ({
      regulation_id: regulationId,
      description,
      // Default values
      importance: 3, // Medium importance by default
      category: "general"
    }));

    // Insert the items
    const { error } = await supabase
      .from("checklist_items")
      .insert(checklistItems);

    if (error) throw error;

    toast({
      title: "Import Successful",
      description: `Imported ${items.length} checklist items`,
    });

    // Clear the form and notify parent
    setImportText("");
    onImportComplete();
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
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
    
    // Release the object URL
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sample CSV Downloaded",
      description: "You can use this as a template for your import",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4" /> Batch Import Checklist Items
        </CardTitle>
        <CardDescription>
          Import multiple checklist items at once using text input or a CSV file.
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "text" | "csv")} className="mt-4">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="csv" className="relative">
              CSV Upload
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 animate-pulse">
                Recommended
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="text">
          <Textarea
            placeholder="Enter checklist items, one per line
Example:
Appoint a Data Protection Officer
Maintain records of processing activities
Conduct regular data protection impact assessments"
            className="min-h-[200px] font-mono text-sm"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <AlertTriangle size={12} />
              <span>
                Each line will be imported as a separate checklist item
              </span>
            </div>
            <div>
              {importText.split("\n").filter(line => line.trim().length > 0).length} items
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="csv">
          <div className="space-y-4">
            {/* Step 1: Download sample */}
            <div className="bg-slate-50 p-4 rounded-md mb-6 border border-slate-200">
              <div className="flex items-center mb-2">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">1</div>
                <h3 className="font-medium text-sm">Start with a template (optional)</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 text-xs mt-1"
                onClick={downloadSampleCsv}
              >
                <Download className="h-3.5 w-3.5" />
                Download sample CSV
              </Button>
            </div>
            
            {/* Step 2: Upload area with enhanced visibility */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6">
              <div className="flex items-center mb-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">2</div>
                <h3 className="font-medium text-sm">Upload your CSV file</h3>
              </div>
            
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`
                        relative border-3 
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-dashed border-primary/40 hover:border-primary hover:bg-primary/5'} 
                        rounded-lg p-8 cursor-pointer transition-all duration-300 group
                        ${!fileName ? 'animate-pulse' : ''}
                      `}
                      onClick={triggerFileInput}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Input
                        type="file"
                        ref={fileInputRef}
                        accept=".csv"
                        className="hidden"
                        onChange={handleCsvFileChange}
                        id="csv-upload"
                      />
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-1 group-hover:bg-primary/20 transition-colors">
                          <Upload className="h-8 w-8 text-primary" />
                          <ArrowDown className="h-5 w-5 text-primary absolute animate-bounce mt-8" />
                        </div>
                        <div className="text-base font-medium text-center">
                          <span className="text-primary underline font-bold">Click to upload</span> or drag and drop
                        </div>
                        <div className="text-sm text-slate-600 text-center max-w-sm">
                          Upload a CSV file with checklist items in the first column
                        </div>
                        
                        <Button 
                          variant="default" 
                          size="lg" 
                          className="mt-3 group-hover:scale-105 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerFileInput();
                          }}
                        >
                          <FileUp className="mr-2 h-5 w-5" />
                          Select CSV File
                        </Button>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-80">
                    <p>Click anywhere in this area or use the button to select a CSV file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {/* Step 3: Uploaded file info & import button */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="flex items-center mb-3">
                <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">3</div>
                <h3 className="font-medium text-sm">Import your data</h3>
              </div>
              
              {fileName ? (
                <div className="bg-white p-4 rounded-md border flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{fileName}</div>
                      <div className="text-xs text-slate-600">{parsedItems.length} items ready to import</div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={triggerFileInput}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="text-sm text-slate-500 italic mb-3">
                  No file selected yet. Upload a CSV file in step 2.
                </div>
              )}
              
              <Button 
                onClick={handleCsvImport}
                disabled={isImporting || parsedItems.length === 0}
                className="w-full"
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
            
            {/* Format info */}
            <div className="mt-6 p-4 border border-slate-200 rounded-md bg-slate-50">
              <h4 className="font-medium mb-2 text-sm flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-600" />
                CSV Format Instructions
              </h4>
              <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>The first column should contain the checklist item descriptions</li>
                <li>Each row will create a separate checklist item</li>
                <li>Headers will be treated as items (exclude headers row if needed)</li>
                <li>Empty rows will be skipped</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="justify-end">
        {activeTab === "text" ? (
          <Button 
            onClick={handleTextImport}
            disabled={isImporting || !importText.trim()}
          >
            {isImporting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Importing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Import Items
              </>
            )}
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};
