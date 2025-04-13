
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, AlertCircle, Check, FileText, HelpCircle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Papa from "papaparse";

export function EmbeddingsUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<"json" | "csv">("json");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [processingStats, setProcessingStats] = useState<{
    total: number;
    processed: number;
    success: number;
    failed: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      // Detect file format from extension
      if (selectedFile.name.endsWith('.json')) {
        setFileFormat("json");
      } else if (selectedFile.name.endsWith('.csv')) {
        setFileFormat("csv");
      } else {
        setError("Unsupported file format. Please upload a JSON or CSV file.");
        setFile(null);
      }
    }
  };

  const validateEmbeddingsFormat = async (data: any[]): Promise<boolean> => {
    try {
      // Check if it's an array
      if (!Array.isArray(data)) {
        setError("Data should contain an array of embedding objects");
        return false;
      }
      
      // Check a sample of items to verify structure
      const sampleSize = Math.min(5, data.length);
      for (let i = 0; i < sampleSize; i++) {
        const item = data[i];
        
        if (!item || typeof item !== 'object') {
          setError(`Invalid item at index ${i}: Items must be objects`);
          return false;
        }
        
        if (!item.content || typeof item.content !== 'string') {
          setError(`Missing or invalid 'content' field at index ${i}: Must be a string`);
          return false;
        }
        
        if (!Array.isArray(item.embedding)) {
          setError(`Missing or invalid 'embedding' field at index ${i}: Must be an array of numbers`);
          return false;
        }
        
        // Check a few embedding values
        const embSample = item.embedding.slice(0, 3);
        for (let j = 0; j < embSample.length; j++) {
          if (typeof embSample[j] !== 'number') {
            setError(`Invalid embedding value at item ${i}: All embedding values must be numbers`);
            return false;
          }
        }
      }
      
      return true;
    } catch (e) {
      setError("Invalid data format. Please check your file.");
      return false;
    }
  };

  const parseCSV = async (fileContents: string): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(fileContents, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          try {
            const embeddings = results.data
              .filter(row => row && Object.keys(row).length > 0) // Filter out empty rows
              .map((row: any) => {
                // Find the content column (might be named 'content', 'text', etc.)
                let content = row.content || row.text || row.Content || row.Text || '';
                
                // Find embedding column or parse from multiple columns
                let embedding: number[] = [];
                
                // Case 1: If there's a column called 'embedding' that contains a stringified array
                if (row.embedding && typeof row.embedding === 'string') {
                  try {
                    embedding = JSON.parse(row.embedding);
                  } catch (e) {
                    // Not a valid JSON string
                  }
                } 
                // Case 2: Look for columns that might contain vector values (dimension_0, v_0, etc)
                else {
                  const embeddingColumns = Object.keys(row)
                    .filter(key => 
                      /^(embedding_|dimension_|dim_|v_|vector_|e_|emb_)\d+$/.test(key) || 
                      /^\d+$/.test(key)
                    )
                    .sort((a, b) => {
                      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
                      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
                      return numA - numB;
                    });
                  
                  if (embeddingColumns.length > 0) {
                    embedding = embeddingColumns.map(col => parseFloat(row[col]));
                  }
                }
                
                // Get metadata by excluding content and embedding keys
                const metadata = { ...row };
                delete metadata.content;
                delete metadata.text;
                delete metadata.Content;
                delete metadata.Text;
                delete metadata.embedding;
                
                // Remove embedding dimension columns from metadata
                Object.keys(metadata).forEach(key => {
                  if (/^(embedding_|dimension_|dim_|v_|vector_|e_|emb_)\d+$/.test(key) || /^\d+$/.test(key)) {
                    delete metadata[key];
                  }
                });
                
                return {
                  content,
                  embedding,
                  metadata
                };
              })
              .filter(item => item.content && item.embedding && item.embedding.length > 0);
              
            resolve(embeddings);
          } catch (error) {
            reject(new Error("CSV parsing error: " + error.message));
          }
        },
        error: (error) => {
          reject(new Error("CSV parsing error: " + error));
        }
      });
    });
  };

  const processEmbeddings = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProcessingStats(null);

    try {
      const fileContents = await file.text();
      let embeddings: any[] = [];
      
      // Parse the file based on its format
      if (fileFormat === "json") {
        try {
          embeddings = JSON.parse(fileContents);
        } catch (e) {
          setError("Invalid JSON format. Please check your file.");
          setIsUploading(false);
          return;
        }
      } else if (fileFormat === "csv") {
        try {
          embeddings = await parseCSV(fileContents);
        } catch (e: any) {
          setError(e.message || "Error parsing CSV file");
          setIsUploading(false);
          return;
        }
      }
      
      // Validate the embeddings format
      const isValid = await validateEmbeddingsFormat(embeddings);
      if (!isValid) {
        setIsUploading(false);
        return;
      }
      
      const total = embeddings.length;
      
      if (total === 0) {
        setError("No valid embeddings found in the file");
        setIsUploading(false);
        return;
      }
      
      setProcessingStats({
        total,
        processed: 0,
        success: 0,
        failed: 0
      });

      // Process embeddings in batches of 10
      const batchSize = 10;
      let success = 0;
      let failed = 0;

      for (let i = 0; i < total; i += batchSize) {
        const batch = embeddings.slice(i, Math.min(i + batchSize, total));
        
        try {
          const { data, error } = await supabase.functions.invoke("upload-embeddings", {
            body: { embeddings: batch }
          });
          
          if (error) throw error;
          
          if (data?.success) {
            success += data.uploaded;
            failed += data.failed;
          }
        } catch (error: any) {
          console.error("Error uploading batch:", error);
          failed += batch.length;
        }

        setProcessingStats(prev => ({
          total,
          processed: Math.min((prev?.processed || 0) + batch.length, total),
          success,
          failed
        }));
      }

      toast({
        title: "Upload Complete",
        description: `Successfully processed ${success} embeddings. Failed: ${failed}.`,
        variant: success > 0 ? "default" : "destructive",
      });

    } catch (error: any) {
      console.error("Error processing embeddings:", error);
      setError(error.message || "An error occurred while processing the embeddings");
      toast({
        title: "Upload Failed",
        description: error.message || "An error occurred while processing the embeddings",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const exampleJson = `[
  {
    "content": "This is the text content to be retrieved later",
    "embedding": [0.123, 0.456, 0.789, ...],
    "metadata": { 
      "source": "optional metadata",
      "category": "your custom fields"
    }
  },
  {
    "content": "Another piece of text content",
    "embedding": [0.321, 0.654, 0.987, ...],
    "metadata": { 
      "source": "optional metadata" 
    }
  }
]`;

  const exampleCsv = `content,embedding_0,embedding_1,embedding_2,source,category
"This is the text content",0.123,0.456,0.789,"document1","important"
"Another piece of content",0.321,0.654,0.987,"document2","normal"`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept=".json,.csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96">
            <Tabs defaultValue="json">
              <TabsList className="mb-2">
                <TabsTrigger value="json">JSON Format</TabsTrigger>
                <TabsTrigger value="csv">CSV Format</TabsTrigger>
              </TabsList>
              <TabsContent value="json">
                <div className="space-y-2">
                  <h4 className="font-medium">Expected JSON Format</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your JSON file should contain an array of objects with the following structure:
                  </p>
                  <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {exampleJson}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    Each object must have a <code>content</code> field (text) and an <code>embedding</code> field (array of numbers).
                    The <code>metadata</code> field is optional.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="csv">
                <div className="space-y-2">
                  <h4 className="font-medium">Expected CSV Format</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Your CSV file should have columns for content and embedding values:
                  </p>
                  <pre className="bg-slate-100 p-2 rounded text-xs overflow-auto max-h-40">
                    {exampleCsv}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-2">
                    Include a <code>content</code> column and embedding dimensions as separate columns 
                    (like <code>embedding_0</code>, <code>0</code>, <code>dim_0</code>, etc.).
                    Any additional columns will be treated as metadata.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        <Button 
          onClick={processEmbeddings}
          disabled={!file || isUploading}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <>Processing...</>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800">Embedding Format</AlertTitle>
        <AlertDescription className="text-blue-700">
          Upload a JSON or CSV file containing embeddings data. For JSON, include <code className="bg-blue-100 px-1 rounded">content</code> and <code className="bg-blue-100 px-1 rounded">embedding</code> fields. 
          For CSV, include a <code className="bg-blue-100 px-1 rounded">content</code> column and embedding dimensions as separate columns.
        </AlertDescription>
      </Alert>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {file && !isUploading && !error && (
        <Alert variant="default" className="bg-slate-50">
          <FileText className="h-4 w-4" />
          <AlertTitle>Selected File</AlertTitle>
          <AlertDescription>{file.name} ({(file.size / 1024).toFixed(2)} KB)</AlertDescription>
        </Alert>
      )}
      
      {processingStats && (
        <div className="space-y-2">
          <Progress value={(processingStats.processed / processingStats.total) * 100} />
          <div className="text-sm text-slate-600">
            Processed: {processingStats.processed}/{processingStats.total} 
            {processingStats.success > 0 && <span className="text-green-600"> • Success: {processingStats.success}</span>}
            {processingStats.failed > 0 && <span className="text-red-600"> • Failed: {processingStats.failed}</span>}
          </div>
        </div>
      )}
      
      {processingStats && processingStats.processed === processingStats.total && processingStats.success > 0 && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Upload Complete</AlertTitle>
          <AlertDescription className="text-green-700">
            Successfully uploaded {processingStats.success} embeddings to the database.
            {processingStats.failed > 0 && ` (${processingStats.failed} failed)`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
