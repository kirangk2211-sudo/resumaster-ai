import React, { useState, useEffect } from 'react';

interface Props {
  status: 'idle' | 'syncing' | 'saved';
}

const SyncStatus: React.FC<Props> = ({ status }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-full border border-red-500 shadow-lg shadow-red-200 animate-pulse">
        <i className="fa-solid fa-triangle-exclamation text-white text-[10px]"></i>
        <span className="text-[9px] font-black text-white uppercase tracking-widest">Offline Mode</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100 shadow-sm transition-all">
      {status === 'syncing' ? (
        <>
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </div>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Saving...</span>
        </>
      ) : status === 'saved' ? (
        <>
          <i className="fa-solid fa-shield-check text-blue-500 text-[10px]"></i>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Local Vault</span>
        </>
      ) : (
        <>
          <i className="fa-solid fa-cloud text-slate-300 text-[10px]"></i>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ready</span>
        </>
      )}
    </div>
  );
};

export default SyncStatus;