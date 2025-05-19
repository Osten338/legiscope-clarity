
import { Separator } from "@/components/ui/separator";

export const CsvFormatInfo = () => {
  return (
    <div className="bg-slate-50 p-6 rounded-md border border-slate-200 space-y-4">
      <h3 className="font-medium text-base">CSV Format Information</h3>
      <p className="text-sm text-slate-600">
        Your CSV file should include the following columns:
      </p>
      
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="font-medium">Column</div>
          <div className="font-medium">Required</div>
          <div className="font-medium col-span-2">Description</div>
          
          <div>Task</div>
          <div>Yes</div>
          <div className="col-span-2">Main task name</div>
          
          <div>Description</div>
          <div>Yes</div>
          <div className="col-span-2">Detailed description of the task</div>
          
          <div>Best Practices</div>
          <div>No</div>
          <div className="col-span-2">Recommended best practices for implementation</div>
          
          <div>Department</div>
          <div>No</div>
          <div className="col-span-2">Department responsible for this task</div>
          
          <div>Subtasks</div>
          <div>No</div>
          <div className="col-span-2">Comma-separated list of subtasks</div>
          
          <div>Importance</div>
          <div>No</div>
          <div className="col-span-2">Number from 1-5 (default: 3)</div>
          
          <div>Category</div>
          <div>No</div>
          <div className="col-span-2">Category for classification (default: "general")</div>
          
          <div>Is Subtask</div>
          <div>No</div>
          <div className="col-span-2">Boolean value: true or false (default: false)</div>
          
          <div>Parent ID</div>
          <div>No</div>
          <div className="col-span-2">ID of parent task (only for subtasks)</div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h4 className="font-medium text-sm mb-2">Example Content:</h4>
        <pre className="bg-slate-100 p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap">
          Task,Description,Best Practices,Department,Subtasks,Importance,Category,Is Subtask,Parent ID
          "Implement Data Policy","Create data protection document","Follow ISO 27001","Legal","Review annually,Train staff",5,compliance,false,
          "Setup MFA","Enable multi-factor auth","Use authenticator apps","IT","Document procedure",4,security,false,
          "Document Procedure","Create MFA setup documentation","Include screenshots","IT",,3,documentation,true,abc-123-456
        </pre>
      </div>
    </div>
  );
};
