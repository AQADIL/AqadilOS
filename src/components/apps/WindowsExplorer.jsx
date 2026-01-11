import React, { useState } from 'react';
import { FolderOpen, FileText, ChevronRight, ChevronDown, HardDrive, Search, Home, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Grid, List } from 'lucide-react';
import { PROJECT_STRUCTURE } from '../../data/projectStructure';

export default function WindowsExplorer({ isOpen, onClose, projectPath }) {
  const [currentPath, setCurrentPath] = useState(projectPath);
  const [expandedFolders, setExpandedFolders] = useState(new Set([PROJECT_STRUCTURE.name]));
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [navigationHistory, setNavigationHistory] = useState([projectPath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const getCurrentFolder = () => {

    if (!currentPath || !projectPath || !currentPath.startsWith(projectPath)) {
      return PROJECT_STRUCTURE;
    }


    const relativePath = currentPath.slice(projectPath.length).replace(/^\\+/, '');


    if (!relativePath) {
      return PROJECT_STRUCTURE;
    }

    const parts = relativePath.split('\\').filter(Boolean);

    let current = PROJECT_STRUCTURE;

    for (const part of parts) {
      const children = current.children || current.files || [];
      const nextFolder = children.find(
        (item) => item.type === 'folder' && item.name === part
      );

      if (nextFolder) {
        current = nextFolder;
      } else {

        break;
      }
    }

    return current;
  };

  const navigateToFolder = (folderName) => {
    const newPath = `${currentPath}\\${folderName}`;
    setCurrentPath(newPath);
    updateExpandedFoldersForPath(newPath);
    

    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(newPath);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const updateExpandedFoldersForPath = (path) => {
    const pathParts = path.split('\\').filter(part => part);
    const newExpanded = new Set();
    
    let currentPathSoFar = pathParts[0]; 
    for (let i = 1; i < pathParts.length; i++) {
      currentPathSoFar += `\\${pathParts[i]}`;
      newExpanded.add(pathParts[i]);
    }
    
    setExpandedFolders(newExpanded);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousPath = navigationHistory[newIndex];
      setCurrentPath(previousPath);
      updateExpandedFoldersForPath(previousPath);
      setHistoryIndex(newIndex);
    } else {

      const pathParts = currentPath.split('\\').filter(part => part);
      if (pathParts.length > 1) {
        const newPath = pathParts.slice(0, -1).join('\\');
        setCurrentPath(newPath);
        updateExpandedFoldersForPath(newPath);
        

        const newHistory = [currentPath];
        setNavigationHistory(newHistory);
        setHistoryIndex(0);
      }
    }
  };

  const goForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const nextPath = navigationHistory[newIndex];
      setCurrentPath(nextPath);
      updateExpandedFoldersForPath(nextPath);
      setHistoryIndex(newIndex);
    }
  };

  const goUp = () => {
    const pathParts = currentPath.split('\\').filter(part => part);
    if (pathParts.length > 1) {
      const newPath = pathParts.slice(0, -1).join('\\');
      setCurrentPath(newPath);
      updateExpandedFoldersForPath(newPath);
      

      const newHistory = navigationHistory.slice(0, historyIndex + 1);
      newHistory.push(newPath);
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const refresh = () => {

    setCurrentPath(currentPath); 
  };

  const goHome = () => {
    setCurrentPath(projectPath);
    updateExpandedFoldersForPath(projectPath);
    

    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(projectPath);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const openFile = (fileName) => {
    console.log(`Opening file: ${fileName}`);


    alert(`Opening file: ${fileName}`);
  };

  const navigateToPath = (path) => {
    setCurrentPath(path);
    updateExpandedFoldersForPath(path);
  };

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderName)) {
        newSet.delete(folderName);
      } else {
        newSet.add(folderName);
      }
      return newSet;
    });
  };

  const renderFileTree = (items, level = 0) => {
    if (!items) return null;
    
    return items.map((item, index) => {
      const isExpanded = expandedFolders.has(item.name);
      const hasChildren = item.children && item.children.length > 0;
      
      return (
        <div key={`${item.name}-${index}`}>
          <div
            className='flex items-center gap-1 px-1 py-0.5 hover:bg-blue-500/20 cursor-pointer text-xs'
            style={{ paddingLeft: `${level * 12 + 4}px` }}
            onClick={() => {
              if (item.type === 'folder') {
                if (hasChildren) {
                  toggleFolder(item.name);
                } else {
                  navigateToFolder(item.name);
                }
              }
              setSelectedItem(item.name);
            }}
          >
            {item.type === 'folder' && (
              <span className='w-3 h-3 flex items-center justify-center'>
                {hasChildren ? (
                  isExpanded ? <ChevronDown size={10} /> : <ChevronRight size={10} />
                ) : (
                  <FolderOpen size={10} />
                )}
              </span>
            )}
            {item.type === 'file' && <FileText size={10} />}
            <span className='truncate text-gray-300'>{item.name}</span>
          </div>
          {item.type === 'folder' && hasChildren && isExpanded && (
            renderFileTree(item.children, level + 1)
          )}
        </div>
      );
    });
  };

  const renderMainContent = () => {
    const currentFolder = getCurrentFolder();

    const items = currentFolder.children || currentFolder.files || [];
    
    if (viewMode === 'list') {
      return (
        <table className='w-full text-sm'>
          <thead className='bg-[#252525] border-b border-gray-700'>
            <tr>
              <th className='text-left px-2 py-1 text-gray-400'>Name</th>
              <th className='text-left px-2 py-1 text-gray-400'>Date modified</th>
              <th className='text-left px-2 py-1 text-gray-400'>Type</th>
              <th className='text-left px-2 py-1 text-gray-400'>Size</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={`${item.name}-${index}`}
                className={`hover:bg-blue-500/20 cursor-pointer ${selectedItem === item.name ? 'bg-blue-500/30' : ''}`}
                onClick={() => setSelectedItem(item.name)}
                onDoubleClick={() => {
                  if (item.type === 'folder') {
                    navigateToFolder(item.name);
                  } else {
                    openFile(item.name);
                  }
                }}
              >
                <td className='px-2 py-1 border-b border-gray-700 flex items-center gap-2'>
                  {item.type === 'folder' ? <FolderOpen size={16} className='text-white' /> : <FileText size={16} className='text-gray-400' />}
                  <span className='text-gray-300'>{item.name}</span>
                </td>
                <td className='px-2 py-1 border-b border-gray-700 text-gray-400'>-</td>
                <td className='px-2 py-1 border-b border-gray-700 text-gray-400'>{item.type === 'folder' ? 'File folder' : 'File'}</td>
                <td className='px-2 py-1 border-b border-gray-700 text-gray-400'>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <div className='grid grid-cols-8 gap-4 p-4'>
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className={`flex flex-col items-center p-2 hover:bg-blue-500/20 cursor-pointer rounded ${selectedItem === item.name ? 'bg-blue-500/30' : ''}`}
              onClick={() => setSelectedItem(item.name)}
              onDoubleClick={() => {
                if (item.type === 'folder') {
                  navigateToFolder(item.name);
                } else {
                  openFile(item.name);
                }
              }}
            >
              {item.type === 'folder' ? <FolderOpen size={32} className='text-white' /> : <FileText size={32} className='text-gray-400' />}
              <span className='text-xs text-center mt-1 truncate w-full text-gray-300'>{item.name}</span>
            </div>
          ))}
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className='h-full flex flex-col bg-[#181818] text-gray-300'>
      <div className='bg-[#252525] border-b border-gray-700 px-2 py-1 flex items-center gap-2'>
        <button onClick={goBack} className='p-1 hover:bg-[#333333] rounded text-white'>
          <ArrowLeft size={16} />
        </button>
        <button onClick={goForward} className='p-1 hover:bg-[#333333] rounded text-white'>
          <ArrowRight size={16} />
        </button>
        <button onClick={goUp} className='p-1 hover:bg-[#333333] rounded text-white'>
          <ArrowUp size={16} />
        </button>
        <button onClick={refresh} className='p-1 hover:bg-[#333333] rounded text-white'>
          <RotateCcw size={16} />
        </button>
        <div className='border-l border-gray-600 h-4 mx-1'></div>
        <button onClick={goHome} className='p-1 hover:bg-[#333333] rounded text-white'>
          <Home size={16} />
        </button>
        <div className='flex-1 flex items-center bg-[#333333] border border-gray-600 rounded px-2 py-1'>
          <Search size={16} className='text-white mr-2' />
          <input
            type='text'
            value={currentPath}
            readOnly
            className='flex-1 outline-none text-sm bg-transparent text-gray-300'
          />
        </div>
      </div>

      <div className='flex-1 flex overflow-hidden'>
        <div className='w-48 bg-[#202020] border-r border-gray-700 overflow-y-auto p-2'>
          <div className='mb-2'>
            <div className='flex items-center gap-1 px-2 py-1 hover:bg-blue-500/20 cursor-pointer font-medium text-sm text-gray-300'>
              <HardDrive size={14} className="text-white" />
              Local Disk (C:)
            </div>
            {renderFileTree([PROJECT_STRUCTURE], 0)}
          </div>
        </div>

        <div className='flex-1 flex flex-col'>
          <div className='bg-[#252525] border-b border-gray-700 px-2 py-1 flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-[#333333] text-black'}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-[#333333] text-black'}`}
              >
                <Grid size={16} />
              </button>
            </div>
            <div className='text-xs text-gray-400'>
              {(getCurrentFolder().children?.length || getCurrentFolder().files?.length || 0)} items
            </div>
          </div>

          <div className='flex-1 bg-[#181818] overflow-auto'>
            {renderMainContent()}
          </div>
        </div>
      </div>

      <div className='bg-[#252525] border-t border-gray-700 px-2 py-1 flex items-center justify-between text-xs text-gray-400'>
        <div>
          {selectedItem ? `${selectedItem} selected` : 'No items selected'}
        </div>
        <div>
          {(getCurrentFolder().children?.length || getCurrentFolder().files?.length || 0)} objects
        </div>
      </div>
    </div>
  );
}