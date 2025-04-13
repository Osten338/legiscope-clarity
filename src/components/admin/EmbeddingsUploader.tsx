
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

export function EmbeddingsUploader() {
  const [file, setFile] = useState<File | null>(null);
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
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const validateEmbeddingsFormat = async (fileContents: string): Promise<boolean> => {
    try {
      const data = JSON.parse(fileContents);
      
      // Check if it's an array
      if (!Array.isArray(data)) {
        setError("JSON file should contain an array of embedding objects");
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
      setError("Invalid JSON format. Please check your file.");
      return false;
    }
  };

  const processEmbeddings = async () => {
    if (!file) {
      setError("Please select a JSON file to upload");
      return;
    }

    if (!file.name.endsWith('.json')) {
      setError("Only JSON files are supported");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProcessingStats(null);

    try {
      const fileContents = await file.text();
      
      // Validate the JSON structure
      const isValid = await validateEmbeddingsFormat(fileContents);
      if (!isValid) {
        setIsUploading(false);
        return;
      }
      
      const embeddings = JSON.parse(fileContents);
      const total = embeddings.length;
      
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept=".json"
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
          Upload a JSON file containing an array of objects with <code className="bg-blue-100 px-1 rounded">content</code> and <code className="bg-blue-100 px-1 rounded">embedding</code> fields. 
          Each embedding should be a vector of floating-point numbers.
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
