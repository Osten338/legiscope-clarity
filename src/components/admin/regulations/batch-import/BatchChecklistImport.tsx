
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { importChecklist } from "./importService";
import { TextImportTab } from "./TextImportTab";
import { CsvImportTab } from "./CsvImportTab";
import { BatchImportProps } from "./types";

export const BatchChecklistImport = ({ regulationId, onImportComplete }: BatchImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "csv">("csv"); // Default to CSV
  const [renderKey, setRenderKey] = useState(Date.now()); // Force re-render when needed
  const { toast } = useToast();

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

  const handleImport = async (items: string[]) => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please enter checklist items to import",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const count = await importChecklist(regulationId, items);
      
      toast({
        title: "Import Successful",
        description: `Imported ${count} checklist items`,
      });

      onImportComplete();
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
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
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                Recommended
              </span>
            </TabsTrigger>
          </TabsList>
      
          <TabsContent value="text" className="mt-4">
            <TextImportTab 
              onImport={handleImport}
              isImporting={isImporting}
            />
          </TabsContent>
          
          <TabsContent value="csv" className="mt-4">
            <CsvImportTab
              onImport={handleImport}
              isImporting={isImporting}
            />
          </TabsContent>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        {activeTab === "csv" && (
          <div className="text-center mt-2 p-2 text-sm text-slate-600 bg-slate-50 rounded-md">
            ↑ CSV upload area should be visible above ↑
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-end">
        {/* Footer content if needed */}
      </CardFooter>
      
      {/* Debug info - to help troubleshoot rendering issues */}
      <div className="text-xs text-slate-400 mt-2 p-1">
        Debug: activeTab={activeTab}, renderKey={renderKey}
      </div>
    </Card>
  );
};
