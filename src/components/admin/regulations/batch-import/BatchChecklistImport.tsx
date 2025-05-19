
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { importChecklist } from "./importService";
import { TextImportTab } from "./TextImportTab";
import { CsvImportTab } from "./CsvImportTab";
import { BatchImportProps } from "./types";

export const BatchChecklistImport = ({ regulationId, onImportComplete }: BatchImportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "csv">("csv");
  const { toast } = useToast();

  // Debug - log when component renders
  useEffect(() => {
    console.log("BatchChecklistImport rendered with activeTab:", activeTab);
  }, [activeTab]);

  const handleImport = async (items: string[]) => {
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please enter checklist items to import",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting import with items:", items);
    setIsImporting(true);
    
    try {
      const count = await importChecklist(regulationId, items);
      console.log("Import successful, count:", count);
      
      toast({
        title: "Import Successful",
        description: `Imported ${count} checklist items`,
      });

      onImportComplete();
    } catch (error) {
      console.error("Import failed:", error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle tab value change
  const handleTabChange = (value: string) => {
    console.log("Tab changing to:", value);
    setActiveTab(value as "text" | "csv");
  };

  return (
    <Card className="relative">
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
        <div className="text-xs text-slate-400 mt-2 p-1">
          {isImporting ? 
            <div className="text-center text-sm text-slate-600">
              <div className="animate-spin inline-block h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full mr-2"></div>
              Importing items...
            </div>
            : null
          }
        </div>
      </CardContent>
      
      <CardFooter className="justify-end">
        {/* Footer content if needed */}
      </CardFooter>
    </Card>
  );
};
