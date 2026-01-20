
import React, { useState } from 'react';

interface FileUploaderProps {
  onUpload: (content: string) => void;
  isProcessing: boolean;
  label?: string;
  placeholder?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload, isProcessing, label, placeholder }) => {
  const [text, setText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      
      <div className="flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder || "Enter data here..."}
          className="w-full h-48 p-4 text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
        />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative group">
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <button className="px-4 py-2 border-2 border-dashed border-slate-300 group-hover:border-indigo-400 group-hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-500 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Or Upload CSV/TXT
            </button>
          </div>

          <button
            onClick={() => onUpload(text)}
            disabled={isProcessing || !text.trim()}
            className={`px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
              isProcessing || !text.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Analyze Data'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
