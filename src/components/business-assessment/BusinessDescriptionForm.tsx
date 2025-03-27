
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";

interface BusinessDescriptionFormProps {
  isAnalyzing: boolean;
  description: string;
  setDescription: (description: string) => void;
  handleSubmit: () => void;
}

export const BusinessDescriptionForm = ({
  isAnalyzing,
  description,
  setDescription,
  handleSubmit
}: BusinessDescriptionFormProps) => {
  const { toast } = useToast();

  const handleFileUpload = () => {
    document.getElementById("document")?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="guidance" className="text-xl font-serif text-neutral-900">
          What information should you include?
        </Label>
        <ul className="mt-4 list-disc list-inside text-neutral-600 space-y-2.5">
          <li>Your business model and primary activities</li>
          <li>How you interact with customers or clients</li>
          <li>Industry sector and any relevant subsectors</li>
          <li>Geographic areas of operation</li>
          <li>Types of data you collect and process</li>
          <li>Products or services you offer</li>
          <li>Number of employees (approximate)</li>
          <li>Annual revenue range (if applicable)</li>
          <li>Regulatory frameworks you believe apply to your business</li>
          <li>Any specific compliance concerns you have</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description" className="text-xl font-serif text-neutral-900">
            Business Description
          </Label>
          <Textarea
            id="description"
            placeholder="Describe your business here in as much detail as possible..."
            className="mt-3 h-48 bg-white/70 border-white/40 focus:border-white/60 transition-all duration-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isAnalyzing}
          />
        </div>

        <div>
          <Label htmlFor="document" className="text-xl font-serif text-neutral-900">
            Or Upload a Document
          </Label>
          <div className="mt-3">
            <Input id="document" type="file" accept=".pdf,.doc,.docx" className="hidden" />
            <Button
              variant="outline"
              className="w-full border-white/40 border-dashed border-2 h-24 flex flex-col items-center justify-center gap-2 bg-white/30 hover:bg-white/50 transition-all duration-300"
              onClick={handleFileUpload}
              disabled={isAnalyzing}
            >
              <Upload className="h-6 w-6 text-neutral-800" />
              <span className="text-neutral-800">Upload business documentation</span>
              <span className="text-sm text-neutral-600">PDF, DOC, or DOCX up to 10MB</span>
            </Button>
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-6 rounded-full text-lg transition-all duration-300"
        onClick={handleSubmit}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </div>
        ) : (
          "Start Comprehensive Compliance Analysis"
        )}
      </Button>
    </div>
  );
};
