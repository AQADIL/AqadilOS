import React, { useState, useEffect } from 'react';
import { FolderOpen, FileCode, GitBranch, Package, Settings, Search, Filter, Grid, List, Star, Clock, CheckCircle, AlertCircle, Terminal, Zap, Database, Globe, Shield, Rocket, X, Info } from 'lucide-react';
import { PROJECT_STRUCTURE } from '../../data/projectStructure';
import WindowsExplorer from './WindowsExplorer';

export default function Dashboard({ onOpenApp }) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [projectStats, setProjectStats] = useState({
    totalFiles: 7905,
    totalFolders: 1234,
    totalLines: 142857,
    lastUpdated: new Date().toISOString()
  });
  const [isTechnologiesOpen, setIsTechnologiesOpen] = useState(false);

  const handleOpenProject = (projectInfo) => {
    onOpenApp({
      id: 'windows-explorer',
      title: 'File Explorer',
      component: <WindowsExplorer isOpen={true} onClose={() => {}} projectPath={projectInfo.projectPath} />,
      icon: <FolderOpen size={16} className="text-blue-400" />,
      props: { projectPath: projectInfo.projectPath }
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const projectInfo = {
    name: 'AkadilEDU-v2',
    version: '2.1.0',
    lastModified: '2024-12-22',
    status: 'Active Development',
    technologies: ['React', 'Firebase', 'Vite', 'TailwindCSS'],
    projectPath: 'C:\\Users\\ACER\\WebstormProjects\\akadiledu-v2'
  };

  const recentFiles = [
    { name: 'App.jsx', path: 'src/App.jsx', type: 'component', modified: '2 hours ago', size: '23.4 KB' },
    { name: 'firebase.js', path: 'src/firebase/config.js', type: 'config', modified: '5 hours ago', size: '1.6 KB' },
    { name: 'package.json', path: 'package.json', type: 'config', modified: '1 day ago', size: '1.1 KB' },
    { name: 'Login.jsx', path: 'src/pages/Login.jsx', type: 'page', modified: '2 days ago', size: '9.8 KB' }
  ];

  const techStack = {
    frontend: [
      'React 18.2.0', 'Vite 4.4.5', 'React Router DOM 6.15.0', 'Tailwind CSS 3.3.3',
      'Headless UI 1.7.13', 'Lucide React 0.263.1', 'React-i18next 13.0.2',
      'i18next 23.4.4', 'React Hot Toast 2.4.1', 'React Hook Form 7.45.4',
      'React Player 2.13.0', 'Katex', 'Firebase 10.1.0'
    ],
    backend: [
      'Firebase Authentication', 'Firebase Firestore', 'Firebase Storage',
      'Firebase Realtime Database', 'Firebase Cloud Functions', 'Firebase Hosting'
    ]
  };

  const quickActions = [
    { icon: FolderOpen, label: 'Open Project Folder', action: 'open-project', color: 'text-blue-400' },
    { icon: GitBranch, label: 'Git Status', action: 'git-status', color: 'text-green-400' },
    { icon: Package, label: 'Technologies', action: 'technologies', color: 'text-purple-400' }
  ];

  const handleQuickAction = async (action) => {
    console.log(`Quick action: ${action}`);
    
    switch(action) {
      case 'open-project':
        onOpenApp({
          id: 'windows-explorer',
          title: 'File Explorer',
          component: <WindowsExplorer isOpen={true} onClose={() => {}} projectPath={projectInfo.projectPath} />,
          icon: <FolderOpen size={16} className="text-blue-400" />,
          props: { projectPath: projectInfo.projectPath }
        });
        break;
        
      case 'git-status':

        window.open('https://github.com/AQADIL/akadiledu-v2-1', '_blank');
        break;
        
      case 'technologies':
        setIsTechnologiesOpen(true);
        break;
        
      default:
        console.log('Unknown action:', action);
    }
  };

  const filteredRecentFiles = recentFiles.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fileStructure = [
    { name: 'src', type: 'folder', items: projectStats.totalFolders - 5, size: '2.3 MB' },
    { name: 'public', type: 'folder', items: 12, size: '1.8 MB' },
    { name: 'backend', type: 'folder', items: 8, size: '156 KB' },
    { name: 'components', type: 'folder', items: 23, size: '890 KB' }
  ];

  return (
    <div className='h-full bg-[#181818] text-white p-6 overflow-auto'>
      <div className='max-w-7xl mx-auto'>
        {}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <FolderOpen className='text-blue-400' size={32} />
            <div>
              <h1 className='text-3xl font-bold'>{projectInfo.name}</h1>
              <p className='text-gray-400'>Project Dashboard - Real Data Analysis</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <span className='px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full'>
              {projectInfo.status}
            </span>
            <span className='px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full'>
              v{projectInfo.version}
            </span>
          </div>
        </div>

        {}
        <div className='flex items-center gap-4 mb-6'>
          <div className='flex-1 relative'>
            <Search size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search files and folders...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-[#252525] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
            />
          </div>
          <button className='p-2 bg-[#252525] border border-gray-700 rounded-lg hover:border-blue-500 transition-colors'>
            <Filter size={18} />
          </button>
          <div className='flex bg-[#252525] border border-gray-700 rounded-lg p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'} transition-colors`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-600'} transition-colors`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-[#202020] border border-gray-700 rounded-xl p-4'>
            <div className='flex items-center gap-3 mb-2'>
              <FileCode className='text-blue-400' size={20} />
              <span className='text-gray-400 text-sm'>Files</span>
            </div>
            <div className='text-2xl font-bold'>{projectStats.totalFiles}</div>
          </div>
          <div className='bg-[#202020] border border-gray-700 rounded-xl p-4'>
            <div className='flex items-center gap-3 mb-2'>
              <FolderOpen className='text-purple-400' size={20} />
              <span className='text-gray-400 text-sm'>Folders</span>
            </div>
            <div className='text-2xl font-bold'>{projectStats.totalFolders}</div>
          </div>
          <div className='bg-[#202020] border border-gray-700 rounded-xl p-4'>
            <div className='flex items-center gap-3 mb-2'>
              <Database className='text-cyan-400' size={20} />
              <span className='text-gray-400 text-sm'>Total Size</span>
            </div>
            <div className='text-2xl font-bold'>{formatFileSize(projectStats.totalSize)}</div>
          </div>
        </div>

        {}
        <div className='bg-[#202020] border border-gray-700 rounded-xl p-6 mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className='flex flex-col items-center gap-3 p-4 bg-[#252525] border border-gray-700 rounded-lg hover:border-blue-500 transition-all hover:scale-105'
              >
                <action.icon size={24} className={action.color} />
                <span className='text-sm text-center'>{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {}
        <div className='bg-[#202020] border border-gray-700 rounded-xl p-6 mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Recent Files {searchTerm && `(Filtered: ${filteredRecentFiles.length})`}</h2>
          <div className='space-y-3'>
            {filteredRecentFiles.length > 0 ? (
              filteredRecentFiles.map((file, index) => (
                <div key={index} className='flex items-center justify-between p-3 bg-[#252525] rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer'>
                  <div className='flex items-center gap-3'>
                    <FileCode size={16} className='text-blue-400' />
                    <div>
                      <div className='text-white font-medium'>{file.name}</div>
                      <div className='text-gray-400 text-sm'>{file.path}</div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 text-sm text-gray-400'>
                    <span>{file.type}</span>
                    <span>{file.size}</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-8 text-gray-400'>
                {searchTerm ? 'No files found matching your search' : 'No recent files available'}
              </div>
            )}
          </div>
        </div>

        
        {}
        {isTechnologiesOpen && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-[#202020] border border-gray-700 rounded-xl p-6 max-w-4xl w-[90vw] max-h-[80vh] overflow-auto'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
                  <Package className='text-purple-400' size={28} />
                  Project Technologies
                </h2>
                <button
                  onClick={() => setIsTechnologiesOpen(false)}
                  className='text-gray-400 hover:text-white transition-colors'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='bg-[#252525] border border-gray-700 rounded-xl p-6'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                    <Globe className='text-blue-400' size={20} />
                    Frontend Technologies
                  </h3>
                  <div className='space-y-2'>
                    {techStack.frontend.map((tech, index) => (
                      <div key={index} className='flex items-center gap-2 text-sm'>
                        <CheckCircle size={12} className='text-green-400' />
                        <span className='text-gray-300'>{tech}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className='bg-[#252525] border border-gray-700 rounded-xl p-6'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                    <Database className='text-purple-400' size={20} />
                    Backend Services
                  </h3>
                  <div className='space-y-2'>
                    {techStack.backend.map((service, index) => (
                      <div key={index} className='flex items-center gap-2 text-sm'>
                        <CheckCircle size={12} className='text-green-400' />
                        <span className='text-gray-300'>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='mt-6 p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg'>
                <div className='flex items-center gap-2 mb-2'>
                  <Info className='text-blue-400' size={20} />
                  <h4 className='font-semibold text-blue-400'>Technology Summary</h4>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                  <div>
                    <span className='text-gray-400'>Total Packages:</span>
                    <span className='text-white ml-2 font-medium'>{techStack.frontend.length}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Backend Services:</span>
                    <span className='text-white ml-2 font-medium'>{techStack.backend.length}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Build Tool:</span>
                    <span className='text-white ml-2 font-medium'>Vite 4.4.5</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Framework:</span>
                    <span className='text-white ml-2 font-medium'>React 18.2.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
