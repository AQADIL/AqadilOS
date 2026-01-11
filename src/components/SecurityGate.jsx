import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ExternalLink, Github, Send, Globe, AlertTriangle, ArrowRight, X } from 'lucide-react';


const playSecuritySound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'scan') {

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
};


const getLinkMeta = (url) => {
  if (url.includes('github.com')) {
    return { name: 'GitHub', icon: Github, color: 'text-white', bg: 'bg-zinc-800', trust: 'High' };
  }
  if (url.includes('t.me') || url.includes('telegram')) {
    return { name: 'Telegram', icon: Send, color: 'text-blue-400', bg: 'bg-blue-500/20', trust: 'Verified' };
  }
  if (url.includes('youtube.com')) {
    return { name: 'YouTube', icon: ExternalLink, color: 'text-red-500', bg: 'bg-red-500/20', trust: 'Media' };
  }
  if (url.includes('akadiledu.com')) {
    return { name: 'AkadilEDU', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-500/20', trust: 'Official' };
  }
  return { name: 'External Site', icon: Globe, color: 'text-cyan-400', bg: 'bg-cyan-500/20', trust: 'Unverified' };
};


const SecurityContext = createContext();

export const useSecurity = () => useContext(SecurityContext);

export const SecurityProvider = ({ children }) => {
  const [request, setRequest] = useState(null);

  console.log('SecurityProvider: Component rendered');

  const openLink = (url) => {
    console.log('SecurityProvider: openLink called with URL:', url);
    playSecuritySound('scan');
    setRequest({ url });
    console.log('SecurityProvider: setRequest called with:', { url });
  };

  const confirm = () => {
    if (request?.url) {
      console.log('SecurityProvider: Opening URL:', request.url);
      window.open(request.url, '_blank');
      setRequest(null);
    }
  };

  const cancel = () => {
    console.log('SecurityProvider: Cancelled');
    setRequest(null);
  };

  console.log('SecurityProvider: Current request:', request);

  return (
    <SecurityContext.Provider value={{ openLink }}>
      {children}
      <SecurityModal request={request} onConfirm={confirm} onCancel={cancel} />
    </SecurityContext.Provider>
  );
};


function SecurityModal({ request, onConfirm, onCancel }) {
  if (!request) return null;

  const meta = getLinkMeta(request.url);
  const Icon = meta.icon;

  console.log('SecurityModal: Rendering for URL:', request.url);

  return (
    <AnimatePresence>
      {request && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans">
          
          {}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-[#09090b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-[99999]"
          >
            
            {}
            <div className={`h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50`} />

            <div className="p-8">
              
              {}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                   <ShieldCheck size={14} className="text-emerald-400" />
                   <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Security Gateway</span>
                </div>
                <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {}
              <div className="flex flex-col items-center text-center mb-8">
                
                {}
                <div className={`relative mb-6 p-6 rounded-2xl ${meta.bg} bg-opacity-10 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                   <div className={`absolute inset-0 rounded-2xl ${meta.bg} blur-xl opacity-40`} />
                   <Icon size={48} className={`relative ${meta.color}`} />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                  Leaving aqadilOS
                </h2>
                <p className="text-gray-400 text-sm">
                  You are attempting to navigate to <span className="text-white font-medium">{meta.name}</span>.
                </p>
                
                {}
                <div className="mt-4 px-4 py-2 bg-black/50 rounded-lg border border-white/5 flex items-center gap-2 max-w-full">
                   <Globe size={12} className="text-gray-500 shrink-0" />
                   <span className="text-xs text-gray-400 truncate font-mono">{request.url}</span>
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onCancel}
                  className="py-3.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  className="relative group py-3.5 rounded-xl font-bold text-sm text-black bg-white overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Open Link <ArrowRight size={14} />
                  </span>
                  {}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
