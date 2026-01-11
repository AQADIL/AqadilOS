import React, { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, MeshDistortMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Lock, Unlock, ShieldAlert, Zap, Globe, MousePointer2, Trophy } from 'lucide-react';


const useGameMusic = (audioPath) => {
  const audioRef = useRef(null);
  
  useEffect(() => {

    const audio = new Audio(audioPath);
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioPath]);
  
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };
  
  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  
  return { playMusic, stopMusic };
};


const LEVELS = [
  { rings: 2, speed: 0.8, tolerance: 0.35 },
  { rings: 3, speed: 1.0, tolerance: 0.30 },
  { rings: 4, speed: 1.3, tolerance: 0.25 },
  { rings: 5, speed: 1.6, tolerance: 0.20 },
];

const COLORS = {
  NEON_CYAN: "#00f3ff",
  NEON_RED: "#ff0055",
  NEON_GREEN: "#00ff66",
  NEON_GOLD: "#ffae00",
  DARK_BG: "#050505",
};

const TEXTS = {
  ru: {
    title: "КИБЕР ЗАМОК",
    subtitle: "СИСТЕМА ЗАЩИТЫ",
    status_locked: "ЦЕЛЬ ЗАХВАЧЕНА",
    status_won: "ДОСТУП РАЗРЕШЕН",
    status_completed: "СИСТЕМА ВЗЛОМАНА",
    status_fail: "ОШИБКА",
    instruction_title: "КАК ИГРАТЬ:",
    instruction_1: "1. Ждите, пока разрыв кольца совпадет с линией справа.",
    instruction_2: "2. Нажмите ПРОБЕЛ или КЛИКНИТЕ, чтобы остановить кольцо.",
    instruction_tip: "Подсказка: Линия станет ЗЕЛЕНОЙ в правильный момент.",
    btn_start: "НАЖМИТЕ ЧТОБЫ НАЧАТЬ",
    btn_restart: "НАЖМИТЕ ДЛЯ ПЕРЕЗАГРУЗКИ",
    level: "УРОВЕНЬ",
    final_score: "ПОЛНЫЙ ДОСТУП ПОЛУЧЕН",
    btn_lang_switch: "ENG"
  },
  en: {
    title: "CYBER LOCK",
    subtitle: "SECURITY SYSTEM",
    status_locked: "TARGET LOCKED",
    status_won: "ACCESS GRANTED",
    status_completed: "SYSTEM COMPROMISED",
    status_fail: "BREACH FAILED",
    instruction_title: "HOW TO PLAY:",
    instruction_1: "1. Wait for the ring GAP to align with the line on the right.",
    instruction_2: "2. Press SPACE or CLICK ANYWHERE to lock the ring.",
    instruction_tip: "Tip: The line turns GREEN when timing is right.",
    btn_start: "CLICK OR SPACE TO START",
    btn_restart: "CLICK TO REBOOT SYSTEM",
    level: "LEVEL",
    final_score: "FULL ROOT ACCESS GRANTED",
    btn_lang_switch: "RUS"
  }
};




function Core({ isWon, isError }) {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.x = t * 0.5;
      mesh.current.rotation.y = t * 0.8;
      const scale = 1 + Math.sin(t * 4) * 0.05;
      mesh.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial 
          color={isError ? COLORS.NEON_RED : isWon ? COLORS.NEON_GREEN : COLORS.NEON_CYAN} 
          emissive={isError ? COLORS.NEON_RED : isWon ? COLORS.NEON_GREEN : COLORS.NEON_CYAN}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={1}
          distort={0.4} 
          speed={3} 
        />
      </mesh>
    </Float>
  );
}


const SecurityRing = forwardRef(({ radius, speed, index, isLocked, isCurrentTarget }, ref) => {
  const group = useRef();
  const rotationRef = useRef(Math.random() * Math.PI * 2);
  const isReverse = index % 2 !== 0; 

  useImperativeHandle(ref, () => ({
    getRotation: () => rotationRef.current
  }));

  useFrame((state, delta) => {
    if (isLocked) {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.15);
      return;
    }

    const rotSpeed = speed * (isReverse ? -1 : 1);
    rotationRef.current = (rotationRef.current + rotSpeed * delta) % (Math.PI * 2);
    if (rotationRef.current < 0) rotationRef.current += Math.PI * 2;
    
    group.current.rotation.z = rotationRef.current;
  });

  const segments = useMemo(() => {
    const count = 12 + index * 5;
    const items = [];
    for (let i = 0; i < count; i++) {
      if (i === 0) continue; 
      const angle = (i / count) * Math.PI * 2;
      items.push(
        <mesh key={i} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]} rotation={[0, 0, angle]}>
          <boxGeometry args={[0.2, 0.08, 0.05]} />
          <meshStandardMaterial 
            color="#222" 
            emissive={isLocked ? COLORS.NEON_GREEN : isCurrentTarget ? COLORS.NEON_CYAN : "#333"} 
            emissiveIntensity={isLocked ? 2 : isCurrentTarget ? 0.8 : 0} 
            toneMapped={false}
          />
        </mesh>
      );
    }
    return items;
  }, [index, radius, isLocked, isCurrentTarget]);

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      {segments}
      <mesh position={[radius, 0, 0]}>
         <sphereGeometry args={[0.08, 16, 16]} />
         <meshBasicMaterial color={COLORS.NEON_GOLD} />
      </mesh>
    </group>
  );
});


function TargetLine({ isAligned }) {
  return (
    <group position={[0, 0, -0.1]}>
      <mesh position={[3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <planeGeometry args={[0.05, 7]} />
        <meshBasicMaterial 
          color={isAligned ? COLORS.NEON_GREEN : COLORS.NEON_RED} 
          transparent 
          opacity={isAligned ? 0.8 : 0.2} 
        />
      </mesh>
      <mesh position={[4.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.5, 3]} />
        <meshBasicMaterial color={isAligned ? COLORS.NEON_GREEN : COLORS.NEON_CYAN} />
      </mesh>
    </group>
  );
}


function GameScene({ levelData, onWin, onFail, isPlaying, inputTrigger }) {
  const [activeRingIndex, setActiveRingIndex] = useState(0);
  const [isAligned, setIsAligned] = useState(false);
  const ringRefs = useRef([]);

  useEffect(() => {
    setActiveRingIndex(0);
    setIsAligned(false);
  }, [levelData]);

  useFrame(() => {
    if (!isPlaying || activeRingIndex >= levelData.rings) return;
    
    const currentRing = ringRefs.current[activeRingIndex];
    if (currentRing) {
      const angle = currentRing.getRotation();
      const dist = Math.min(Math.abs(angle), Math.abs(angle - Math.PI * 2));
      const aligned = dist < levelData.tolerance;
      setIsAligned(aligned);
    }
  });

  useEffect(() => {
    if (!isPlaying || inputTrigger === 0) return;

    const currentRing = ringRefs.current[activeRingIndex];
    if (currentRing) {
      const angle = currentRing.getRotation();
      const dist = Math.min(Math.abs(angle), Math.abs(angle - Math.PI * 2));

      if (dist < levelData.tolerance) {
        const nextIndex = activeRingIndex + 1;
        if (nextIndex >= levelData.rings) {
          onWin();
        } else {
          setActiveRingIndex(nextIndex);
        }
      } else {
        onFail();
      }
    }
  }, [inputTrigger]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <TargetLine isAligned={isAligned} />
      <Core isWon={activeRingIndex >= levelData.rings} isError={false} />

      {Array.from({ length: levelData.rings }).map((_, i) => (
        <SecurityRing 
          key={i} 
          ref={el => ringRefs.current[i] = el}
          index={i}
          radius={1.5 + i * 0.8}
          speed={levelData.speed * (1 + (levelData.rings - i) * 0.1)} 
          isLocked={i < activeRingIndex} 
          isCurrentTarget={i === activeRingIndex} 
        />
      ))}

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <ChromaticAberration offset={[0.002, 0.002]} />
      </EffectComposer>
    </>
  );
}


function HUD({ level, status, lives, lang, setLang }) {
  const t = TEXTS[lang];


  const handleLangSwitch = (e) => {
    e.stopPropagation();
    setLang(l => l === 'en' ? 'ru' : 'en');
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between z-10 select-none">
      
      {}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">
            {t.title}
          </h1>
          <div className="flex items-center gap-2 text-cyan-200 font-mono text-sm mt-1">
            <Zap size={14} />
            <span>{t.subtitle}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          {}
          <button 
            onClick={handleLangSwitch}
            className="flex items-center gap-2 bg-black/40 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-md text-sm text-cyan-400 font-mono transition-all active:scale-95"
          >
            <Globe size={16} />
            {lang === 'en' ? 'ENG' : 'RUS'}
          </button>
          
          <div className="text-right font-mono">
            <div className="text-xs text-gray-500">{t.level}</div>
            <div className="text-4xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
               {level} / 04
            </div>
          </div>
        </div>
      </div>

      {}
      {status !== 'playing' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/60 backdrop-blur-sm z-20">
          <div className="bg-black/90 border border-cyan-500/30 p-8 rounded-xl max-w-md w-full text-center shadow-[0_0_50px_rgba(0,243,255,0.2)] transform transition-all animate-in zoom-in duration-300">
            
            {status === 'start' && (
              <>
                <Lock size={64} className="mx-auto text-cyan-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">{t.instruction_title}</h2>
                
                <div className="text-left space-y-4 mb-8 bg-white/5 p-4 rounded border border-white/10">
                  <p className="text-gray-300 text-sm flex gap-3">
                    <span className="text-cyan-400 font-bold">»</span> {t.instruction_1}
                  </p>
                  <p className="text-gray-300 text-sm flex gap-3">
                    <span className="text-cyan-400 font-bold">»</span> {t.instruction_2}
                  </p>
                  <p className="text-yellow-400 text-xs mt-2 border-t border-white/10 pt-2">
                    ⚠ {t.instruction_tip}
                  </p>
                </div>

                <button 
                  onClick={handleLangSwitch}
                  className="flex items-center justify-center gap-2 bg-black/40 hover:bg-cyan-500/20 border border-cyan-500/30 px-4 py-2 rounded-md text-sm text-cyan-400 font-mono transition-all active:scale-95 mx-auto mb-4"
                >
                  <Globe size={16} />
                  {t.btn_lang_switch}
                </button>

                <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm animate-bounce">
                  <MousePointer2 size={16} /> 
                  <span>{t.btn_start}</span>
                </div>
              </>
            )}

            {}
            {status === 'won' && (
              <>
                <Unlock size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">{t.status_won}</h2>
                <p className="text-green-400/80 mb-6 font-mono">LOADING_NEXT_LAYER...</p>
              </>
            )}

            {}
            {status === 'completed' && (
              <>
                <Trophy size={80} className="mx-auto text-yellow-500 mb-4 drop-shadow-[0_0_25px_rgba(255,200,0,0.6)]" />
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">{t.status_completed}</h2>
                <p className="text-yellow-100/80 mb-8 font-mono tracking-widest text-sm">{t.final_score}</p>
                <div className="text-xs text-white/50 animate-pulse">{t.btn_restart}</div>
              </>
            )}

            {status === 'gameover' && (
              <>
                <ShieldAlert size={64} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">{t.status_fail}</h2>
                <p className="text-red-400/80 mb-6 font-mono">CONNECTION_TERMINATED</p>
                <div className="text-xs text-white/50 animate-pulse">{t.btn_restart}</div>
              </>
            )}

          </div>
        </div>
      )}

      {}
      <div className="flex justify-between items-end">
        <div className="flex gap-2">
           {Array.from({length: 3}).map((_, i) => (
             <div key={i} className={`h-2 w-12 skew-x-12 border border-cyan-500/50 ${i < lives ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-transparent'}`}></div>
           ))}
        </div>
        <div className="text-xs text-gray-600 font-mono">
           VER 2.5.0
        </div>
      </div>
    </div>
  );
}


export default function CyberLock() {
  const [level, setLevel] = useState(1);
  const [status, setStatus] = useState('start');
  const [lives, setLives] = useState(3);
  const [lang, setLang] = useState('en'); 
  const [inputTrigger, setInputTrigger] = useState(0);
  const { playMusic, stopMusic } = useGameMusic('/music/audio/memory-reboot.mp3');
  

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        if (status === 'playing') {
          setInputTrigger(prev => prev + 1);
        } else {
          handleStart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  const handleGlobalClick = () => {

    if (status === 'playing') {
      setInputTrigger(prev => prev + 1);
    } else {
      handleStart();
    }
  };

  const handleStart = () => {
    if (status === 'gameover' || status === 'completed') {
      setLevel(1);
      setLives(3);
    }
    setStatus('playing');
    playMusic();
  };

  const handleGameOver = () => {
    setStatus('gameover');
    stopMusic();
  };

  const handleCompleted = () => {
    setStatus('completed');
    stopMusic();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#00f3ff', '#ff0055', '#00ff66', '#ffae00']
    });
  };

  const handleWin = () => {


    
    if (level < LEVELS.length) {
        setStatus('won');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: [COLORS.NEON_CYAN, COLORS.NEON_GREEN]
        });
        setTimeout(() => {
            setLevel(l => l + 1);
            setStatus('playing');
        }, 2000);
    } else {

        setStatus('completed');

        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: [COLORS.NEON_GOLD, COLORS.NEON_CYAN]
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: [COLORS.NEON_GOLD, COLORS.NEON_RED]
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
  };

  const handleFail = () => {
    if (lives > 1) {
      setLives(l => l - 1);
    } else {
      handleGameOver();
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-[#050505] overflow-hidden select-none cursor-pointer font-sans"
      onClick={handleGlobalClick}
    >
      <HUD level={level} status={status} lives={lives} lang={lang} setLang={setLang} />

      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={[COLORS.DARK_BG]} />
        <ambientLight intensity={0.5} />
        
        <GameScene 
          levelData={LEVELS[level - 1]} 
          onWin={handleWin}
          onFail={handleFail}
          isPlaying={status === 'playing'}
          inputTrigger={inputTrigger}
        />
      </Canvas>
    </div>
  );
}