
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsHeaderProps {
  onUpload: () => void;
}

export const DocumentsHeader = ({ onUpload }: DocumentsHeaderProps) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-slate-900">Compliance Documents</h1>
          <p className="text-slate-600 mt-1 font-serif">
            Upload and manage your compliance-related documents
          </p>
        </div>
        <Button onClick={onUpload} className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};
