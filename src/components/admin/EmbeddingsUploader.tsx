
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, AlertCircle, Check, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
      let embeddings;
      
      try {
        embeddings = JSON.parse(fileContents);
      } catch (e) {
        throw new Error("Invalid JSON format. Please check your file.");
      }

      // Check if it's an array 
      if (!Array.isArray(embeddings)) {
        throw new Error("JSON file should contain an array of embedding objects");
      }

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
        <Alert variant="success" className="bg-green-50 border-green-200">
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
