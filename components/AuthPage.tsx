import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import { securityService } from '../services/securityService';

interface Props {
  onAuthSuccess: (user: { email: string, name: string, token: string }) => void;
}

const AuthPage: React.FC<Props> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (dataService.isBruteForce(email)) {
      setError('Too many attempts. Account temporarily locked.');
      setIsLoading(false);
      return;
    }

    if (!securityService.isReputableEmail(email)) {
      setError('Blocked: Please use Gmail or a verified company email address.');
      setIsLoading(false);
      return;
    }

    try {
      const users = dataService.getUsers();
      const hashedPw = await securityService.hash(password);

      if (mode === 'signup') {
        if (users.find((u: any) => u.email === email)) {
          setError('Email already registered.');
          setIsLoading(false);
          return;
        }
        const newUser = { 
          email: securityService.sanitize(email), 
          password: hashedPw, 
          name: securityService.sanitize(name) 
        };
        dataService.addUser(newUser);
        handleSuccess(newUser);
      } else {
        const user = users.find((u: any) => u.email === email && u.password === hashedPw);
        if (user) {
          handleSuccess(user);
        } else {
          dataService.recordAttempt(email);
          setError('Invalid credentials. Access denied.');
          setIsLoading(false);
        }
      }
    } catch (err) {
      setError('Security system failure. Please try later.');
      setIsLoading(false);
    }
  };

  const handleSuccess = (user: { email: string, name: string }) => {
    const token = securityService.generateToken();
    const session = { email: user.email, name: user.name, token };
    dataService.saveSession(session);
    onAuthSuccess(session);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-[500] overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-100 mb-6 rotate-3">
            <i className="fa-solid fa-wand-magic-sparkles text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">ResuMaster AI</h1>
          <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest">Professional AI Workspace</p>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
            >
              Join Free
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full px-6 py-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300" 
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com" 
                className="w-full px-6 py-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full px-6 py-6 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300" 
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl flex items-start gap-4 text-red-600 text-[11px] font-bold animate-in shake duration-300">
                <i className="fa-solid fa-circle-exclamation mt-1"></i>
                <span>{error}</span>
              </div>
            )}

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 flex items-center justify-center gap-3 text-xs"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                mode === 'login' ? 'Secure Login' : 'Create Account'
              )}
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
             <i className="fa-solid fa-shield-check text-xs text-blue-600"></i>
             <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Safe & Secured Access</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;