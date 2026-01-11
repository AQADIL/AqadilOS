import React, { createContext, useContext, useState } from 'react';
import defaultWallpaper from '../../assets/wallpaper.jpg';



export const WALLPAPERS = [
  {
    id: 1,
    url: defaultWallpaper,
    name: 'aqadilOS Default',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&w=1920&q=80',
    name: 'Dark Mountains',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
    name: 'Orbital View',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    name: 'Abstract Liquid',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80',
    name: 'Cyberpunk City',
  },
];

const OSContext = createContext(null);

export const useOS = () => useContext(OSContext);

export const OSProvider = ({ children }) => {

  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);

  const value = {
    wallpaper,
    setWallpaper,
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};
