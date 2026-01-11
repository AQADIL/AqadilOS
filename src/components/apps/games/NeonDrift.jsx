import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Text, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Gamepad2 } from 'lucide-react';


const useGameMusic = () => {
  const audioRef = useRef(null);
  
  useEffect(() => {

    const audio = new Audio('/music/audio/spacey-supp.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
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

const LANE_WIDTH = 3;
const SPEED_INCREMENT = 0.001;
const INITIAL_SPEED = 0.4;



function Player({ position, isDead }) {
  const mesh = useRef();
  const [tilt, setTilt] = useState(0);

  useFrame((state) => {
    if (!mesh.current || isDead) return;
    

    mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, -position[0] * 0.1, 0.1);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, isDead ? 0.5 : 0, 0.1);
    
    mesh.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, position[0], 0.1);
  });

  return (
    <group ref={mesh} position={[0, 0.5, 0]}>

      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 0.4, 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>
      {}
      <mesh position={[0.51, 0, 0]}>
        <boxGeometry args={[0.05, 0.1, 1.8]} />
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </mesh>
      <mesh position={[-0.51, 0, 0]}>
        <boxGeometry args={[0.05, 0.1, 1.8]} />
        <meshBasicMaterial color="#00ffff" toneMapped={false} />
      </mesh>
      {}
      <mesh position={[0, 0, 1.01]}>
        <planeGeometry args={[0.8, 0.2]} />
        <meshBasicMaterial color="#ff0055" toneMapped={false} />
      </mesh>
       {}
       <mesh position={[0, 0, -1.01]}>
        <planeGeometry args={[0.8, 0.1]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}


function Track({ speed }) {
  const mesh = useRef();
  const offset = useRef(0);

  useFrame((_, delta) => {
    if (!mesh.current) return;

    offset.current -= speed * delta * 10;
    mesh.current.material.map.offset.y = offset.current;
  });

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = '#000000';
    context.fillRect(0, 0, 64, 64);

    context.strokeStyle = '#bc13fe';
    context.lineWidth = 2;
    context.strokeRect(0, 0, 64, 64);

    context.fillStyle = '#bc13fe';
    context.fillRect(30, 0, 4, 64);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(20, 20);
    return tex;
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]} receiveShadow ref={mesh}>
      <planeGeometry args={[100, 200]} />
      <meshStandardMaterial map={texture} roughness={0.1} metalness={0.1} />
    </mesh>
  );
}


function Obstacles({ obstacles }) {
  return (
    <>
      {obstacles.map((obs, i) => (
        <group key={obs.id} position={[obs.x, 0.5, obs.z]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 1, 1]} />
            <meshStandardMaterial color="#ff0000" wireframe />
          </mesh>
          {}
          <mesh>
            <boxGeometry args={[1.4, 0.9, 0.9]} />
            <meshBasicMaterial color="#ff0000" transparent opacity={0.5} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </>
  );
}


function GameScene({ isGameOver, setScore, setGameOver }) {
  const [playerX, setPlayerX] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const lastSpawnZ = useRef(-20);
  const scoreRef = useRef(0);
  const touchStartX = useRef(null);


  const isMobile = window.innerWidth < 768;


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || isMobile) return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerX((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerX((prev) => Math.min(prev + 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isMobile]);


  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (isGameOver || touchStartX.current === null) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX.current;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          setPlayerX((prev) => Math.min(prev + 1, 1));
        } else {
          setPlayerX((prev) => Math.max(prev - 1, -1));
        }
      }
      
      touchStartX.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isGameOver, isMobile]);


  useFrame((state, delta) => {
    if (isGameOver) return;


    setSpeed((prev) => Math.min(prev + SPEED_INCREMENT * delta, 1.5));


    setObstacles((prev) => {
      let next = prev
        .map((obs) => ({ ...obs, z: obs.z + speed }))
        .filter((obs) => obs.z < 10);


      for (let obs of next) {

        const playerZ = 0;
        const playerSize = 1;
        const obstacleSize = 1;
        

        const playerPos = { x: playerX * LANE_WIDTH, y: 0.5, z: playerZ };
        const obstaclePos = { x: obs.x, y: 0.5, z: obs.z };
        

        const dx = Math.abs(playerPos.x - obstaclePos.x);
        const dy = Math.abs(playerPos.y - obstaclePos.y);
        const dz = Math.abs(playerPos.z - obstaclePos.z);
        

        const collisionX = dx < (playerSize + obstacleSize) / 2;
        const collisionY = dy < (playerSize + obstacleSize) / 2;
        const collisionZ = dz < (playerSize + obstacleSize) / 2;
        

        if (collisionX && collisionY && collisionZ) {
          setGameOver(true);
          scoreRef.current = 0;
          setScore(0);
          break;
        }
      }
      return next;
    });


    if (obstacles.length < 5 || obstacles[obstacles.length - 1]?.z > -30) {
      if (Math.random() > 0.95) {
         const lane = Math.floor(Math.random() * 3) - 1;
         setObstacles(prev => [
           ...prev, 
           { id: Date.now(), x: lane * LANE_WIDTH, z: -100, lane }
         ]);
      }
    }


    if (!isGameOver) {
      scoreRef.current += speed;
      setScore(Math.floor(scoreRef.current));
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 6]} rotation={[-0.4, 0, 0]} />
      
      {}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <fog attach="fog" args={['#000000', 5, 80]} /> {}

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Player position={[playerX * LANE_WIDTH, 0, 0]} isDead={isGameOver} />
      <Track speed={isGameOver ? 0 : speed} />
      <Obstacles obstacles={obstacles} />

      {}
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.6} />
        <ChromaticAberration offset={[0.002, 0.002]} /> {}
      </EffectComposer>
    </>
  );
}


export default function NeonDrift() {
  const [isGameOver, setGameOver] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const { playMusic, stopMusic } = useGameMusic();

  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
    setScore(0);
    playMusic();
  };

  const handleGameOver = () => {
    setGameOver(true);
    stopMusic();
  };


  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && isGameOver) {
        e.preventDefault();
        startGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      {}
      <div className="absolute top-0 left-0 w-full z-10 p-4 flex justify-between pointer-events-none">
        <div className="text-white font-mono text-lg md:text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
          SCORE: <span className="text-purple-400">{score}</span>
        </div>
        <div className="text-white/50 text-xs md:text-sm font-mono text-right">
          <div className="hidden md:block">CONTROLS: ARROWS / A-D</div>
          <div className="md:hidden">SWIPE TO MOVE</div>
          <div>RESTART: ENTER / SPACE</div>
        </div>
      </div>

      {}
      {(isGameOver || !gameStarted) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <h1 className="text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
            NEON DRIFT
          </h1>
          {gameStarted && (
            <p className="text-red-500 font-mono text-xl mb-6 animate-pulse">
              SYSTEM FAILURE
            </p>
          )}
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm mb-4">AVOID THE RED BLOCKS</p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-lg rounded skew-x-[-10deg] transition-transform hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.6)]"
            >
              {gameStarted ? 'RESTART SYSTEM' : 'INITIATE SEQUENCE'}
            </button>
          </div>
        </div>
      )}

      {}
      <Canvas shadows dpr={[1, 2]}>
        <GameScene 
          isGameOver={isGameOver && gameStarted} 
          setScore={setScore} 
          setGameOver={handleGameOver} 
        />
      </Canvas>
    </div>
  );
}