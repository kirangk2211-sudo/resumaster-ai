import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, ResumeTemplate, SubscriptionInfo, AppTab } from './types';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ExtractionModal from './components/ExtractionModal';
import AccountMenu from './components/AccountMenu';
import AccountModal from './components/AccountModal';
import ConsentBar from './components/ConsentBar';
import AuthPage from './components/AuthPage';
import AiAssistant from './components/AiAssistant';
import JobTailor from './components/JobTailor';
import SyncStatus from './components/SyncStatus';
import { parseResumeWithAI } from './services/geminiService';
import { dataService } from './services/dataService';
import { paymentService } from './services/paymentService';

declare const html2pdf: any;

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    summary: '',
  },
  experiences: [
    {
      id: '1',
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrent: true,
      description: ''
    }
  ],
  projects: [],
  educations: [
    {
      id: 'e1',
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      grade: ''
    }
  ],
  skills: [],
  certifications: [],
  hobbies: [],
};

const ACCENT_COLORS = [
  '#2563eb', '#1e293b', '#065f46', '#991b1b', '#78350f', '#581c87', '#115e59', '#334155',
];

const App: React.FC = () => {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [user, setUser] = useState<{ email: string, name: string, token: string } | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_DATA);
  const [template, setTemplate] = useState<ResumeTemplate>('modern');
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [activeTab, setActiveTab] = useState<AppTab>('edit');
  const [isParsing, setIsParsing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved'>('saved');
  
  const [isExtractionModalOpen, setIsExtractionModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [accountView, setAccountView] = useState<'create' | 'details'>('create');
  
  const [subscription, setSubscription] = useState<SubscriptionInfo>({ 
    status: 'free', 
    planName: 'Basic',
    price: 0,
    expiryDate: 'N/A',
    billingHistory: []
  });

  const [previewScale, setPreviewScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  useEffect(() => {
    const init = async () => {
      const sessionUser = dataService.getCurrentUser();
      if (sessionUser && sessionUser.token) {
        setUser(sessionUser);
        
        // Initial data load from local storage
        const localData = dataService.loadResumeData(sessionUser.email);
        if (localData) setResumeData(localData);
      }
      setDownloadCount(dataService.getDownloadCount());
      setIsAppLoaded(true);
    };
    init();
  }, []);

  // Auto-save logic (Local)
  useEffect(() => {
    if (user) {
      setSyncStatus('syncing');
      const timer = setTimeout(async () => {
        dataService.saveResumeData(user.email, resumeData);
        setSyncStatus('saved');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [resumeData, user]);

  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 'preview' && previewRef.current) {
        const padding = 32;
        const containerWidth = window.innerWidth > 640 ? 448 : window.innerWidth - padding;
        const scale = Math.min(containerWidth / 794, 1);
        setPreviewScale(scale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, template]);

  if (!isAppLoaded) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[1000]">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <i className="fa-solid fa-wand-magic-sparkles text-6xl text-blue-600"></i>
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">resume master ai</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => {
      setUser(userData);
      const saved = dataService.loadResumeData(userData.email);
      if (saved) setResumeData(saved);
    }} />;
  }

  const handleSubscribe = () => {
    if (!user) return;
    
    paymentService.initializePayment({
      amount: 75,
      email: user.email,
      userName: user.name,
      onSuccess: (response) => {
        const newTxn = {
          id: response.razorpay_payment_id || `TXN-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: 75,
          status: 'Successful' as const
        };
        
        setSubscription({
          status: 'active',
          planName: 'Pro Monthly',
          price: 75,
          expiryDate: 'Lifetime Access',
          billingHistory: [newTxn, ...(subscription.billingHistory || [])]
        });
        
        setIsAccountModalOpen(false);
        alert("Payment Successful! Your Pro features are now unlocked.");
      }
    });
  };

  const handleDownload = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (subscription.status !== 'active') {
      setIsAccountModalOpen(true);
      return;
    }
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const element = exportRef.current;
      if (!element) return;

      const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false,
          scrollY: 0,
          windowWidth: 794,
          allowTaint: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const images = Array.from(element.getElementsByTagName('img')) as HTMLImageElement[];
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { 
          img.onload = resolve; 
          img.onerror = resolve; 
        });
      }));

      await html2pdf().set(opt).from(element).save();
      dataService.incrementDownloadCount();
      setDownloadCount(prev => prev + 1);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden mobile-frame relative">
      <div className="fixed inset-0 z-[-1000] bg-white pointer-events-none overflow-auto select-none opacity-100">
        <div 
          ref={exportRef} 
          className="bg-white" 
          style={{ width: '794px', minHeight: '1123px' }}
        >
          <ResumePreview data={resumeData} template={template} accentColor={accentColor} />
        </div>
      </div>

      {isGeneratingPdf && (
        <div className="fixed inset-0 z-[1000] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">
           <div className="w-24 h-24 mb-8 relative">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-[2rem]"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-[2rem] border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                 <i className="fa-solid fa-file-pdf text-3xl"></i>
              </div>
           </div>
           <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Exporting Ultra HD</h3>
           <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2 text-center px-6">Generating pixel-perfect A4 document...</p>
        </div>
      )}

      <header className="w-full h-16 sm:h-20 flex items-center justify-center px-4 bg-white shadow-sm z-50 shrink-0 no-print">
        <div className="w-full max-w-4xl flex justify-between items-center relative">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-xl text-blue-600"></i>
              <h1 className="text-base font-black tracking-tighter uppercase text-slate-900">ResuMaster</h1>
            </div>
            <div className="mt-1">
              <SyncStatus status={syncStatus} />
            </div>
          </div>
          <button onClick={() => setIsAccountMenuOpen(true)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
             <i className="fa-solid fa-user-circle text-2xl"></i>
          </button>
        </div>
      </header>

      <main ref={scrollContainerRef} className="flex-1 overflow-y-auto w-full px-0 flex flex-col items-center no-scrollbar relative z-10">
        <div className="w-full px-4 py-6 pb-40">
          {activeTab === 'edit' && (
             <div className="w-full bg-white rounded-[2.5rem] p-6 shadow-xl border border-white no-print animate-in fade-in slide-in-from-bottom-2 duration-300">
               <button onClick={() => setIsExtractionModalOpen(true)} className="w-full py-5 mb-8 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                 <i className="fa-solid fa-wand-magic-sparkles"></i> AI Fill from PDF
               </button>
               <ResumeForm 
                  data={resumeData} 
                  onUpdatePersonal={(f, v) => setResumeData(p => ({...p, personalInfo: {...p.personalInfo, [f]: v}}))}
                  onAddExperience={() => setResumeData(p => ({...p, experiences: [...p.experiences, {id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '', isCurrent: false}]}))}
                  onUpdateExperience={(id, f, v) => setResumeData(p => ({...p, experiences: p.experiences.map(e => e.id === id ? {...e, [f]: v} : e)}))}
                  onDeleteExperience={(id) => setResumeData(p => ({...p, experiences: p.experiences.filter(e => e.id !== id)}))}
                  onAddEducation={() => setResumeData(p => ({...p, educations: [...p.educations, {id: Date.now().toString(), school: '', degree: '', startDate: '', endDate: '', grade: ''}]}))}
                  onUpdateEducation={(id, f, v) => setResumeData(p => ({...p, educations: p.educations.map(e => e.id === id ? {...e, [f]: v} : e)}))}
                  onDeleteEducation={(id) => setResumeData(p => ({...p, educations: p.educations.filter(edu => edu.id !== id)}))}
                  onAddProject={() => setResumeData(p => ({...p, projects: [...p.projects, {id: Date.now().toString(), name: '', link: '', description: ''}]}))}
                  onUpdateProject={(id, f, v) => setResumeData(p => ({...p, projects: p.projects.map(e => e.id === id ? {...e, [f]: v} : e)}))}
                  onDeleteProject={(id) => setResumeData(p => ({...p, projects: p.projects.filter(e => e.id !== id)}))}
                  onUpdateSkills={(s) => setResumeData(p => ({...p, skills: s}))}
                  onUpdateCertifications={(c) => setResumeData(p => ({...p, certifications: c}))}
                  onUpdateHobbies={(h) => setResumeData(p => ({...p, hobbies: h}))}
                />
             </div>
          )}

          {activeTab === 'preview' && (
            <div className="w-full flex flex-col items-center gap-6 no-print animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-full bg-white rounded-[2.5rem] p-6 border border-white flex flex-col gap-5 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-palette text-xs text-blue-600"></i>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accent Color</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((color) => (
                      <button key={color} onClick={() => setAccentColor(color)} className={`w-9 h-9 rounded-full transition-all flex items-center justify-center ${accentColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-md' : 'hover:scale-105 opacity-90'}`} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-table-columns text-xs text-blue-600"></i>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Template Style</h3>
                  </div>
                  <div className="bg-slate-50 p-1 rounded-2xl flex w-full">
                    {(['modern', 'ats', 'minimal'] as const).map((t) => (
                      <button key={t} onClick={() => setTemplate(t)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${template === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`} style={template === t ? { color: accentColor } : {}}>
                        {t === 'ats' ? 'CLASSIC' : t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center pb-10">
                 <div ref={previewRef} className="origin-top shadow-2xl bg-white preview-container" style={{ transform: `scale(${previewScale})`, width: '794px', marginBottom: `${(1 - previewScale) * -1123}px` }}>
                  <ResumePreview data={resumeData} template={template} accentColor={accentColor} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tailor' && (
            <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
              <JobTailor resumeData={resumeData} />
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-all z-[100] hover:bg-blue-600"
      >
        <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[420px] z-[200] no-print">
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] h-[72px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] flex items-center justify-between px-3 py-2 border border-white/60">
          <div className="flex items-center flex-1 h-full gap-1">
            <button onClick={() => setActiveTab('edit')} className={`flex-1 h-12 rounded-[1.5rem] transition-all flex flex-col items-center justify-center ${activeTab === 'edit' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
              <i className="fa-solid fa-pencil text-xs mb-0.5"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">EDIT</span>
            </button>
            <button onClick={() => setActiveTab('preview')} className={`flex-1 h-12 rounded-[1.5rem] transition-all flex flex-col items-center justify-center ${activeTab === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}>
              <i className="fa-solid fa-eye text-xs mb-0.5"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">VIEW</span>
            </button>
            <button onClick={() => setActiveTab('tailor')} className={`flex-1 h-12 rounded-[1.5rem] transition-all flex flex-col items-center justify-center ${activeTab === 'tailor' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}>
              <i className="fa-solid fa-bullseye text-xs mb-0.5"></i>
              <span className="text-[9px] font-black uppercase tracking-widest">MATCH</span>
            </button>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 shrink-0 mx-2"></div>
          <button onMouseDown={handleDownload} disabled={isGeneratingPdf} className={`flex items-center justify-center w-[56px] h-[56px] text-white rounded-full shadow-xl active:scale-90 transition-all shrink-0 bg-blue-600 hover:bg-blue-700 ${isGeneratingPdf ? 'opacity-50' : ''}`}>
            {isGeneratingPdf ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-download text-lg"></i>}
          </button>
        </div>
      </nav>

      <AiAssistant resumeData={resumeData} onUpdate={setResumeData} isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} />
      <AccountMenu isOpen={isAccountMenuOpen} onClose={() => setIsAccountMenuOpen(false)} onNavigate={(v) => {setAccountView(v); setIsAccountModalOpen(true); setIsAccountMenuOpen(false);}} onLogout={() => {dataService.clearSession(); setUser(null); setIsAccountMenuOpen(false);}} isSubscribed={subscription.status === 'active'} userName={user?.name} downloadCount={downloadCount} />
      <ExtractionModal isOpen={isExtractionModalOpen} onClose={() => setIsExtractionModalOpen(false)} onUpload={async (f) => {setIsParsing(true); const reader = new FileReader(); reader.onload = async (e) => { const base64 = (e.target?.result as string).split(',')[1]; const parsed = await parseResumeWithAI(base64, f.type); if(parsed) {setResumeData(parsed); setTemplate('modern'); setActiveTab('preview'); setIsExtractionModalOpen(false);} setIsParsing(false);}; reader.readAsDataURL(f);}} isProcessing={isParsing} />
      <AccountModal 
        isOpen={isAccountModalOpen} 
        view={accountView} 
        onClose={() => setIsAccountModalOpen(false)} 
        subscription={subscription} 
        onSubscribe={handleSubscribe} 
        userName={user?.name || ''} 
      />
      <ConsentBar onAccept={() => {}} />
    </div>
  );
};

export default App;
