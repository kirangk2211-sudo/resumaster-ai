
import React, { useRef, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const ExtractionModal: React.FC<Props> = ({ isOpen, onClose, onUpload, isProcessing }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartMagicFill = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all z-10"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <div className="p-8 pb-0">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-none mb-1.5 pt-1">AI Extraction</h2>
              <p className="text-[12px] text-slate-500 font-medium">Pre-fill your resume using AI</p>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">
          <div 
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`relative group cursor-pointer border-[2.5px] border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${
              selectedFile 
                ? 'border-blue-400 bg-blue-50/10' 
                : 'border-slate-100 bg-white hover:border-blue-300'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png" 
              onChange={handleFileChange}
              disabled={isProcessing}
            />
            
            <div className={`mb-4 transition-transform duration-300 ${selectedFile ? 'text-blue-600' : 'text-slate-300 group-hover:scale-110'}`}>
              <i className={`fa-solid ${selectedFile ? 'fa-file-circle-check' : 'fa-arrow-up-from-bracket'} text-4xl`}></i>
            </div>
            
            <h3 className="text-sm font-bold text-slate-700 mb-1 text-center max-w-[200px] truncate">
              {selectedFile ? selectedFile.name : 'Upload PDF or Image'}
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest text-center">
              {isProcessing ? 'Analyzing...' : 'Secured AI processing'}
            </p>

            {isProcessing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-[3px] border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Processing</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleStartMagicFill}
              disabled={!selectedFile || isProcessing}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl ${
                selectedFile && !isProcessing
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Start Magic Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionModal;
