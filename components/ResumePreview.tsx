import React from 'react';
import { ResumeData, ResumeTemplate } from '../types';

interface Props {
  data: ResumeData;
  template: ResumeTemplate;
  accentColor?: string;
}

const ResumePreview: React.FC<Props> = ({ data, template, accentColor = '#1e293b' }) => {
  const { personalInfo, experiences, educations, skills, projects, hobbies, certifications } = data;

  // common-styles for PDF capture: 794px = A4 width at 96 DPI
  const containerClass = "resume-document font-sans text-slate-800 bg-white w-[794px] min-h-[1123px] shadow-none flex flex-col overflow-hidden antialiased";

  // --- MODERN TEMPLATE ---
  if (template === 'modern') {
    return (
      <div className={containerClass}>
        {/* Dark Header */}
        <header 
          className="px-12 pt-16 pb-12 text-white"
          style={{ backgroundColor: accentColor }}
        >
          <h1 className="text-5xl font-black tracking-tight mb-8 uppercase leading-none">
            {personalInfo.fullName || 'JOHN DOE'}
          </h1>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-bold uppercase tracking-widest opacity-90">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">EMAIL:</span> {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">TEL:</span> {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">LOC:</span> {personalInfo.location}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <span className="opacity-60">WEB:</span> {personalInfo.website}
              </div>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="px-12 flex-1 pb-20 pt-6">
          {/* Executive Summary */}
          <section className="mb-6">
            <div className="mt-8 mb-4 border-b border-slate-200 pb-2">
              <h2 className="text-[13px] font-black tracking-[0.2em] uppercase text-slate-800">Executive Summary</h2>
            </div>
            <p className="text-[14.5px] leading-[1.6] text-slate-700 font-medium">
              {personalInfo.summary || 'Strategic technology leader with over a decade of experience in software architecture and team management. Expert in scaling web operations and driving digital transformation for global enterprises.'}
            </p>
          </section>

          {/* Professional Experience */}
          <section className="mb-6">
            <div className="mt-8 mb-4 border-b border-slate-200 pb-2">
              <h2 className="text-[13px] font-black tracking-[0.2em] uppercase text-slate-800">Professional Experience</h2>
            </div>
            <div className="space-y-8">
              {experiences.length > 0 ? experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[15px] font-black text-slate-900 leading-tight">{exp.role || 'Senior Software Engineer'}</h3>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {exp.startDate || 'JAN 2021'} — {exp.isCurrent ? 'PRESENT' : (exp.endDate || 'DEC 2023')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline mb-3">
                    <p className="text-[13.5px] font-bold text-slate-800">{exp.company || 'Innovation Labs'}</p>
                    <p className="text-[10px] font-bold italic text-slate-400 uppercase tracking-tighter">
                      {personalInfo.location || 'NEW YORK, NY'}
                    </p>
                  </div>
                  <ul className="text-[13.5px] text-slate-600 space-y-2.5 leading-relaxed font-medium">
                    {(exp.description || '• Optimized system architecture resulting in 50% faster deployment cycles.\n• Built and mentored a diverse team of 10+ software engineers across 3 timezones.').split('\n').filter(l => l.trim()).map((line, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="shrink-0 text-slate-300 mt-1.5 text-[8px]">•</span>
                        <span>{line.replace(/^•\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )) : null}
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <div className="mt-8 mb-4 border-b border-slate-200 pb-2">
              <h2 className="text-[13px] font-black tracking-[0.2em] uppercase text-slate-800">Education</h2>
            </div>
            <div className="space-y-6">
              {educations.length > 0 ? educations.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-[14px] font-black text-slate-900 leading-tight">{edu.school || 'Institute of Advanced Science'}</h4>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      {edu.endDate || 'MAY 2018'}
                    </span>
                  </div>
                  <p className="text-[12px] italic text-slate-500 font-bold">{edu.degree || 'Master of Computer Science'}</p>
                </div>
              )) : null}
            </div>
          </section>

          {/* Expertise */}
          <section className="break-inside-avoid">
            <div className="mt-8 mb-4 border-b border-slate-200 pb-2">
              <h2 className="text-[13px] font-black tracking-[0.2em] uppercase text-slate-800">Expertise</h2>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {(skills.length > 0 ? skills : ['REACT', 'TYPESCRIPT', 'SYSTEM DESIGN', 'AWS', 'KUBERNETES', 'PYTHON', 'DOCKER', 'REDIS']).map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded text-[10px] font-black uppercase tracking-widest"
                  style={{ color: accentColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- CLASSIC (ATS) TEMPLATE ---
  if (template === 'ats') {
    return (
      <div className="resume-document font-serif text-black bg-white w-[794px] min-h-[1123px] px-14 py-14 shadow-none antialiased">
        <header className="text-center mb-8 border-b-2 border-black pb-6">
          <h1 className="text-4xl font-bold uppercase mb-3 tracking-tight">{personalInfo.fullName || 'JOHN DOE'}</h1>
          <div className="text-[12px] flex justify-center gap-4 flex-wrap font-medium">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-[14px] font-bold uppercase border-b border-black mb-4 pb-1">Professional Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex justify-between font-bold text-[13.5px]">
                  <span>{exp.role || 'Professional Role'}</span>
                  <span>{exp.startDate || '2021'} – {exp.isCurrent ? 'Present' : (exp.endDate || '2023')}</span>
                </div>
                <div className="font-bold text-[13px] mb-2 italic text-slate-800">{exp.company || 'Organization Name'}</div>
                <div className="text-[13px] leading-relaxed pl-3 space-y-1.5">
                  {(exp.description || '• Achieved key objectives and managed cross-team initiatives.').split('\n').filter(l => l.trim()).map((line, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="shrink-0">•</span>
                      <span>{line.replace(/^•\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 break-inside-avoid">
          <h2 className="text-[14px] font-bold uppercase border-b border-black mb-3 pb-1">Education</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="flex justify-between text-[13px] mb-2">
              <div className="font-bold">{edu.school || 'Academic Institution'} | <span className="font-normal italic">{edu.degree || 'Credential'}</span></div>
              <span className="italic">{edu.endDate || '2018'}</span>
            </div>
          ))}
        </section>

        {skills && skills.length > 0 && (
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-[14px] font-bold uppercase border-b border-black mb-3 pb-1">Technical Skills</h2>
            <p className="text-[13px] leading-relaxed">{skills.join(' • ')}</p>
          </section>
        )}
      </div>
    );
  }

  // --- MINIMAL TEMPLATE ---
  return (
    <div className="resume-document font-sans text-slate-900 bg-white w-[794px] min-h-[1123px] px-14 py-14 shadow-none antialiased">
      <header 
        className="mb-12 border-l-[8px] pl-8 py-2"
        style={{ borderColor: accentColor }}
      >
        <h1 className="text-5xl font-black mb-3 tracking-tighter uppercase">{personalInfo.fullName || 'JOHN DOE'}</h1>
        <div className="text-[13px] text-slate-500 font-bold tracking-wide">
          <p>{personalInfo.location} • {personalInfo.phone} • {personalInfo.email}</p>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-[12px] font-black uppercase tracking-[0.25em] mb-6 text-slate-400">Professional Narrative</h2>
        <div className="space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-[16px] font-black text-slate-900">{exp.role || 'Role Title'} @ {exp.company || 'Enterprise'}</h3>
                <span className="text-[11px] text-slate-400 font-bold">{exp.startDate || 'Start'} – {exp.isCurrent ? 'Present' : (exp.endDate || 'End')}</span>
              </div>
              <p className="text-[14px] leading-relaxed text-slate-600 font-medium whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-12">
        <section className="break-inside-avoid">
          <h2 className="text-[12px] font-black uppercase tracking-[0.25em] mb-6 text-slate-400">Academic Background</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-4">
              <p className="text-[15px] font-black text-slate-900">{edu.school || 'University Name'}</p>
              <p className="text-[12.5px] text-slate-500 italic font-bold">{edu.degree || 'Degree Program'}</p>
            </div>
          ))}
        </section>

        <section className="break-inside-avoid">
          <h2 className="text-[12px] font-black uppercase tracking-[0.25em] mb-6 text-slate-400">Specialized Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="text-[13.5px] font-black tracking-tight"
                style={{ color: accentColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResumePreview;