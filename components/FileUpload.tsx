import React, { useRef, useState, useEffect } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  label: string;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label, 
  files, 
  onFilesChange,
  accept = "image/*,application/pdf"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    return new Promise<UploadedFile>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve({
          file,
          previewUrl: URL.createObjectURL(file),
          type: file.type === 'application/pdf' ? 'pdf' : 'image',
          base64: base64String,
          mimeType: file.type
        });
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilesPromises = Array.from(e.target.files).map(processFile);
      const newFiles = await Promise.all(newFilesPromises);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFilesPromises = Array.from(e.dataTransfer.files).map(processFile);
      const newFiles = await Promise.all(newFilesPromises);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].previewUrl);
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  // Handle global paste for this component if it's focused or generally available
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // Only capture paste if this component's container contains focus or is the active element context
      if (document.activeElement && containerRef.current?.contains(document.activeElement)) {
        if (e.clipboardData?.files.length) {
            e.preventDefault();
            const newFilesPromises = Array.from(e.clipboardData.files).map(processFile);
            const newFiles = await Promise.all(newFilesPromises);
            onFilesChange([...files, ...newFiles]);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [files, onFilesChange]);

  return (
    <div 
      ref={containerRef}
      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      tabIndex={0} // Make focusable for paste
    >
      <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div className="p-3 bg-gray-100 rounded-full">
          <Upload className="w-6 h-6 text-gray-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-xs text-gray-500 mt-1">
            클릭하여 업로드, 드래그 & 드롭<br/>
            또는 <span className="text-indigo-600 font-bold">영역 클릭 후 Ctrl+V</span> (붙여넣기)
          </p>
        </div>
        <input 
          ref={inputRef}
          type="file" 
          multiple 
          accept={accept}
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="aspect-square w-full flex items-center justify-center bg-gray-50">
                {file.type === 'image' ? (
                  <img src={file.previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-12 h-12 text-red-500" />
                )}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <div className="p-2 text-xs truncate text-gray-600">
                {file.file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};