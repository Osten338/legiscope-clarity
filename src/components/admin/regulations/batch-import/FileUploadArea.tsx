
import { useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, ArrowDown, FileUp } from "lucide-react";

interface FileUploadAreaProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUploadArea = ({ onFileChange }: FileUploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  }, []);

  return (
    <div className="bg-slate-100 p-6 rounded-md border-2 border-slate-200 shadow-sm mb-6">
      <div className="flex items-center mb-3">
        <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</div>
        <h3 className="font-medium text-base">Upload your CSV file</h3>
      </div>
      <p className="text-sm text-slate-600 ml-11 mb-3">Click the upload area or drag and drop your CSV file</p>
    
      <div 
        className={`
          relative border-4 ml-11
          ${isDragging 
            ? 'border-slate-500 bg-slate-200' 
            : 'border-dashed border-slate-300 hover:border-slate-500 hover:bg-slate-50'} 
          rounded-lg p-8 cursor-pointer transition-all duration-300 
          min-h-[200px]
        `}
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{zIndex: 10}}
      >
        <Input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={onFileChange}
          id="csv-upload"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-1 group-hover:bg-slate-300 transition-colors">
            <Upload className="h-10 w-10 text-slate-600" />
            <ArrowDown className="h-6 w-6 text-slate-600 absolute mt-10" />
          </div>
          <div className="text-lg font-medium text-center">
            <span className="text-slate-700 underline font-bold">Click to upload</span> or drag and drop
          </div>
          <div className="text-sm text-slate-600 text-center max-w-sm">
            Upload a CSV file with checklist items in the first column
          </div>
          
          <Button 
            variant="default" 
            size="lg" 
            className="mt-3 bg-slate-700 hover:bg-slate-800 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <FileUp className="mr-2 h-5 w-5" />
            Select CSV File
          </Button>
        </div>
      </div>
    </div>
  );
};
