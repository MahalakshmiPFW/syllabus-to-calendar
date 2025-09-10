import { useCallback } from "react";
import { Upload } from "lucide-react";
import type { SyllabusItem } from "../types/syllabus";

interface FileUploadProps {
  onParse: (items: SyllabusItem[]) => void;
  isDragActive: boolean;
  setIsDragActive: (active: boolean) => void;
  mockItems: SyllabusItem[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onParse, isDragActive, setIsDragActive, mockItems }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, [setIsDragActive]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, [setIsDragActive]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    if (pdfFile) onParse(mockItems);
  }, [mockItems, onParse, setIsDragActive]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onParse(mockItems);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive 
          ? "border-blue-400 bg-blue-50" 
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Drop your syllabus PDF here or click to browse
      </h3>
      <p className="text-gray-600 mb-4">
        We'll parse assignments, readings, and exams
      </p>
      <label className="inline-block">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />
        <span className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
          Upload Syllabus
        </span>
      </label>
    </div>
  );
};

export default FileUpload;
