
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, AlertTriangle, Upload, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import * as Papa from 'papaparse';

interface BatchChecklistImportProps {
  regulationId: string;
  onImportComplete: () => void;
}

export const BatchChecklistImport = ({ regulationId, onImportComplete }: BatchChecklistImportProps) => {
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "csv">("text");
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
          <TabsList>
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="csv">CSV Upload</TabsTrigger>
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
            <div 
              className={`border-2 ${isDragging ? 'border-primary' : 'border-dashed border-gray-300'} 
                         rounded-lg p-6 cursor-pointer transition-colors duration-200 hover:border-primary hover:bg-primary/5`}
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
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-sm font-medium">
                  <span className="text-primary underline">Click to upload</span> or drag and drop
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  CSV file with checklist items (one item per row)
                </div>
                <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}>
                  <FileUp className="mr-1 h-4 w-4" />
                  Select File
                </Button>
              </div>
            </div>
            
            {fileName && (
              <div className="bg-muted p-3 rounded flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{fileName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {parsedItems.length} items found
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground italic">
              The CSV file should have checklist items in the first column. Headers will be treated as items.
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
        ) : (
          <Button 
            onClick={handleCsvImport}
            disabled={isImporting || parsedItems.length === 0}
          >
            {isImporting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                Importing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Import {parsedItems.length} Items
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
