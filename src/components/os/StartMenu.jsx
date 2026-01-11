import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APPS_CONFIG } from '../../data/appsConfig';
import { Search, UserCircle, Gamepad2, Settings, User, Heart, ChevronUp, LogOut } from 'lucide-react';
import { RESUME_DATA } from '../../data/resumeData';
import { FileText, Code2 } from 'lucide-react';
import GamesFolder from '../apps/GamesFolder';

const HIDDEN_FROM_PINNED = new Set(['settings', 'contact', 'donate']);

export default function StartMenu({ onClose, onOpenApp }) {
  const pinnedApps = Object.values(APPS_CONFIG).filter(app => 
    !['systemOverride', 'devTycoon', 'neonDrift'].includes(app.id) &&
    !HIDDEN_FROM_PINNED.has(app.id)
  );
  const [gamesFolderOpen, setGamesFolderOpen] = useState(false);
  const [gamesButtonPosition, setGamesButtonPosition] = useState(null);
  const gamesButtonRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleGamesClick = () => {
    if (gamesButtonRef.current) {
      const rect = gamesButtonRef.current.getBoundingClientRect();
      setGamesButtonPosition({
        top: rect.top,
        left: rect.right + 8,
        width: 320
      });
    }
    setGamesFolderOpen(true);
  };

  return (
    <>
    <div className='fixed inset-0 z-[90]' onClick={onClose}></div>
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className='fixed bottom-16 left-4 w-[400px] md:w-[640px] bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-[100] overflow-hidden flex flex-col'
      style={{ height: 'min(600px, 80vh)'}}
    >
        <div className='p-6 pb-2'>
            <div className='flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 focus-within:border-slate-400 transition-colors'>
                <Search size={20} className='text-slate-500'/>
                <input type='text' placeholder='Search for apps, settings, and documents' className='bg-transparent outline-none flex-1 placeholder:text-slate-500 text-slate-800'/>
            </div>
        </div>

        <div className='flex-1 overflow-auto p-6 pt-2 flex flex-col gap-6'>
            <div>
                <div className='flex items-center justify-between mb-4 px-2'>
                    <h3 className='text-sm font-semibold text-slate-800'>Pinned</h3>
                    <button className='text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors'>All apps</button>
                </div>
                <div className='grid grid-cols-4 md:grid-cols-6 gap-2'>
                    {}
                    <button 
                        ref={gamesButtonRef}
                        key='games-folder'
                        onClick={handleGamesClick} 
                        className='flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-colors group'
                    >
                        <div className='w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm group-hover:scale-105 transition-transform'>
                            <Gamepad2 size={28} className="text-white" />
                        </div>
                        <span className='text-xs text-slate-700 truncate w-full text-center font-medium'>Games</span>
                    </button>
                    
                    {pinnedApps.map(app => (
                        <button key={app.id} onClick={() => { onOpenApp(app.id); onClose(); }} className='flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors group'>
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-sm group-hover:scale-105 transition-transform ${
                              ['terminal', 'github', 'telegram'].includes(app.id) 
                                ? 'bg-white border-2 border-slate-300' 
                                : 'bg-white border border-slate-200'
                            }`}>
                                {React.cloneElement(app.icon, { 
                                  size: 28,
                                  className: ['terminal', 'github', 'telegram'].includes(app.id) 
                                    ? 'text-slate-700' 
                                    : ''
                                })}
                            </div>
                            <span className='text-xs text-slate-700 truncate w-full text-center font-medium'>{app.title}</span>
                        </button>
                    ))}
                </div>
            </div>

             <div>
                <div className='flex items-center justify-between mb-4 px-2'>
                    <h3 className='text-sm font-semibold text-slate-800'>Recommended</h3>
                    <button className='text-xs text-slate-500 hover:bg-slate-100 px-2 py-1 rounded transition-colors'>More</button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer'>
                        <div className='w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center'>
                            <FileText size={20}/>
                        </div>
                        <div>
                            <div className='text-sm font-medium text-slate-800'>Latest Resume Version.pdf</div>
                            <div className='text-xs text-slate-500'>Opened 5 min ago</div>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer'>
                         <div className='w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center'>
                            <Code2 size={20}/>
                        </div>
                        <div>
                            <div className='text-sm font-medium text-slate-800'>AkadilEDU_Project_Final</div>
                            <div className='text-xs text-slate-500'>Recently added</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='bg-slate-50/80 p-4 border-t border-slate-200 flex items-center justify-between relative'>
            {}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: -10, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                  className='absolute bottom-full left-2 w-64 bg-[#f9f9f9]/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-xl p-1 overflow-hidden z-[120] mb-2'
                >
                  <div className='p-2 border-b border-slate-200'>
                    <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2'>User options</p>
                  </div>

                  <button
                    onClick={() => {
                      onOpenApp('settings');
                      setIsUserMenuOpen(false);
                      onClose();
                    }}
                    className='w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors'
                  >
                    <Settings size={16} />
                    <span>Settings & Personalization</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenApp('contact');
                      setIsUserMenuOpen(false);
                      onClose();
                    }}
                    className='w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-blue-500 hover:text-white rounded-lg transition-colors'
                  >
                    <User size={16} />
                    <span>Contact Me</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenApp('donate');
                      setIsUserMenuOpen(false);
                      onClose();
                    }}
                    className='w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-pink-500 hover:text-white rounded-lg transition-colors'
                  >
                    <Heart size={16} />
                    <span>Support / Donate</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-all ${
                isUserMenuOpen ? 'bg-black/5' : 'hover:bg-black/5'
              }`}
            >
                <div className='w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md'>
                  AA
                </div>
                <div className='text-left'>
                    <span className='block text-sm font-semibold text-slate-800 leading-none'>{RESUME_DATA.header.name}</span>
                    <span className='text-[10px] text-slate-500'>Administrator</span>
                </div>
                <ChevronUp size={14} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>
             <button className='p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-slate-500'>
                <LogOut size={18} />
             </button>
        </div>
    </motion.div>
    
    {}
    <GamesFolder 
        isOpen={gamesFolderOpen} 
        onClose={() => setGamesFolderOpen(false)}
        onOpenApp={(appId) => {
          onOpenApp(appId);
          onClose();
        }}
        position={gamesButtonPosition}
    />
    
    </>
  );
}
