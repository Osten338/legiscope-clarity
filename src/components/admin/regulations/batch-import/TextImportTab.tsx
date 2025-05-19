
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertTriangle } from "lucide-react";

interface TextImportTabProps {
  onImport: (items: string[]) => Promise<void>;
  isImporting: boolean;
}

export const TextImportTab = ({ onImport, isImporting }: TextImportTabProps) => {
  const [importText, setImportText] = useState("");

  const handleTextImport = async () => {
    const items = importText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    await onImport(items);
    setImportText("");
  };

  return (
    <div className="min-h-[400px]">
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
      <div className="mt-4">
        <Button 
          onClick={handleTextImport}
          disabled={isImporting || !importText.trim()}
          size="lg"
          className="w-full"
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
      </div>
    </div>
  );
};
