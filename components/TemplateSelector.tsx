
import React from 'react';
import { ResumeTemplate } from '../types';

interface Props {
  selected: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
  horizontal?: boolean;
}

const TemplateSelector: React.FC<Props> = ({ selected, onSelect, horizontal = false }) => {
  const templates: { id: ResumeTemplate, name: string, icon: string, description: string }[] = [
    { id: 'modern', name: 'Modern', icon: 'fa-layer-group', description: 'Dark header, clean full-width layout.' },
    { id: 'ats', name: 'Classic (ATS)', icon: 'fa-file-lines', description: 'ATS-friendly serif typography.' },
    { id: 'minimal', name: 'Minimal', icon: 'fa-minus', description: 'Lightweight sidebar approach.' },
  ];

  if (horizontal) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-print">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              selected === t.id 
                ? 'bg-[#1e293b] text-white border-[#1e293b] shadow-lg' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <i className={`fa-solid ${t.icon}`}></i>
            {t.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Choose Template</h3>
      <div className="space-y-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all group ${
              selected === t.id 
                ? 'bg-slate-50 border-slate-200 ring-2 ring-slate-500/10 shadow-sm' 
                : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              selected === t.id ? 'bg-[#1e293b] text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
            }`}>
              <i className={`fa-solid ${t.icon} text-lg`}></i>
            </div>
            <div>
              <p className={`font-black text-[11px] uppercase tracking-widest ${selected === t.id ? 'text-[#1e293b]' : 'text-slate-700'}`}>{t.name}</p>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5 font-medium">{t.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
