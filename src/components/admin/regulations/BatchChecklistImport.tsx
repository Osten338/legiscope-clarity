
import { useState, useRef, useCallback, useEffect } from "react";
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
import { ActionButton } from "@/components/ui/action-button";

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
  const [renderKey, setRenderKey] = useState(Date.now()); // Force re-render when needed

  // Debug - log when component renders and active tab changes
  useEffect(() => {
    console.log("BatchChecklistImport rendered with activeTab:", activeTab);
  }, [activeTab]);

  // Force reset if needed
  useEffect(() => {
    // Reset component state when first mounted to ensure clean state
    setActiveTab("csv");
    setRenderKey(Date.now());
    console.log("Component initialized with CSV tab active");
  }, []);

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
    
    toast({
      title: "Sample CSV Downloaded",
      description: "You can use this as a template for your import",
    });
  };

  // Handle external tab value change (from parent component)
  const handleTabChange = (value: string) => {
    console.log("Tab changing to:", value);
    setActiveTab(value as "text" | "csv");
  };

  return (
    <Card className="relative" key={renderKey}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-4 w-4" /> Batch Import Checklist Items
        </CardTitle>
        <CardDescription>
          Import multiple checklist items at once using text input or a CSV file.
        </CardDescription>
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange} 
          className="mt-4"
          defaultValue="csv" 
        >
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="csv" className="relative">
              CSV Upload
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 animate-pulse">
                Recommended
              </span>
            </TabsTrigger>
          </TabsList>
      
          <TabsContent value="text" className="mt-4 min-h-[400px]">
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
            <div className="mt-4">
              <Button 
                onClick={handleTextImport}
                disabled={isImporting || !importText.trim()}
                size="lg"
                className="w-full"
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
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="mt-4 min-h-[500px] block">
            <div className="space-y-4">
              {/* Step 1: Download sample with better visibility */}
              <div className="bg-blue-50 p-6 rounded-md mb-6 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</div>
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
              
              {/* Step 2: Upload area with enhanced visibility */}
              <div className="bg-blue-50 p-6 rounded-md border-2 border-blue-200 shadow-sm mb-6">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</div>
                  <h3 className="font-medium text-base">Upload your CSV file</h3>
                </div>
                <p className="text-sm text-slate-600 ml-11 mb-3">Click the upload area or drag and drop your CSV file</p>
              
                <div 
                  className={`
                    relative border-4 ml-11
                    ${isDragging 
                      ? 'border-blue-500 bg-blue-100' 
                      : 'border-dashed border-blue-400 hover:border-blue-500 hover:bg-blue-50'} 
                    rounded-lg p-8 cursor-pointer transition-all duration-300 
                    ${!fileName ? 'animate-pulse' : ''} min-h-[200px]
                  `}
                  onClick={triggerFileInput}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{zIndex: 10}}
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
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-1 group-hover:bg-blue-200 transition-colors">
                      <Upload className="h-10 w-10 text-blue-600" />
                      <ArrowDown className="h-6 w-6 text-blue-600 absolute animate-bounce mt-10" />
                    </div>
                    <div className="text-lg font-medium text-center">
                      <span className="text-blue-600 underline font-bold">Click to upload</span> or drag and drop
                    </div>
                    <div className="text-sm text-slate-600 text-center max-w-sm">
                      Upload a CSV file with checklist items in the first column
                    </div>
                    
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="mt-3 bg-blue-600 hover:bg-blue-700 animate-pulse hover:animate-none transition-all hover:scale-105"
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
              </div>
              
              {/* Step 3: Uploaded file info & import button */}
              <div className="bg-blue-50 p-6 rounded-md border-2 border-blue-200 shadow-sm">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">3</div>
                  <h3 className="font-medium text-base">Import your data</h3>
                </div>
                <p className="text-sm text-slate-600 ml-11 mb-3">Review and import your checklist items</p>
                
                {fileName ? (
                  <div className="bg-white p-4 rounded-md border flex items-center justify-between mb-3 ml-11">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded">
                        <FileText className="h-6 w-6 text-blue-600" />
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
                  <div className="text-sm text-slate-500 italic mb-3 ml-11">
                    No file selected yet. Upload a CSV file in step 2.
                  </div>
                )}
                
                <div className="ml-11">
                  <Button 
                    onClick={handleCsvImport}
                    disabled={isImporting || parsedItems.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700"
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
        </Tabs>
      </CardHeader>
      
      <CardContent>
        {/* Adding explicit notice when CSV tab is active but not showing properly */}
        {activeTab === "csv" && (
          <div className="text-center mt-2 p-2 text-sm text-blue-600 bg-blue-50 rounded-md">
            ↑ CSV upload area should be visible above ↑
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-end">
        {activeTab === "text" ? (
          <Button 
            onClick={handleTextImport}
            disabled={isImporting || !importText.trim()}
            size="lg"
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
      
      {/* Debug info - to help troubleshoot rendering issues */}
      <div className="text-xs text-slate-400 mt-2 p-1">
        Debug: activeTab={activeTab}, renderKey={renderKey}
      </div>
    </Card>
  );
};
