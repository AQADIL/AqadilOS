import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import Explorer from '../apps/Explorer';
import BrowserApp from '../apps/Browser';
import ExternalLinkApp from '../apps/ExternalLinkApp';

const WindowControl = ({ icon: Icon, onClick, isDanger }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }} 
    className={`p-2 rounded-md transition-colors window-control-btn ${isDanger ? 'hover:bg-red-500/80' : 'hover:bg-white/10'}`}
  >
    <Icon size={14} />
  </button>
);


const GameTooltip = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <div className="absolute top-full right-0 mt-1 bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg border border-gray-700 whitespace-nowrap z-50">
      For the best experience, open window in fullscreen
      <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 transform rotate-45"></div>
    </div>
  );
};

export default function WindowFrame({ windowData, onClose, onMinimize, onFocus, isActive, updateWindowState, onOpenApp }) {
  const { id, config, position, size, customComponent, customProps } = windowData;
  const [isMaximized, setIsMaximized] = useState(!!windowData.maximized);
  const [preMaxSize, setPreMaxSize] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  
  const constraintsRef = useRef(null);
  const windowRef = useRef(null);


  const isGame = ['neonDrift', 'systemOverride', 'devTycoon'].includes(id);


  useEffect(() => {
    if (config.id === 'github' || config.id === 'telegram' || config.id === 'akadiledu') {
      const timer = setTimeout(() => {
        onClose(id);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [id, config.id, onClose]);


  useEffect(() => {
    if (isGame && !isMaximized) {
      setShowTooltip(true);

      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isGame, isMaximized]);


  useEffect(() => {
    const win = windowRef.current;
    if (!win) return;

    const handleResize = (e) => {

      const newWidth = e.clientX - win.getBoundingClientRect().left;
      const newHeight = e.clientY - win.getBoundingClientRect().top;
      

      if (newWidth > 300 && newHeight > 200) {
        updateWindowState(prev => prev.map(w => w.id === id ? { ...w, size: { width: newWidth, height: newHeight } } : w));
      }
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
      document.body.style.cursor = 'default';
    };

    const initResize = (e) => {
      e.stopPropagation();
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      document.body.style.cursor = 'nwse-resize';
    };

    const resizer = win.querySelector('.resizer-handle');
    if (!resizer) return;
    resizer.addEventListener('mousedown', initResize);

    return () => resizer.removeEventListener('mousedown', initResize);
  }, [id, updateWindowState]);


  const toggleMaximize = () => {

    setShowTooltip(false);
    
    if (isMaximized) {
      if (preMaxSize) {
        updateWindowState(prev => prev.map(w => w.id === id ? { ...w, position: preMaxSize.pos, size: preMaxSize.size } : w));
      } else {
        updateWindowState(prev => prev.map(w => w.id === id ? { ...w, position, size } : w));
      }
    } else {
      setPreMaxSize({ pos: position, size: size });
      updateWindowState(prev => prev.map(w => w.id === id ? { 
        ...w, 
        position: { x: 0, y: 0 }, 
        size: { width: window.innerWidth, height: window.innerHeight - 48 }
      } : w));
    }
    setIsMaximized(!isMaximized);
    onFocus(id);
  };

  return (
    <>
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-0" />
      <motion.div
        ref={windowRef}
        drag={!isMaximized}
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0}
        dragListener={false}
        dragPropagation={false}
        initial={position}
        animate={{ ...position, width: size.width, height: size.height, scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
        transition={{
          x: { type: 'tween', duration: 0 },
          y: { type: 'tween', duration: 0 },
          width: { type: 'spring', stiffness: 260, damping: 30 },
          height: { type: 'spring', stiffness: 260, damping: 30 },
          default: { type: 'tween', duration: 0 }
        }}
        onMouseDown={() => onFocus(id)}
        className={`absolute flex flex-col overflow-hidden rounded-lg backdrop-blur-2xl bg-os-glass border transition-shadow duration-200 ${isActive ? 'border-os-accent/50 shadow-win-active z-10' : 'border-os-border shadow-win-inactive z-0'} window-frame`}
        data-component-name="WindowFrame"
        style={{ 
          width: size.width, 
          height: size.height,
          touchAction: 'none'
        }}
      >
        {}
        <div 
          className="h-10 flex items-center justify-between px-3 select-none bg-white/5 border-b border-os-border" 
          onDoubleClick={toggleMaximize}
        >
          <div 
            className="flex items-center gap-3 text-sm font-medium text-black flex-1 titlebar-drag-area cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              if (!isMaximized) {
                e.stopPropagation();
                const startX = e.clientX - position.x;
                const startY = e.clientY - position.y;
                
                const handleMouseMove = (moveEvent) => {
                  const newX = moveEvent.clientX - startX;
                  const newY = moveEvent.clientY - startY;
                  
                  const visualViewport = window.visualViewport || window;
                  const maxX = visualViewport.width - size.width;
                  const maxY = visualViewport.height - size.height - 48;
                  
                  updateWindowState(prev => prev.map(w => w.id === id ? { 
                    ...w, 
                    position: { 
                      x: Math.max(0, Math.min(newX, maxX)), 
                      y: Math.max(0, Math.min(newY, maxY))
                    } 
                  } : w));
                };
                
                const handleTouchMove = (moveEvent) => {
                  if (moveEvent.touches.length > 0) {
                    const touch = moveEvent.touches[0];
                    const newX = touch.clientX - startX;
                    const newY = touch.clientY - startY;
                    
                    const visualViewport = window.visualViewport || window;
                    const maxX = visualViewport.width - size.width;
                    const maxY = visualViewport.height - size.height - 48;
                    
                    updateWindowState(prev => prev.map(w => w.id === id ? { 
                      ...w, 
                      position: { 
                        x: Math.max(0, Math.min(newX, maxX)), 
                        y: Math.max(0, Math.min(newY, maxY))
                      } 
                    } : w));
                  }
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }
            }}
          >
            {React.cloneElement(config.icon, { 
              size: 16,
              style: config.icon.type === 'img' ? { width: 21, height: 21 } : {}
            })}
            <span>{config.title}</span>
          </div>
          <div className="flex items-center gap-1 relative">
            <WindowControl icon={Minus} onClick={() => onMinimize(id)} />
            <div className="relative">
              <WindowControl icon={isMaximized ? Square : Maximize2} onClick={toggleMaximize} />
              <GameTooltip visible={showTooltip} />
            </div>
            <WindowControl icon={X} onClick={() => onClose(id)} isDanger />
          </div>
        </div>

        {}
        <div className="flex-1 overflow-auto bg-[#121212]/90 text-os-text cursor-default relative">
          {customComponent ? (
            React.isValidElement(customComponent) ? customComponent : React.cloneElement(customComponent, { onOpenApp, onClose: () => onClose(id), ...customProps })
          ) : (

            config.id === 'explorer' ? <Explorer onOpenApp={onOpenApp} /> :
            config.id === 'browser' ? <BrowserApp onOpenApp={onOpenApp} /> :
            config.component    
          )}
  
          {!isMaximized && <div className="resizer-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-20 bg-transparent hover:bg-white/10 rounded-tl-lg"></div>}
        </div>
      </motion.div>
    </>
  );
}
