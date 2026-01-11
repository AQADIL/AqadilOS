import React from 'react';
import { APPS_CONFIG } from '../../data/appsConfig';

const HIDDEN_FROM_DESKTOP = new Set(['settings', 'contact', 'donate']);

const DesktopIcon = ({ config, onClick }) => (
  <button 
    onDoubleClick={onClick}
    className="desktop-icon group flex flex-col items-center"
  >
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform bg-black/15 border border-white/10">
      {React.cloneElement(config.icon, { 
        size: 36, 
        className: "text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.85)]" 
      })}
    </div>
    <span
      className="mt-1 text-xs leading-tight font-medium text-center px-1 max-w-[104px] break-words"
      style={{
        color: '#ffffff',
        WebkitTextStroke: '0.5px rgba(0,0,0,0.9)',
        textShadow: '0 1px 2px rgba(0,0,0,0.9)',
      }}
    >
      {config.title}
    </span>
  </button>
);

export default function DesktopIcons({ onOpenApp }) {
  const desktopApps = Object.values(APPS_CONFIG).filter(
    app => !app.isExternal && !HIDDEN_FROM_DESKTOP.has(app.id)
  );

  return (
    <div className='absolute inset-0 p-6 flex flex-col flex-wrap content-start gap-4 z-0'>
      {desktopApps.map(app => (
        <DesktopIcon 
          key={app.id} 
          config={app} 
          onClick={() => onOpenApp(app.id)} 
        />
      ))}
    </div>
  );
}
