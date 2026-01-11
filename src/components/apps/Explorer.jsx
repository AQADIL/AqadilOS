import React, { useState } from 'react';
import { RESUME_DATA } from '../../data/resumeData';
import { PROJECT_STRUCTURE } from '../../data/projectStructure';
import { FolderOpen, ChevronRight, FileCode, ShieldCheck, WifiOff, PlayCircle, LayoutGrid, ChevronDown } from 'lucide-react';
import Dashboard from './Dashboard';
import SecurityRules from './SecurityRules';

const SidebarItem = ({ icon: Icon, label, active, hasChildren, onClick, isExpanded, level = 0 }) => (
    <div 
        onClick={onClick}
        className={'flex items-center gap-2 px-2 py-1.5 rounded-md text-sm mb-1 cursor-pointer transition-colors ' + 
                 (active ? 'bg-blue-500/20 text-blue-400' : 'text-white hover:text-white hover:bg-white/5')}
        style={{ paddingLeft: `${8 + level * 16}px` }}
    >
        {hasChildren && (
            <span className='inline-flex items-center justify-center w-4 h-4'>
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
        )}
        {!hasChildren && <span className='inline-flex items-center justify-center w-4 h-4' />}
        <Icon size={16} className='flex-shrink-0' />
        <span className='flex-1 truncate text-white select-none'>{label}</span>
        {hasChildren && (
            <span className='text-xs text-gray-400 opacity-60'>
                {isExpanded ? '−' : '+'}
            </span>
        )}
    </div>
)

export default function Explorer({ onOpenApp }) {
  const { project } = RESUME_DATA;
  const [expandedFolders, setExpandedFolders] = useState(new Set([PROJECT_STRUCTURE.name]));
  const [activeView, setActiveView] = useState('explorer');

  const handleItemClick = (label) => {
    console.log(`Clicked on: ${label}`);
    
    if (label === 'Dashboard') {
      setActiveView('dashboard');
      return;
    }
    
    if (label === 'Security Rules') {
      setActiveView('security');
      return;
    }
    
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const renderFileTree = (files, level = 0, parentPath = '') => {
    return files.map((item, index) => {
      const Icon = item.icon === 'FolderOpen' ? FolderOpen : FileCode;
      const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isExpanded = expandedFolders.has(itemPath);
      const hasChildren = item.children && item.children.length > 0;
      
      return (
        <div key={`${itemPath}-${index}`}>
          <SidebarItem 
            icon={Icon} 
            label={item.name} 
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            onClick={() => handleItemClick(itemPath)}
            level={level}
          />
          {hasChildren && isExpanded && (
            <div className='relative'>
              {level > 0 && (
                <div 
                  className='absolute left-4 top-0 bottom-0 w-px bg-white/10'
                  style={{ left: `${12 + level * 16}px` }}
                />
              )}
              {renderFileTree(item.children, level + 1, itemPath)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderMainContent = () => {
    if (activeView === 'dashboard') {
      return <Dashboard onOpenApp={onOpenApp} />;
    }
    
    if (activeView === 'security') {
      return <SecurityRules />;
    }
    
    return (
      <>
        <div className='h-10 bg-[#252525] border-b border-os-border flex items-center px-4 text-sm text-white gap-2'>
          <FolderOpen size={16}/>
          <span>Projects</span>
          <ChevronRight size={14}/>
          <span className='text-white font-medium'>{project.name}</span>
        </div>

        <div className='flex-1 p-8 overflow-auto bg-grid-pattern'>
          <div className='bg-[#202020]/80 backdrop-blur-xl p-8 rounded-2xl border border-os-border shadow-2xl max-w-3xl mx-auto'>
            <div className='flex items-start justify-between mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center'>
                  <PlayCircle size={32} />
                </div>
                <div>
                  <h1 className='text-3xl font-bold text-white mb-2'>{project.name}</h1>
                  <div className='flex items-center gap-3'>
                    <span className='px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full'>{project.status}</span>
                    <span className='text-xs text-gray-400'>React + Firebase + PWA</span>
                  </div>
                </div>
              </div>
              <button onClick={() => window.open('https://github.com/AQADIL', '_blank')} className='px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors'>
                View Source
              </button>
            </div>
            
            <p className='text-lg text-gray-300 leading-relaxed mb-8 border-b border-os-border pb-8'>
              {project.description}
            </p>

            <h2 className='text-xl font-bold text-white mb-6 flex items-center gap-3'>
              <ShieldCheck size={24} className='text-blue-400'/>
              Key Technical Highlights
            </h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {project.highlights.map((feat, i) => (
                <div key={i} className='bg-[#2a2a2a] p-4 rounded-xl border border-os-border hover:border-blue-500/50 transition-colors flex items-start gap-3'>
                  <div className='mt-1 text-blue-400'>
                    {i === 0 ? <ShieldCheck/> : i === 2 ? <WifiOff/> : <FileCode/>}
                  </div>
                  <span className='text-sm text-gray-300 leading-snug'>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='h-full flex bg-[#181818] text-os-text'>
        <div className='w-64 bg-[#202020] border-r border-os-border flex flex-col p-3'>
            <div className='text-xs font-bold text-white uppercase mb-3 tracking-wider px-2'>Explorer</div>
            <div className='flex-1 overflow-y-auto max-h-[calc(100vh-10rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent'>
              <SidebarItem 
                icon={FolderOpen} 
                label={PROJECT_STRUCTURE.name} 
                active 
                hasChildren={true} 
                isExpanded={expandedFolders.has(PROJECT_STRUCTURE.name)} 
                onClick={() => handleItemClick(PROJECT_STRUCTURE.name)}
                level={0}
              />
               {expandedFolders.has(PROJECT_STRUCTURE.name) && (
                  <div className='relative'>
                    <div className='absolute left-4 top-0 bottom-0 w-px bg-white/10' />
                    {renderFileTree(PROJECT_STRUCTURE.files, 1, PROJECT_STRUCTURE.name)}
                  </div>
               )}
               <div className='mt-6 text-xs font-bold text-white uppercase mb-3 tracking-wider px-2'>Favorites</div>
               <SidebarItem icon={LayoutGrid} label='Dashboard' onClick={() => handleItemClick('Dashboard')} />
               <SidebarItem icon={ShieldCheck} label='Security Rules' onClick={() => handleItemClick('Security Rules')} />
               <div className='mt-4 flex items-center gap-2 px-2 py-2 bg-[#252525] rounded-lg border border-gray-700'>
                 <button 
                   onClick={() => setActiveView('explorer')}
                   className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                     activeView === 'explorer' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                   }`}
                 >
                   Files
                 </button>
                 <button 
                   onClick={() => setActiveView('dashboard')}
                   className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                     activeView === 'dashboard' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                   }`}
                 >
                   Dashboard
                 </button>
                 <button 
                   onClick={() => setActiveView('security')}
                   className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                     activeView === 'security' 
                       ? 'bg-blue-600 text-white' 
                       : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                   }`}
                 >
                   Security
                 </button>
               </div>
            </div>
        </div>

        <div className='flex-1 flex flex-col'>
          {renderMainContent()}
        </div>
    </div>
  );
}
