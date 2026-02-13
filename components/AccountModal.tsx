import React, { useState } from 'react';
import { SubscriptionInfo } from '../types';
import LegalContent from './LegalContent';

interface Props {
  isOpen: boolean;
  view: 'create' | 'details';
  onClose: () => void;
  subscription: SubscriptionInfo;
  onSubscribe: () => void;
  userName?: string;
}

const AccountModal: React.FC<Props> = ({ isOpen, view, onClose, subscription, onSubscribe, userName }) => {
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'billing' | 'mobile'>('plan');

  if (!isOpen) return null;

  if (activeLegal) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="w-full max-w-md h-[80vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <LegalContent type={activeLegal} onBack={() => setActiveLegal(null)} />
        </div>
      </div>
    );
  }

  const isSubscribed = subscription.status === 'active';

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 text-center">
           <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600">
             <i className="fa-solid fa-circle-xmark text-xl"></i>
           </button>

           <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isSubscribed ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
              <i className={`fa-solid ${isSubscribed ? 'fa-crown' : 'fa-rocket'} text-3xl`}></i>
           </div>
           
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">
             {isSubscribed ? 'Pro Membership' : 'Upgrade to Pro'}
           </h2>
           
           <div className="flex bg-slate-100 p-1 rounded-2xl my-6 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('plan')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'plan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Plan</button>
              <button onClick={() => setActiveTab('billing')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'billing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Billing</button>
              <button onClick={() => setActiveTab('mobile')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Mobile</button>
           </div>

           <div className="space-y-4 text-left">
              {activeTab === 'plan' && (
                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                   <p className="text-xs font-bold text-slate-600">Plan details and subscription status go here.</p>
                </div>
              )}

              {activeTab === 'mobile' && (
                <div className="space-y-4">
                  {/* ZERO ERROR SETUP */}
                  <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30">
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-check-double text-emerald-600"></i>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Zero-Error Key Setup</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium mb-4">Run this in Google Cloud Shell to create a key with a known password (123456):</p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[9px] font-mono break-all mb-4 select-all">
                      keytool -genkey -v -keystore resumaster.keystore -alias resu -keyalg RSA -keysize 2048 -validity 10000 -storepass 123456 -keypass 123456 -dname "CN=ResuMaster"
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium mb-2">Then, update your GitHub Secrets to exactly these:</p>
                    <ul className="text-[9px] text-slate-700 font-bold space-y-1">
                      <li>• <span className="text-blue-600">ALIAS:</span> resu</li>
                      <li>• <span className="text-blue-600">KEYSTORE_PASSWORD:</span> 123456</li>
                      <li>• <span className="text-blue-600">KEY_PASSWORD:</span> 123456</li>
                    </ul>
                  </div>

                  <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/30">
                    <div className="flex items-center gap-2 mb-3">
                        <i className="fa-solid fa-code text-blue-600"></i>
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Get Base64 String</span>
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium mb-3">Run this next to get your <code className="bg-white px-1">SIGNING_KEY</code>:</p>
                    <div className="bg-slate-900 text-blue-300 p-4 rounded-xl text-[9px] font-mono break-all select-all">
                      base64 resumaster.keystore -w 0
                    </div>
                  </div>
                </div>
              )}
           </div>

           <div className="mt-8 flex justify-center gap-6">
             <button onClick={() => setActiveLegal('privacy')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Privacy</button>
             <button onClick={() => setActiveLegal('terms')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Terms</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
