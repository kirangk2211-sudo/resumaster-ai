
import React, { useState, useRef, useEffect } from 'react';
import { ResumeData, ChatMessage } from '../types';
import { processChatCommand } from '../services/geminiService';

interface Props {
  resumeData: ResumeData;
  onUpdate: (data: ResumeData) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AiAssistant: React.FC<Props> = ({ resumeData, onUpdate, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! I am your Resume Co-pilot. Tell me about a new job, or ask me to rewrite a section!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const { updatedData, message } = await processChatCommand(userMsg, resumeData);
    
    if (JSON.stringify(updatedData) !== JSON.stringify(resumeData)) {
      onUpdate(updatedData);
    }

    setMessages(prev => [...prev, { role: 'assistant', content: message }]);
    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl flex flex-col h-[70vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Co-pilot</h3>
              <p className="text-[10px] opacity-70">Always active</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-black/10 flex items-center justify-center">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="E.g. Add a job at Netflix..."
            className="flex-1 bg-slate-50 rounded-2xl px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
