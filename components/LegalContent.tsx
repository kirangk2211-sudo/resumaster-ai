
import React from 'react';

interface Props {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

const LegalContent: React.FC<Props> = ({ type, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-4 p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h2 className="text-lg font-bold text-slate-900">
          {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 text-slate-600 text-sm leading-relaxed space-y-6">
        {type === 'privacy' ? (
          <>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">1. Data Collection</h3>
              <p>Easy Resume AI collects the professional information you provide (name, work history, education) solely for the purpose of generating your resume. We do not sell your personal data to third parties.</p>
            </section>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">2. AI Processing</h3>
              <p>We use advanced AI models to process and enhance your resume content. Data sent to the AI is used according to enterprise privacy standards and is not used to train global models.</p>
            </section>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">3. Storage</h3>
              <p>Your data is stored locally on your device and temporarily on our secure servers while generating PDFs. You can request data deletion at any time by contacting support.</p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">1. Subscription</h3>
              <p>By subscribing to the Pro plan (₹75/month), you gain unlimited access to PDF downloads and premium templates. Subscriptions are billed monthly.</p>
            </section>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">2. Usage Rules</h3>
              <p>Users are prohibited from using the service to generate fraudulent documents or misleading professional information.</p>
            </section>
            <section>
              <h3 className="text-slate-900 font-bold mb-2 uppercase text-xs tracking-widest">3. Refund Policy</h3>
              <p>Due to the digital nature of our services, we generally do not offer refunds. However, if you experience technical issues, please contact our support team.</p>
            </section>
          </>
        )}
        <p className="text-[10px] text-slate-400 pt-10">Last Updated: 2026</p>
      </div>
    </div>
  );
};

export default LegalContent;
