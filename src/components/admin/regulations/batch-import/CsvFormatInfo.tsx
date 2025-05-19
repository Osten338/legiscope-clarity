
import { FileText } from "lucide-react";

export const CsvFormatInfo = () => {
  return (
    <div className="mt-6 p-4 border border-slate-200 rounded-md bg-slate-50">
      <h4 className="font-medium mb-2 text-sm flex items-center gap-1.5">
        <FileText className="h-4 w-4 text-slate-600" />
        CSV Format Instructions
      </h4>
      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
        <li>The first column should contain the checklist item descriptions</li>
        <li>Each row will create a separate checklist item</li>
        <li>Headers will be treated as items (exclude headers row if needed)</li>
        <li>Empty rows will be skipped</li>
      </ul>
    </div>
  );
};
