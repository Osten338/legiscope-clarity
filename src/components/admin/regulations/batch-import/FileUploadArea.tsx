
import { UploadCloud } from "lucide-react";

interface FileUploadAreaProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef?: React.RefObject<HTMLInputElement>;
}

export const FileUploadArea = ({ onFileChange, fileRef }: FileUploadAreaProps) => {
  return (
    <div className="bg-slate-100 p-6 rounded-md border-2 border-slate-200 shadow-sm">
      <div className="flex items-center mb-3">
        <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</div>
        <h3 className="font-medium text-base">Upload your CSV file</h3>
      </div>
      <p className="text-sm text-slate-600 ml-11 mb-3">CSV files should have one checklist item per row</p>
      
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-md p-8 ml-11 flex flex-col items-center justify-center">
        <div className="bg-slate-100 p-3 rounded-full mb-3">
          <UploadCloud className="h-6 w-6 text-slate-600" />
        </div>
        <p className="font-medium mb-2">Click to upload or drag and drop</p>
        <p className="text-xs text-slate-500 mb-4">CSV, TXT up to 10MB</p>
        <input 
          type="file" 
          className="hidden"
          accept=".csv,.txt"
          onChange={onFileChange}
          ref={fileRef}
        />
        <button
          type="button"
          onClick={() => fileRef?.current?.click()}
          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Select File
        </button>
      </div>
    </div>
  );
};
