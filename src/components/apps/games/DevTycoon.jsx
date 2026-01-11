import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox, Environment, Stage, ContactShadows, Instance, Instances } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Terminal, Cpu, Coffee, Zap, Keyboard, Server, Globe, ShieldCheck, Rocket } from 'lucide-react';



const RANKS = [
  { title: "Intern", minXp: 0 },
  { title: "Junior Dev", minXp: 500 },
  { title: "Middle Dev", minXp: 2000 },
  { title: "Senior Dev", minXp: 8000 },
  { title: "Tech Lead", minXp: 25000 },
  { title: "CTO", minXp: 100000 },
  { title: "AI Overlord", minXp: 1000000 },
];

const UPGRADES = [
  { id: 'coffee', name: "Double Espresso", icon: Coffee, baseCost: 15, costMult: 1.2, type: 'click', value: 1, desc: "Caffeine boost. +1 Click Power." },
  { id: 'mech_kb', name: "Mech Keyboard", icon: Keyboard, baseCost: 100, costMult: 1.3, type: 'click', value: 5, desc: "Clicky sounds! +5 Click Power." },
  { id: 'chatgpt', name: "Copilot AI", icon: Cpu, baseCost: 500, costMult: 1.4, type: 'passive', value: 5, desc: "Code writes itself. +5 $/sec." },
  { id: 'server', name: "Cloud Server", icon: Server, baseCost: 2000, costMult: 1.5, type: 'passive', value: 25, desc: "Deploy faster. +25 $/sec." },
  { id: 'rust', name: "Rewrite in Rust", icon: Zap, baseCost: 8000, costMult: 1.6, type: 'click', value: 50, desc: "Blazingly fast. +50 Click Power." },
  { id: 'crypto', name: "Crypto ICO", icon: Globe, baseCost: 50000, costMult: 1.8, type: 'passive', value: 200, desc: "To the moon! +200 $/sec." },
];

const THEME = {
  primary: "#007acc",
  secondary: "#ff0055",
  accent: "#00ff88",
  bg: "#1e1e1e",
  text: "#ffffff"
};




const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

const playSound = (type) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'click') {

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } 
  else if (type === 'buy') {

    osc.type = 'sine';
    

    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  } 
  else if (type === 'levelup') {

    const playNote = (freq, delay) => {
      const o = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      o.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      o.type = 'square';
      o.frequency.value = freq;
      
      gainNode.gain.setValueAtTime(0.1, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.5);
      
      o.start(now + delay);
      o.stop(now + delay + 0.5);
    };


    playNote(440, 0);
    playNote(554.37, 0.1);
    playNote(659.25, 0.2);
    playNote(880, 0.4);
  }
};
  



function CodeParticles({ count = 20 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  

  const particles = useMemo(() => {
    return new Array(count).fill().map(() => ({
      position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 5 - 5],
      factor: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.02 + 0.01
    }));
  }, [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {

      particle.position[1] += particle.speed;
      if (particle.position[1] > 5) particle.position[1] = -5;

      dummy.position.set(particle.position[0], particle.position[1], particle.position[2]);
      dummy.scale.setScalar(particle.factor);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color={THEME.primary} transparent opacity={0.4} />
    </instancedMesh>
  );
}


function HeroButton({ active, onClick }) {
  const mesh = useRef();

  useFrame((state, delta) => {
    if (mesh.current) {

      const targetScale = active ? 0.9 : 1;
      const targetY = active ? -0.2 : 0;
      
      mesh.current.scale.x = THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1);
      mesh.current.scale.y = THREE.MathUtils.lerp(mesh.current.scale.y, targetScale, 0.1);
      mesh.current.scale.z = THREE.MathUtils.lerp(mesh.current.scale.z, targetScale, 0.1);
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.1);
    }
  });

  return (
    <group onClick={onClick}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <group ref={mesh}>
          
          {}
          <RoundedBox args={[2.5, 1, 2.5]} radius={0.2} smoothness={4}>
            <meshStandardMaterial 
              color={active ? THEME.secondary : THEME.primary}
              roughness={0.3} 
              metalness={0.8}
              emissive={active ? THEME.secondary : THEME.primary}
              emissiveIntensity={active ? 0.5 : 0.1}
            />
          </RoundedBox>

          {}
          <Text 
            position={[0, 0.51, 0]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            fontSize={0.35} 
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {"<CODE />"}
          </Text>

        </group>
      </Float>

      {}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      
      {}
      <ContactShadows position={[0, -1.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
    </group>
  );
}



export default function DevTycoonPro() {

  const [money, setMoney] = useState(0);
  const [xp, setXp] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [passiveIncome, setPassiveIncome] = useState(0);
  const [purchased, setPurchased] = useState({});


  const [active, setActive] = useState(false);
  const [popups, setPopups] = useState([]);
  

  const currentRank = RANKS.slice().reverse().find(r => xp >= r.minXp) || RANKS[0];
  const nextRank = RANKS.find(r => r.minXp > xp);
  const progress = nextRank 
    ? ((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100 
    : 100;


  useEffect(() => {
    if (passiveIncome === 0) return;
    const interval = setInterval(() => {
      setMoney(m => m + passiveIncome);
    }, 1000);
    return () => clearInterval(interval);
  }, [passiveIncome]);


  const handleClick = useCallback(() => {

    setMoney(m => m + clickPower);
    setXp(x => x + clickPower);
    playSound('click');


    const id = Date.now() + Math.random();

    const x = (Math.random() - 0.5) * 100; 
    const y = (Math.random() - 0.5) * 50;
    
    setPopups(prev => [...prev, { id, val: clickPower, x, y }]);
    

    setActive(true);
    setTimeout(() => setActive(false), 100);


    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, [clickPower]);


  const buyUpgrade = (upgrade) => {
    const count = purchased[upgrade.id] || 0;
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, count));

    if (money >= cost) {
      setMoney(m => m - cost);
      setPurchased(prev => ({ ...prev, [upgrade.id]: count + 1 }));
      
      if (upgrade.type === 'click') setClickPower(p => p + upgrade.value);
      if (upgrade.type === 'passive') setPassiveIncome(p => p + upgrade.value);
      
      playSound('buy');
    }
  };

  return (
    <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden select-none font-mono text-white">
      
      {}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
        
        {}
        <div className="flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl pointer-events-auto">
            <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ${Math.floor(money).toLocaleString()}
            </h1>
            <div className="flex gap-4 text-xs text-gray-400 mt-2">
              <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-400"/> {clickPower}/click</span>
              <span className="flex items-center gap-1"><Terminal size={12} className="text-green-400"/> {passiveIncome}/sec</span>
            </div>
          </div>

          <div className="text-right">
             <div className="text-2xl font-bold text-white">{currentRank.title}</div>
             <div className="text-xs text-gray-500 mb-1">XP: {Math.floor(xp).toLocaleString()}</div>
             {}
             <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden ml-auto">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
             </div>
          </div>
        </div>

        {}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {popups.map(p => (
            <div 
              key={p.id} 
              className="absolute text-2xl font-bold text-green-400 animate-out fade-out slide-out-to-top duration-700"
              style={{ transform: `translate(${p.x}px, ${p.y - 100}px)` }}
            >
              +${p.val}
            </div>
          ))}
        </div>

        {}
        <div className="pointer-events-auto w-full max-w-4xl mx-auto bg-black/80 backdrop-blur-xl border-t border-white/10 rounded-t-2xl max-h-[35vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {UPGRADES.map(u => {
               const count = purchased[u.id] || 0;
               const cost = Math.floor(u.baseCost * Math.pow(u.costMult, count));
               const canAfford = money >= cost;

               return (
                 <button 
                   key={u.id}
                   onClick={() => buyUpgrade(u)}
                   disabled={!canAfford}
                   className={`
                     relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 group
                     ${canAfford 
                        ? 'bg-white/5 border-white/10 hover:bg-blue-500/20 hover:border-blue-500' 
                        : 'bg-black/40 border-transparent opacity-50 grayscale cursor-not-allowed'}
                   `}
                 >
                   <div className={`p-2 rounded bg-black/50 ${canAfford ? 'text-blue-400' : 'text-gray-600'}`}>
                     <u.icon size={20} />
                   </div>
                   
                   <div className="text-left flex-1">
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-gray-200">{u.name}</span>
                        <span className="text-xs text-gray-500 bg-white/10 px-1 rounded">Lvl {count}</span>
                     </div>
                     <div className="text-[10px] text-gray-400 leading-tight my-0.5">{u.desc}</div>
                     <div className={`text-xs font-mono font-bold mt-1 ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                        ${cost.toLocaleString()}
                     </div>
                   </div>
                 </button>
               )
             })}
          </div>
        </div>
      </div>

      {}
      {}
      <div className="absolute inset-0 z-0" onPointerDown={handleClick}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 8], fov: 45 }}>
          
          {}
          <ambientLight intensity={0.4} />
          <spotLight position={[10, 10, 5]} angle={0.5} penumbra={1} intensity={2} castShadow color="#007acc" />
          <pointLight position={[-10, -5, -5]} intensity={1} color="#ff0055" />
          
          <Environment preset="city" blur={0.8} />

          {}
          <Stage intensity={0.5} environment={null} adjustCamera={false}>
            <HeroButton active={active} onClick={(e) => { e.stopPropagation(); handleClick(); }} />
          </Stage>
          
          <CodeParticles count={30} />

          {}
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.2} radius={0.6} />
            <Vignette eskil={false} offset={0.1} darkness={1.0} />
            <ChromaticAberration offset={[0.001, 0.001]} />
          </EffectComposer>

        </Canvas>
      </div>
    </div>
  );
}