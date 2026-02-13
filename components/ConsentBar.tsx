
import React, { useState, useEffect } from 'react';

interface Props {
  onAccept: () => void;
}

const ConsentBar: React.FC<Props> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('user-consent-data');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('user-consent-data', 'true');
    setIsVisible(false);
    onAccept();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-[90] animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-[2rem] shadow-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <i className="fa-solid fa-shield-halved text-blue-400 text-xs"></i>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Privacy Guarantee</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            We use your data solely to generate resumes. Your professional information is 
            <span className="text-white font-bold"> never sold to third parties</span>. 
            By continuing, you agree to our processing terms.
          </p>
        </div>
        <button 
          onClick={handleAccept}
          className="whitespace-now80 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 shadow-lg shadow-blue-900/20"
        >
          Accept & Start
        </button>
      </div>
    </div>
  );
};

export default ConsentBar;
