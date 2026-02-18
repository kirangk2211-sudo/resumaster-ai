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

const AccountModal: React.FC<Props> = ({ isOpen, onClose, subscription, onSubscribe, userName }) => {
  const [activeLegal, setActiveLegal] = useState<'privacy' | 'terms' | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'billing' | 'mobile'>('plan');
  const [showDevSettings, setShowDevSettings] = useState(false);

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
            <button onClick={() => setActiveTab('plan')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'plan' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Plan</button>
            <button onClick={() => setActiveTab('billing')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'billing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Billing</button>
            <button onClick={() => setActiveTab('mobile')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>Mobile</button>
          </div>

          <div className="space-y-4 text-left">
            {activeTab === 'plan' && (
              <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-600 leading-relaxed">Your plan is managed securely. You can download resumes as long as your subscription is active.</p>
                {!isSubscribed && (
                  <button onClick={onSubscribe} className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95">
                    Unlock Pro Access
                  </button>
                )}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-3">
                {subscription.billingHistory && subscription.billingHistory.length > 0 ? (
                  subscription.billingHistory.map((txn) => (
                    <div key={txn.id} className="p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">{txn.date}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{txn.id}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900">₹{txn.amount}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-widest">No transactions yet</p>
                )}
              </div>
            )}

            {activeTab === 'mobile' && (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl border border-amber-100 bg-amber-50/30">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Fix Play Store Warnings</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <i className="fa-solid fa-users text-amber-500 mt-1 shrink-0"></i>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">Warning: No Testers</p>
                        <p className="text-[9px] text-slate-500 font-medium">In Play Console, go to Testing → Internal testing. Click the Testers tab and add your email list.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <i className="fa-solid fa-code text-amber-500 mt-1 shrink-0"></i>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">Warning: No Deobfuscation</p>
                        <p className="text-[9px] text-slate-500 font-medium">Download mapping.txt from GitHub build artifacts and upload it to the App Bundles section in Play Console.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowDevSettings(!showDevSettings)}
                  className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  {showDevSettings ? 'Hide Maintenance Keys' : 'Show Maintenance Keys'}
                </button>

                {showDevSettings && (
                  <div className="p-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 animate-in slide-in-from-top-2">
                    <p className="text-[9px] font-bold text-slate-600 uppercase mb-2">Build Command Ref:</p>
                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[9px] font-mono break-all select-all">
                      keytool -genkey -v -keystore resumaster.keystore -alias resu -keyalg RSA -keysize 2048 -validity 10000 -storepass 123456 -keypass 123456
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center gap-6 border-t border-slate-50 pt-6">
            <button onClick={() => setActiveLegal('privacy')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Privacy</button>
            <button onClick={() => setActiveLegal('terms')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">Terms</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
