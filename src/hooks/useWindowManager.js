import { useState } from 'react';
import { APPS_CONFIG } from '../data/appsConfig';

export const useWindowManager = () => {
  const [windows, setWindows] = useState([]);
  const [activeWindowId, setActiveWindowId] = useState(null);


  const focusWindow = (id) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const win = prev.find(w => w.id === id);
      if (!win) return prev;

      const filtered = prev.filter(w => w.id !== id);
      return [...filtered, win];
    });
  };

  const openApp = (appIdOrConfig) => {

    const isMobile = window.innerWidth < 768;
    const visualViewport = window.visualViewport || window;
    const availableHeight = visualViewport.height - 48;
    

    if (typeof appIdOrConfig === 'object') {
      const newWindow = {
        id: appIdOrConfig.id,
        config: {
          id: appIdOrConfig.id,
          title: appIdOrConfig.title,
          icon: appIdOrConfig.icon,
          component: null,
          defaultSize: { width: 900, height: 600 },
          isExternal: false,
        },
        minimized: false,
        position: { x: 100 + windows.length * 30, y: 50 + windows.length * 30 },
        size: { width: 900, height: 600 },
        customComponent: appIdOrConfig.component,
        customProps: appIdOrConfig.props || {}
      };
      
      setWindows(prev => {
        const existing = prev.find(w => w.id === appIdOrConfig.id);
        if (existing) {
          if (existing.minimized) {
            return prev.map(w => w.id === appIdOrConfig.id ? { ...w, minimized: false } : w);
          }
          return prev;
        }
        return [...prev, newWindow];
      });
      focusWindow(appIdOrConfig.id);
      return;
    }


    const config = APPS_CONFIG[appIdOrConfig];
    const shouldMaximize = appIdOrConfig === 'donate' || isMobile;
    const maximizedSize = { width: visualViewport.width, height: availableHeight };
    const mobileSize = config.mobileSize || { width: '95vw', height: '80vh' };
    
    setWindows(prev => {
      const existing = prev.find(w => w.id === appIdOrConfig);
      if (existing) {

        if (existing.minimized) {
           return prev.map(w => w.id === appIdOrConfig ? { ...w, minimized: false } : w);
        }
        return prev;
      }

      const newWindow = {
        id: appIdOrConfig,
        config,
        minimized: false,
        position: shouldMaximize ? { x: 0, y: 0 } : { x: 100 + prev.length * 30, y: 50 + prev.length * 30 },
        size: shouldMaximize ? maximizedSize : (isMobile ? mobileSize : config.defaultSize),
        maximized: shouldMaximize
      };
      return [...prev, newWindow];
    });
    focusWindow(appIdOrConfig);
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id) => {
    setWindows(prev => prev.map(w => {
        if (w.id === id) {
            const newMinimizedState = !w.minimized;

            if (!newMinimizedState) setActiveWindowId(id); 
            return { ...w, minimized: newMinimizedState };
        }
        return w;
    }));
  };

  return {
    windows,
    activeWindowId,
    openApp,
    closeWindow,
    toggleMinimize,
    focusWindow,
    setWindows
  };
};
