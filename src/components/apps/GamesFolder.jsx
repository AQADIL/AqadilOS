import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { useWindowManager } from '../../hooks/useWindowManager';
import { APPS_CONFIG } from '../../data/appsConfig';


const GAMES = [
  { 
    id: 'systemOverride',
    name: "Cyber Lock", 
    appId: 'systemOverride'
  },
  { 
    id: 'devTycoon',
    name: "Dev Tycoon Pro", 
    appId: 'devTycoon'
  },
  { 
    id: 'neonDrift',
    name: "Neon Drift", 
    appId: 'neonDrift'
  },
  { 
    id: 'coming-soon',
    name: "More Games", 
    disabled: true
  }
];


const playSound = (type) => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(1000, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.log('Sound error:', e);
  }
};


export default function GamesFolder({ isOpen, onClose, onOpenApp, position }) {
  console.log('GamesFolder render, isOpen:', isOpen);

  const handleGameClick = (game) => {
    console.log('Game clicked:', game);
    
    if (game.disabled) {
      playSound('click');
      return;
    }
    
    playSound('click');
    if (game.appId) {
      console.log('Opening app with ID:', game.appId);
      onOpenApp(game.appId);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]"
          onClick={onClose}
        >
          <div 
            className="absolute flex items-center justify-center"
            style={{
              top: position?.top || '50%',
              left: position?.left || '50%',
              transform: position ? 'translate(0, -50%)' : 'translate(-50%, -50%)'
            }}
          >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl p-5 max-w-lg w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Gamepad2 size={20} className="text-purple-500" />
                Games
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-slate-600"
              >
                ×
              </button>
            </div>

            {}
            <div className="grid grid-cols-2 gap-3">
              {GAMES.map((game, index) => {
                const appConfig = APPS_CONFIG[game.appId];
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleGameClick(game)}
                    className={`
                      relative group overflow-hidden bg-white border border-slate-200 rounded-xl p-4
                      hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer
                      ${game.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                    `}
                  >
                    {}
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-3 bg-white border border-slate-200 shadow-sm">
                      {game.disabled ? (
                        <Gamepad2 size={24} className="text-slate-400" />
                      ) : (
                        appConfig?.icon || <Gamepad2 size={24} className="text-slate-600" />
                      )}
                    </div>

                    {}
                    <div className="text-center">
                      <h3 className="text-slate-800 font-semibold text-sm mb-1">
                        {game.disabled ? game.name : (appConfig?.title || game.name)}
                      </h3>
                      {game.disabled && (
                        <p className="text-slate-500 text-xs">Coming Soon</p>
                      )}
                    </div>

                    {}
                    {!game.disabled && (
                      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {}
            <div className="text-center mt-5 text-slate-500 text-sm">
              Click any game to launch
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
