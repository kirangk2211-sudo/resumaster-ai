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
           <p className="text-sm text-slate-500 mt-2 mb-8">
             {isSubscribed ? `Welcome back, ${userName}!` : 'Unlock PDF downloads and premium templates.'}
           </p>

           <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('plan')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'plan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Plan
              </button>
              <button 
                onClick={() => setActiveTab('billing')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'billing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Billing
              </button>
              <button 
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
              >
                Mobile App
              </button>
           </div>

           <div className="space-y-4 text-left">
              {activeTab === 'plan' && (
                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Plan</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isSubscribed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {subscription.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {!isSubscribed ? (
                    <>
                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="text-3xl font-black text-slate-900">₹75</span>
                        <span className="text-slate-400 text-sm font-bold">/ month</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {['Unlimited PDF Exports', 'AI Resume Tailoring', 'Premium Modern Templates'].map(feat => (
                          <li key={feat} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                            <i className="fa-solid fa-circle-check text-emerald-500"></i>
                            {feat}
                          </li>
                        ))}
                      </ul>
                      <button 
                        onClick={onSubscribe}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 active:scale-95 transition-all"
                      >
                        Unlock Pro Access
                      </button>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Type</span>
                        <span className="text-xs font-black text-slate-900">{subscription.planName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price</span>
                        <span className="text-xs font-black text-slate-900">₹{subscription.price}.00 / mo</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Valid Until</span>
                        <span className="text-xs font-black text-slate-900">{subscription.expiryDate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                   <div className="flex items-center gap-2 mb-6">
                      <i className="fa-solid fa-receipt text-emerald-500"></i>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Log</span>
                   </div>
                   <div className="space-y-4 max-h-[240px] overflow-y-auto no-scrollbar pr-1">
                      {subscription.billingHistory?.map((txn) => (
                        <div key={txn.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                           <div>
                              <p className="text-xs font-black text-slate-900">{txn.date}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{txn.id}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-emerald-600">₹{txn.amount}.00</p>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">SUCCESSFUL</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'mobile' && (
                <div className="p-6 rounded-3xl border border-blue-100 bg-blue-50/30">
                  <div className="flex items-center gap-2 mb-3">
                      <i className="fa-solid fa-microchip text-blue-600"></i>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mobile Build (CI/CD)</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium mb-4 leading-relaxed">
                    To download your Android APK, go to your repository on GitHub, click <span className="font-bold">Actions</span>, select <span className="font-bold">DEPLOY: Build Android App</span>, and download the <span className="font-bold">Artifacts</span> from the latest run.
                  </p>
                  <p className="text-[10px] text-slate-500 italic">
                    Note: Your data is saved locally in your vault for maximum privacy.
                  </p>
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