import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DocumentExtractor } from "@/utils/documentExtractor";
import { FileText, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UploadDocumentDialog = ({
  open,
  onOpenChange,
}: UploadDocumentDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [extractionPreview, setExtractionPreview] = useState<string>("");
  const [extractionError, setExtractionError] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      file: null as any,
      documentType: "",
      regulationId: "",
      description: "",
    },
  });

  const { data: regulations } = useQuery({
    queryKey: ['regulations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regulations')
        .select('id, name');
      if (error) throw error;
      return data;
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setExtractionPreview("");
      setExtractionError("");
      return;
    }

    try {
      const extracted = await DocumentExtractor.extractText(file);
      
      if (extracted.success) {
        if (DocumentExtractor.validateExtractedContent(extracted.text)) {
          setExtractionPreview(extracted.text.substring(0, 500) + (extracted.text.length > 500 ? "..." : ""));
          setExtractionError("");
          form.setValue("description", extracted.text);
        } else {
          setExtractionError("The extracted content appears to be corrupted. Please ensure the file is not password-protected or corrupted.");
          setExtractionPreview("");
        }
      } else {
        setExtractionError(extracted.error || "Failed to extract text from file");
        setExtractionPreview("");
      }
    } catch (error) {
      setExtractionError(`Error processing file: ${error.message}`);
      setExtractionPreview("");
    }
  };

  const onSubmit = async (values: any) => {
    if (!values.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (extractionError) {
      toast({
        title: "Error",
        description: "Please resolve the file extraction error before uploading",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const fileExt = values.file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('compliance_documents')
        .upload(filePath, values.file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('compliance_documents')
        .insert({
          file_name: values.file.name,
          file_path: filePath,
          document_type: values.documentType,
          regulation_id: values.regulationId || null,
          description: values.description || extractionPreview,
          user_id: user.id
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['compliance-documents'] });
      onOpenChange(false);
      form.reset();
      setExtractionPreview("");
      setExtractionError("");

      toast({
        title: "Success",
        description: "Document uploaded and text extracted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                        handleFileChange(file);
                      }}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {extractionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{extractionError}</AlertDescription>
              </Alert>
            )}

            {extractionPreview && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">Text Preview (first 500 characters):</div>
                  <div className="text-sm bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                    {extractionPreview}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regulationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Regulation (Optional)</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select regulation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regulations?.map((reg) => (
                        <SelectItem key={reg.id} value={reg.id}>
                          {reg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Extracted Text Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Text content will appear here after file selection"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !!extractionError}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
