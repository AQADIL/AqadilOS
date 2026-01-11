import React from 'react';
import { Monitor, Check } from 'lucide-react';
import { useOS, WALLPAPERS } from '../os/OSContext';


export default function SettingsApp() {
  const { wallpaper, setWallpaper } = useOS();

  return (
    <div className="w-full h-full bg-[#f3f9ff] dark:bg-[#121212] text-gray-900 dark:text-white flex font-sans">
      {}
      <div className="w-64 bg-gray-50 dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-white/5 p-4">
        <h2 className="text-xl font-bold mb-6 px-2">Personalization</h2>
        <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Monitor size={16} />
          Background
        </div>
      </div>

      {}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Select Theme</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => setWallpaper(wp)}
                className={`relative aspect-video rounded-xl overflow-hidden border-4 transition-all ${
                  wallpaper.id === wp.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <img src={wp.url} className="w-full h-full object-cover" alt={wp.name} />
                {wallpaper.id === wp.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check size={12} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-white/10 mb-8" />
      </div>
    </div>
  );
}
