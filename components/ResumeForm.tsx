import React, { useState } from 'react';
import { ResumeData } from '../types';
import { enhanceText } from '../services/geminiService';
import { securityService } from '../services/securityService';

// Helper components moved outside to prevent re-mounting on every keystroke
const SectionTitle = ({ title, icon, action }: { title: string, icon: string, action?: React.ReactNode }) => (
  <div className="flex justify-between items-center mb-8 mt-14 first:mt-0 border-b border-slate-100 pb-6">
    <h3 className="text-sm sm:text-base font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
        <i className={`fa-solid ${icon} text-lg`}></i>
      </div>
      {title}
    </h3>
    {action}
  </div>
);

const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{children}</label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-800 text-base font-semibold placeholder:text-slate-300"
  />
);

const AIPolishButton = ({ onPolish, id, isLoading }: { onPolish: () => void, id: string, isLoading: boolean }) => (
  <button 
    onClick={onPolish}
    disabled={isLoading}
    className="text-xs bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-md disabled:opacity-50 shrink-0"
  >
    {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>} POLISH
  </button>
);

const ListSection = ({ 
  title, icon, items, onUpdate, inputValue, setInputValue, placeholder, handleAddItem 
}: { 
  title: string, icon: string, items: string[], onUpdate: (list: string[]) => void, inputValue: string, setInputValue: React.Dispatch<React.SetStateAction<string>>, placeholder: string, handleAddItem: (val: string, setVal: React.Dispatch<React.SetStateAction<string>>, currentList: string[], updateFn: (list: string[]) => void) => void
}) => (
  <div>
    <SectionTitle title={title} icon={icon} />
    <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all">
      <Label>New {title.slice(0, -1)}</Label>
      <div className="flex gap-4 mb-8">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem(inputValue, setInputValue, items, onUpdate)}
          className="flex-1 px-6 py-4 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl outline-none focus:border-blue-500 text-base font-bold placeholder:text-slate-400"
          placeholder={placeholder}
        />
        <button 
          onClick={() => handleAddItem(inputValue, setInputValue, items, onUpdate)}
          className="px-8 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-md"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white border-2 border-slate-100 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm"
          >
            <span className="text-sm font-black text-slate-700 uppercase tracking-widest">{item}</span>
            <button 
              onClick={() => onUpdate(items.filter(s => s !== item))}
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <i className="fa-solid fa-circle-xmark text-lg"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface Props {
  data: ResumeData;
  onUpdatePersonal: (field: string, value: string) => void;
  onAddExperience: () => void;
  onUpdateExperience: (id: string, field: string, value: any) => void;
  onDeleteExperience: (id: string) => void;
  onAddEducation: () => void;
  onUpdateEducation: (id: string, field: string, value: string) => void;
  onDeleteEducation: (id: string) => void;
  onAddProject: () => void;
  onUpdateProject: (id: string, field: string, value: string) => void;
  onDeleteProject: (id: string) => void;
  onUpdateSkills: (skills: string[]) => void;
  onUpdateCertifications: (certifications: string[]) => void;
  onUpdateHobbies: (hobbies: string[]) => void;
}

const ResumeForm: React.FC<Props> = ({
  data,
  onUpdatePersonal,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onUpdateSkills,
  onUpdateCertifications,
  onUpdateHobbies
}) => {
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [newHobby, setNewHobby] = useState('');

  const handleEnhance = async (field: string, currentText: string, type: 'summary' | 'experience', callback: (newText: string) => void) => {
    if (!currentText.trim()) return;
    setIsEnhancing(field);
    const enhanced = await enhanceText(currentText, type);
    callback(securityService.sanitize(enhanced));
    setIsEnhancing(null);
  };

  const handleAddItem = (val: string, setVal: React.Dispatch<React.SetStateAction<string>>, currentList: string[], updateFn: (list: string[]) => void) => {
    if (val.trim()) {
      updateFn([...currentList, securityService.sanitize(val.trim())]);
      setVal('');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Identity */}
      <div>
        <SectionTitle title="Identity" icon="fa-user-astronaut" />
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input 
                type="text" 
                value={data.personalInfo.fullName}
                onChange={(e) => onUpdatePersonal('fullName', e.target.value)}
                placeholder="E.g. Jane Foster"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={data.personalInfo.email}
                onChange={(e) => onUpdatePersonal('email', e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label>Phone</Label>
              <Input 
                type="tel" 
                value={data.personalInfo.phone}
                onChange={(e) => onUpdatePersonal('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input 
                type="text" 
                value={data.personalInfo.location}
                onChange={(e) => onUpdatePersonal('location', e.target.value)}
                placeholder="City, State"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label>Executive Summary</Label>
              <AIPolishButton 
                isLoading={isEnhancing === 'summary'} 
                id="summary" 
                onPolish={() => handleEnhance('summary', data.personalInfo.summary, 'summary', (text) => onUpdatePersonal('summary', text))} 
              />
            </div>
            <textarea 
              rows={5}
              value={data.personalInfo.summary}
              onChange={(e) => onUpdatePersonal('summary', securityService.sanitize(e.target.value))}
              placeholder="What makes you exceptional?"
              className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:border-blue-500 focus:bg-white outline-none resize-none text-slate-800 text-base font-medium leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div>
        <SectionTitle 
          title="Career Journey" 
          icon="fa-rocket" 
          action={
            <button onClick={onAddExperience} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs tracking-widest flex items-center gap-3 active:scale-90 shadow-lg shadow-blue-100 transition-all">
              <i className="fa-solid fa-plus"></i> ADD JOB
            </button>
          } 
        />
        <div className="space-y-8">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="p-8 sm:p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 relative group transition-all hover:border-blue-100 hover:shadow-xl">
              <button onClick={() => onDeleteExperience(exp.id)} className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"><i className="fa-solid fa-trash-can text-lg"></i></button>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><Label>Company</Label><Input value={exp.company} onChange={(e) => onUpdateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" /></div>
                  <div><Label>Role</Label><Input value={exp.role} onChange={(e) => onUpdateExperience(exp.id, 'role', e.target.value)} placeholder="Title" /></div>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <input 
                    type="checkbox" 
                    id={`isCurrent-${exp.id}`}
                    checked={exp.isCurrent || false} 
                    onChange={(e) => onUpdateExperience(exp.id, 'isCurrent', e.target.checked)}
                    className="w-6 h-6 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`isCurrent-${exp.id}`} className="text-xs font-black text-slate-500 uppercase tracking-widest cursor-pointer">Currently working here</label>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label>Start Date</Label><Input value={exp.startDate} onChange={(e) => onUpdateExperience(exp.id, 'startDate', e.target.value)} placeholder="MM/YYYY" /></div>
                  {!exp.isCurrent && (
                    <div><Label>End Date</Label><Input value={exp.endDate} onChange={(e) => onUpdateExperience(exp.id, 'endDate', e.target.value)} placeholder="MM/YYYY" /></div>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Key Impact & Responsibilities</Label>
                    <AIPolishButton 
                      isLoading={isEnhancing === `exp-${exp.id}`} 
                      id={`exp-${exp.id}`} 
                      onPolish={() => handleEnhance(`exp-${exp.id}`, exp.description, 'experience', (text) => onUpdateExperience(exp.id, 'description', text))} 
                    />
                  </div>
                  <textarea rows={5} value={exp.description} onChange={(e) => onUpdateExperience(exp.id, 'description', securityService.sanitize(e.target.value))} placeholder="Use metrics to show your impact..." className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] outline-none resize-none text-base font-medium text-slate-700 leading-relaxed focus:border-blue-500 focus:bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <SectionTitle 
          title="Portfolio Items" 
          icon="fa-folder-open" 
          action={
            <button onClick={onAddProject} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs tracking-widest flex items-center gap-3 active:scale-90 transition-all">
              <i className="fa-solid fa-plus"></i> ADD PROJECT
            </button>
          } 
        />
        <div className="space-y-8">
          {data.projects.map((proj) => (
            <div key={proj.id} className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 relative group transition-all hover:border-slate-200">
              <button onClick={() => onDeleteProject(proj.id)} className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all"><i className="fa-solid fa-trash-can text-lg"></i></button>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><Label>Project Name</Label><Input value={proj.name} onChange={(e) => onUpdateProject(proj.id, 'name', e.target.value)} placeholder="Awesome Project" /></div>
                  <div><Label>URL / Link</Label><Input value={proj.link} onChange={(e) => onUpdateProject(proj.id, 'link', e.target.value)} placeholder="https://..." /></div>
                </div>
                <textarea rows={4} value={proj.description} onChange={(e) => onUpdateProject(proj.id, 'description', securityService.sanitize(e.target.value))} placeholder="What was the goal and outcome?" className="w-full px-6 py-5 bg-slate-50 rounded-[2rem] border-2 border-transparent outline-none resize-none text-base font-medium text-slate-700 leading-relaxed focus:border-blue-500 focus:bg-white" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <SectionTitle 
          title="Academic Path" 
          icon="fa-graduation-cap" 
          action={
            <button onClick={onAddEducation} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs tracking-widest flex items-center gap-3 active:scale-90 transition-all">
              <i className="fa-solid fa-plus"></i> ADD STUDY
            </button>
          } 
        />
        <div className="space-y-8">
          {data.educations.map((edu) => (
            <div key={edu.id} className="p-8 bg-white rounded-[2.5rem] border-2 border-slate-100 relative group transition-all">
              <button onClick={() => onDeleteEducation(edu.id)} className="absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition-all"><i className="fa-solid fa-trash-can text-lg"></i></button>
              <div className="space-y-6">
                <div><Label>School / University</Label><Input value={edu.school} onChange={(e) => onUpdateEducation(edu.id, 'school', e.target.value)} placeholder="Institution Name" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div><Label>Degree / Certification</Label><Input value={edu.degree} onChange={(e) => onUpdateEducation(edu.id, 'degree', e.target.value)} placeholder="B.S. Computer Science" /></div>
                  <div><Label>Graduation Date</Label><Input value={edu.endDate} onChange={(e) => onUpdateEducation(edu.id, 'endDate', e.target.value)} placeholder="MM/YYYY" /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ListSection 
        title="Technical Skills" 
        icon="fa-code" 
        items={data.skills} 
        onUpdate={onUpdateSkills} 
        inputValue={newSkill} 
        setInputValue={setNewSkill} 
        placeholder="E.g. React, Docker..." 
        handleAddItem={handleAddItem}
      />

      <ListSection 
        title="Certifications" 
        icon="fa-shield-halved" 
        items={data.certifications || []} 
        onUpdate={onUpdateCertifications} 
        inputValue={newCert} 
        setInputValue={setNewCert} 
        placeholder="E.g. AWS Solutions Architect" 
        handleAddItem={handleAddItem}
      />

      <ListSection 
        title="Hobbies & Passions" 
        icon="fa-chess" 
        items={data.hobbies || []} 
        onUpdate={onUpdateHobbies} 
        inputValue={newHobby} 
        setInputValue={setNewHobby} 
        placeholder="E.g. Marathon Running" 
        handleAddItem={handleAddItem}
      />
    </div>
  );
};

export default ResumeForm;
