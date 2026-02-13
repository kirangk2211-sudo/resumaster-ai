
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'create' | 'details') => void;
  onLogout: () => void;
  isSubscribed?: boolean;
  userName?: string;
  downloadCount: number;
}

const AccountMenu: React.FC<Props> = ({ isOpen, onClose, onNavigate, onLogout, isSubscribed, userName, downloadCount }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[140] bg-slate-900/10 backdrop-blur-[2px] transition-all animate-in fade-in duration-200" 
        onClick={onClose}
      />
      
      <div className="fixed top-24 right-4 w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-[150] overflow-hidden animate-in slide-in-from-top-4 duration-200">
        <div className="p-3 space-y-1" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-6 border-b border-slate-50 mb-3">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Logged in as</p>
            <p className="text-lg font-bold text-slate-900 truncate">{userName || 'Active User'}</p>
          </div>

          {/* Download Tracker Section */}
          <div className="px-6 py-4 bg-slate-50 rounded-2xl mb-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                <i className="fa-solid fa-cloud-arrow-down"></i>
              </div>
              <p className="text-sm font-bold text-slate-700">Downloads</p>
            </div>
            <p className="text-xl font-black text-blue-600">{downloadCount}</p>
          </div>

          <button 
            onClick={() => onNavigate('details')}
            className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 rounded-2xl transition-colors group text-left"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSubscribed ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
              <i className={`fa-solid ${isSubscribed ? 'fa-chart-line' : 'fa-credit-card'} text-lg`}></i>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">Subscription Status</p>
              <p className="text-xs text-slate-400 font-medium">{isSubscribed ? 'Pro Member' : 'Free Account'}</p>
            </div>
          </button>

          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 p-5 hover:bg-red-50 rounded-2xl transition-colors group text-left"
          >
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
              <i className="fa-solid fa-right-from-bracket text-lg"></i>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 group-hover:text-red-600">Logout</p>
              <p className="text-xs text-slate-400 font-medium">Clear session data</p>
            </div>
          </button>

          <div className="p-4 pt-6">
            <button 
              onClick={() => onNavigate('details')}
              className={`w-full rounded-3xl p-5 border text-left transition-all hover:scale-[1.02] active:scale-95 ${isSubscribed ? 'bg-green-50/50 border-green-100' : 'bg-blue-50/50 border-blue-100'}`}
            >
              <p className={`text-[11px] font-black uppercase tracking-widest mb-2 ${isSubscribed ? 'text-green-600' : 'text-blue-600'}`}>
                {isSubscribed ? 'PREMIUM ACCESS' : 'UPGRADE TO PRO'}
              </p>
              <p className="text-sm text-slate-800 font-bold leading-tight">
                {isSubscribed ? 'Manage your features' : 'Unlock PDF downloads today.'}
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountMenu;
