
import React, { useState } from 'react';
import { ResumeData, TailorResult } from '../types';
import { tailorResume } from '../services/geminiService';

interface Props {
  resumeData: ResumeData;
}

const JobTailor: React.FC<Props> = ({ resumeData }) => {
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<TailorResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!jd.trim()) return;
    setIsAnalyzing(true);
    const res = await tailorResume(resumeData, jd);
    setResult(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <i className="fa-solid fa-bullseye text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Job Match Co-pilot</h2>
            <p className="text-sm text-slate-500">Tailor your resume for specific opportunities</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Paste Job Description</label>
          <textarea 
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium resize-none leading-relaxed"
          />
          <button 
            onClick={handleAnalyze}
            disabled={!jd.trim() || isAnalyzing}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isAnalyzing ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Get Match Score</>}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle 
                  cx="64" cy="64" r="58" fill="none" stroke="#10b981" strokeWidth="8" 
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - result.matchScore / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-3xl font-black text-emerald-600">{result.matchScore}%</span>
            </div>
            <h3 className="font-bold text-slate-900">Match Accuracy</h3>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg uppercase tracking-wide border border-red-100">{kw}</span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expert Suggestions</h4>
            <div className="space-y-3">
              {result.suggestions.map((s, i) => (
                <div key={i} className="flex gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <i className="fa-solid fa-lightbulb text-emerald-500 mt-1"></i>
                  <p className="text-sm text-emerald-900 font-medium leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTailor;
