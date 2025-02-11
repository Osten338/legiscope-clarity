
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentsHeaderProps {
  onUpload: () => void;
}

export const DocumentsHeader = ({ onUpload }: DocumentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Compliance Documents</h1>
        <p className="text-slate-500 mt-1">
          Upload and manage your compliance-related documents
        </p>
      </div>
      <Button onClick={onUpload} className="gap-2">
        <Plus className="h-4 w-4" />
        Upload Document
      </Button>
    </div>
  );
};
