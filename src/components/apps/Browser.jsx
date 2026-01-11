import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, RotateCw, X, Plus, Globe, 
  Shield, Lock, Star, Search, Command, Smartphone, BookOpen, FileText, Play, Briefcase
} from 'lucide-react';
import { useSecurity } from '../SecurityGate';


const AqadiliumIcon = ({ size, className }) => (
  <img 
    src="/akadilium.png" 
    className={`${className} rounded`}
    style={{ width: size, height: size }}
    alt="Akadilium"
  />
);




const HomePage = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center h-full bg-gray-900 font-sans">
    <div className="flex flex-col items-center gap-8 max-w-2xl w-full px-8">
      {}
      <div className="flex flex-col items-center gap-4">
        <img src="/akadilium.png" className="w-16 h-16 object-contain" />
        <h1 className="text-3xl font-semibold text-white">Akadilium</h1>
      </div>

      {}
      <div className="w-full max-w-xl">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target[0].value;
            if(val) onNavigate(val);
          }}
          className="relative"
        >
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Search size={18} className="text-gray-400 ml-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search Google or type a URL" 
              className="flex-1 py-3 px-2 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
              autoFocus
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {}
      <div className="grid grid-cols-5 gap-4 mt-8">
        {[
          { name: "GitHub", url: "https://github.com/AQADIL", icon: <img src="/github.png" style={{ width: 30, height: 30 }} alt="GitHub" />, color: "hover:bg-gray-800" },
          { name: "Portfolio", url: "resume://open", icon: <Briefcase size={24} />, color: "hover:bg-blue-900/30" },
          { name: "Wiki", url: "https://www.wikipedia.org", icon: <img src="/wiki.png" style={{ width: 30, height: 30 }} alt="Wiki" />, color: "hover:bg-gray-800" },
          { name: "YouTube", url: "https://youtube.com", icon: <Play size={24} />, color: "hover:bg-gray-800" },
          { name: "AkadilEDU", url: "https://akadiledu.com", icon: <img src="/logo.png" style={{ width: 30, height: 30 }} alt="AkadilEDU" />, color: "hover:bg-green-800" },
        ].map((site) => (
          <button 
            key={site.name}
            onClick={() => onNavigate(site.url)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${site.color} hover:scale-105 group`}
          >
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/30 shadow-lg">
              {site.icon}
            </div>
            <span className="text-xs text-gray-400 font-medium">{site.name}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default function BrowserApp({ onOpenApp }) {
  const { openLink } = useSecurity();
  

  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', url: 'home', icon: <AqadiliumIcon size={14} />, isLoading: false }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [urlInput, setUrlInput] = useState('');
  const [iframeKey, setIframeKey] = useState(0);
  const [adBlockCount, setAdBlockCount] = useState(1402);


  useEffect(() => {
    const interval = setInterval(() => {
      setAdBlockCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab.url === 'home') {
      setUrlInput('');
    } else {
      setUrlInput(activeTab.url);
    }
  }, [activeTabId, activeTab.url]);

  const handleNavigate = (input) => {
    let url = input;
    let title = input;

    if (input === 'resume://open') {
        if (onOpenApp) {
            onOpenApp('notepad');
        }
        return;
    }

    

    if (!input.includes('.') || input.includes(' ')) {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;
      title = `${input} - Search`;
    } else {
      if (!input.startsWith('http')) {
        url = `https://${input}`;
      }
      title = input;
    }

    updateTab(activeTabId, { url, title, isLoading: true });
    

    setTimeout(() => {
      updateTab(activeTabId, { isLoading: false });
    }, 1500);
  };

  const updateTab = (id, data) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const addTab = () => {
    const newId = Math.max(...tabs.map(t => t.id)) + 1;
    setTabs([...tabs, { id: newId, title: 'New Tab', url: 'home', icon: <AqadiliumIcon size={14} />, isLoading: false }]);
    setActiveTabId(newId);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1c1c1e] text-gray-300">
        

        <div className="bg-[#2a2a2c] pt-2 px-2 flex items-end gap-1 select-none">
          {}
          <div className="flex-1 flex items-end gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`
                  group relative flex items-center gap-2 px-3 py-2 text-xs max-w-[180px] min-w-[120px] rounded-t-lg cursor-pointer transition-all
                  ${activeTabId === tab.id 
                    ? 'bg-[#3a3a3c] text-white shadow-[-1px_-1px_0_rgba(255,255,255,0.05)]' 
                    : 'bg-transparent hover:bg-[#323234] text-gray-400'}
                `}
              >
                {tab.isLoading ? (
                  <RotateCw size={12} className="animate-spin text-blue-400" />
                ) : (
                  <AqadiliumIcon size={12} className={activeTabId === tab.id ? "opacity-100" : "opacity-60"} />
                )}
                <span className="truncate flex-1">{tab.title}</span>
                <button 
                  onClick={(e) => closeTab(e, tab.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded p-0.5"
                >
                  <X size={10} />
                </button>
                
                {}
                {activeTabId === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3a3a3c] z-10 translate-y-1"></div>
                )}
              </div>
            ))}
            <button onClick={addTab} className="p-2 hover:bg-white/5 rounded-md text-gray-400 mb-1">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {}
        <div className="bg-[#3a3a3c] px-3 py-2 flex items-center gap-3 border-b border-black/20 shadow-md relative z-20">
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white/10 rounded-full text-gray-400"><ArrowLeft size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-full text-gray-400"><ArrowRight size={16} /></button>
            <button 
              onClick={() => {
                setIframeKey(prev => prev + 1);
                updateTab(activeTabId, { isLoading: true });
                setTimeout(() => updateTab(activeTabId, { isLoading: false }), 1000);
              }} 
              className="p-1.5 hover:bg-white/10 rounded-full text-gray-400"
            >
              <RotateCw size={14} className={activeTab.isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {}
          <div className="flex-1 bg-[#1c1c1e] rounded-lg flex items-center px-3 py-1.5 border border-white/5 focus-within:border-blue-500/50 transition-colors">
            {activeTab.url.startsWith('https') ? <Lock size={12} className="text-green-500 mr-2" /> : <Search size={12} className="text-gray-500 mr-2" />}
            <input 
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNavigate(urlInput)}
              onFocus={(e) => e.target.select()}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 font-mono"
            />
            <button className="text-gray-500 hover:text-yellow-400"><Star size={14} /></button>
          </div>
        </div>

        {}
        <div className="flex-1 relative bg-white overflow-hidden">
          {activeTab.isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500/20 z-50">
            </div>
          )}

          {activeTab.url === 'home' ? (
            <HomePage onNavigate={handleNavigate} />
          ) : (
            <div className="w-full h-full relative">
              {}
              {(activeTab.url.includes('google.com') || activeTab.url.includes('youtube.com')) ? (
                 <div className="absolute inset-0 bg-[#1c1c1e] text-white flex flex-col items-center justify-center gap-4">
                    <Shield size={64} className="text-red-500" />
                    <h2 className="text-2xl font-bold">Security Protocol Activated</h2>
                    <p className="text-gray-400 text-center max-w-md">
                      The site <b>{activeTab.url}</b> prohibits embedding in Akadilium OS for security reasons (X-Frame-Options).
                    </p>
                    <button 
                      onClick={() => openLink(activeTab.url)}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
                    >
                      Open in External Tab
                    </button>
                    <button 
                      onClick={() => updateTab(activeTabId, { url: 'home', title: 'New Tab' })}
                      className="text-sm text-gray-500 hover:text-white underline"
                    >
                      Go Home
                    </button>
                 </div>
              ) : (
                <iframe
                  key={iframeKey}
                  src={activeTab.url}
                  title={activeTab.title}
                  className="w-full h-full border-none bg-white"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
              )}
            </div>
          )}
        </div>
      </div>
  );
}