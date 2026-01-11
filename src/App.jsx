import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowManager } from './hooks/useWindowManager';
import { SecurityProvider } from './components/SecurityGate';
import BootScreen from './components/BootScreen';
import DesktopIcons from './components/os/DesktopIcons';
import Taskbar from './components/os/Taskbar';
import WindowFrame from './components/os/WindowFrame';
import { OSProvider, useOS } from './components/os/OSContext';


const useStartupSound = (isBooted) => {
  useEffect(() => {
    if (isBooted) {
      const audio = new Audio('/music/audio/win11-startup.mp3');
      audio.volume = 0.7; 
      audio.play().catch(e => console.log('Startup sound play failed:', e));
    }
  }, [isBooted]);
};


const useSelectionBox = () => {
  useEffect(() => {
    let isSelecting = false;
    let startX = 0;
    let startY = 0;
    let selectionBox = null;

    const createSelectionBox = () => {
      const box = document.createElement('div');
      box.style.position = 'fixed';
      box.style.border = '1px dashed #4a90e2';
      box.style.backgroundColor = 'rgba(74, 144, 226, 0.2)';
      box.style.pointerEvents = 'none';
      box.style.zIndex = '9999';
      box.style.display = 'none';
      document.body.appendChild(box);
      return box;
    };

    const updateSelectionBox = (x1, y1, x2, y2) => {
      if (!selectionBox) return;
      
      const left = Math.min(x1, x2);
      const top = Math.min(y1, y2);
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);
      
      selectionBox.style.left = `${left}px`;
      selectionBox.style.top = `${top}px`;
      selectionBox.style.width = `${width}px`;
      selectionBox.style.height = `${height}px`;
      selectionBox.style.display = 'block';
    };

    const handleMouseDown = (e) => {

      if (e.button === 0 && !e.target.closest('button, input, a, [role="button"], .window-frame, [data-component-name="WindowFrame"]')) {
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        
        if (!selectionBox) {
          selectionBox = createSelectionBox();
        }
        
        updateSelectionBox(startX, startY, startX, startY);
      }
    };

    const handleMouseMove = (e) => {
      if (isSelecting) {
        updateSelectionBox(startX, startY, e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      if (isSelecting && selectionBox) {

        selectionBox.style.display = 'none';
      }
      isSelecting = false;
    };


    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (selectionBox && selectionBox.parentNode) {
        selectionBox.parentNode.removeChild(selectionBox);
      }
    };
  }, []);
};


const useRightClickBlock = () => {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleKeyDown = (e) => {

      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }

      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };


    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

function App() {
  return (
    <OSProvider>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </OSProvider>
  );
}

function AppContent() {
  const [isBooted, setIsBooted] = useState(false);
  const { 
    windows, 
    activeWindowId, 
    openApp, 
    closeWindow, 
    toggleMinimize, 
    focusWindow,
    setWindows 
  } = useWindowManager();
  const { wallpaper } = useOS();


  useStartupSound(isBooted);
  

  useRightClickBlock();
  

  useSelectionBox();

  return (
    <>
      <AnimatePresence>
        {!isBooted && <BootScreen onComplete={() => setIsBooted(true)} />}
      </AnimatePresence>
      
      {isBooted && (
        <div
          className='h-screen w-screen overflow-hidden relative'
          style={{
            backgroundImage: wallpaper ? `url(${wallpaper.url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >

          <DesktopIcons onOpenApp={openApp} />

          <AnimatePresence>
            {windows.map(win => !win.minimized && (
              <WindowFrame 
                key={win.id}
                windowData={win}
                onClose={closeWindow}
                onMinimize={toggleMinimize}
                onFocus={focusWindow}
                isActive={activeWindowId === win.id}
                updateWindowState={setWindows}
                onOpenApp={openApp}
              />
            ))}
          </AnimatePresence>

          <Taskbar 
            windows={windows} 
            activeId={activeWindowId} 
            onToggleMinimize={toggleMinimize}
            onOpenApp={openApp}
          />
          
        </div>
      )}
    </>
  );
}

export default App;
export { AppContent };
