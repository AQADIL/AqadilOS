import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Volume2, Battery, Search } from 'lucide-react';
import { APPS_CONFIG } from '../../data/appsConfig';
import StartMenu from './StartMenu';
import { AnimatePresence, motion } from 'framer-motion';

const TaskbarIcon = ({ icon, title, isOpen, isActive, onClick }) => (
    <button 
      onClick={onClick}
      className={`relative p-1.5 md:p-2.5 rounded-md transition-all duration-200 group hover:bg-gray-100 flex items-center justify-center ${
        isActive ? 'bg-gray-100' : ''
      }`}
    >
      <div className={`transition-transform duration-200 ${
        isActive ? 'scale-110' : 'group-hover:scale-105'
      }`}>
        {React.cloneElement(icon, { 
          size: window.innerWidth < 768 ? 18 : 24, 
          className: "text-black",
          style: icon.type === 'img' ? { width: window.innerWidth < 768 ? 18 : 26, height: window.innerWidth < 768 ? 18 : 26 } : {}
        })}
      </div>
      {isOpen && (
        <motion.div 
          layoutId='activeIndicator'
          className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
            isActive ? 'bg-os-accent w-3 md:w-5' : 'bg-gray-400'
          }`} 
        />
      )}
    </button>
);

export default function Taskbar({ windows, activeId, onToggleMinimize, onOpenApp }) {
  const [time, setTime] = useState(new Date());
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = ['notepad', 'explorer', 'terminal', 'github', 'telegram'];
  const taskbarItems = [...new Set([...pinnedApps, ...windows.map(w => w.id)])];

  return (
    <>
    <AnimatePresence>
      {startOpen && <StartMenu onClose={() => setStartOpen(false)} onOpenApp={onOpenApp} />}
    </AnimatePresence>

    <div className='taskbar flex items-center justify-between px-2 md:px-4 z-[100] h-10 md:h-12'>
      
      <div className='flex items-center gap-1 md:gap-2'>
        <button 
          onClick={() => setStartOpen(!startOpen)}
          className={`p-1.5 md:p-2 rounded-md transition-colors hover:bg-gray-100 ${
            startOpen ? 'bg-gray-100' : ''
          }`}
        >
             <svg width='18' height='18' viewBox='0 0 88 88' fill='none' xmlns='http://www.w3.org/2000/svg' className='text-blue-400 md:w-6 md:h-6'>
                <path d='M0 12.4096L35.2 7.61377V42.5369H0V12.4096Z' fill='currentColor'/>
                <path d='M88 0L40.9067 6.676V42.5369H88V0Z' fill='currentColor'/>
                <path d='M0 46.9585H35.2V81.229L0 76.5262V46.9585Z' fill='currentColor'/>
                <path d='M88 46.9585H40.9067V88L88 81.324V46.9585Z' fill='currentColor'/>
            </svg>
        </button>
        <div className='hidden md:flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-black w-64'>
            <Search size={16} className="text-black" />
            <span className="text-black">Type here to search...</span>
        </div>
      </div>

      <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5 md:gap-1 h-full overflow-x-auto max-w-[60%]' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitScrollbar: 'none' }}>
        {taskbarItems.map(appId => {
            const config = APPS_CONFIG[appId];
            const window = windows.find(w => w.id === appId);
            const isOpen = !!window;
            const isActive = activeId === appId && !window?.minimized;


            const icon = config?.icon || window?.config?.icon;
            const title = config?.title || window?.config?.title;


            if (!icon) return null;

            return (
                <TaskbarIcon 
                    key={appId}
                    icon={icon}
                    title={title}
                    isOpen={isOpen}
                    isActive={isActive}
                    onClick={() => isOpen ? onToggleMinimize(appId) : onOpenApp(appId)}
                />
            )
        })}
      </div>

      <div className='flex items-center gap-2 md:gap-4 text-black text-xs'>
         <div className='hidden md:flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-md transition-colors cursor-default'>
            <Wifi size={16} className="text-black" />
            <Volume2 size={16} className="text-black" />
            <Battery size={16} className="text-black" />
         </div>
         <div className='text-right hover:bg-gray-100 px-2 md:px-3 py-1 rounded-md transition-colors cursor-default'>
            <div className='font-medium text-black text-xs md:text-sm'>{format(time, 'HH:mm')}</div>
            <div className='text-black text-xs hidden md:block'>{format(time, 'dd/MM/yyyy')}</div>
         </div>
      </div>
    </div>
    </>
  );
}
