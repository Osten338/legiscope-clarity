
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CsvFormatInfo() {
  return (
    <Alert variant="default" className="bg-blue-50 border-blue-100 mt-4">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-700">CSV Format Information</AlertTitle>
      <AlertDescription className="text-blue-600 text-sm">
        <p className="mb-2">Your CSV file should include these columns:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Task</strong> or <strong>Description</strong> (at least one required)</li>
          <li><strong>Best Practices</strong> (optional)</li>
          <li><strong>Department</strong> (optional)</li>
          <li><strong>Subtasks</strong> (optional - comma or semicolon separated list)</li>
          <li><strong>Importance</strong> (optional - 1-5, where 5 is highest)</li>
          <li><strong>Category</strong> (optional)</li>
          <li><strong>Estimated Effort</strong> (optional)</li>
        </ul>
        <p className="mt-2 text-sm">
          <strong>Note:</strong> The system supports both comma and semicolon delimited CSV files.
          Column headers are case-sensitive and must match exactly as shown above.
        </p>
      </AlertDescription>
    </Alert>
  );
}
