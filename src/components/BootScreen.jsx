import React, { useState, useEffect } from 'react';

const bootLines = [
  'AqadilOS Kernel v2.5.0-generic #42 SMP PREEMPT Thu Dec 16 20:55:32 UTC 2025',
  'Initializing hardware...',
  'Loading kernel modules...',
  'Starting system services...',
  'Mounting file systems...',
  'Checking system integrity...',
  'Network interfaces: eth0 up, wlan0 scanning...',
  'System clock synchronized.',
  'AqadilOS v2.5.0 ready.',
  '',
  '[SYSTEM] Press F11 for maximum experience...',
  '[F11 STATUS] >>> WAITING FOR INPUT <<<'
];

export default function BootScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [f11Activated, setF11Activated] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (currentLine < bootLines.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, bootLines[currentLine]]);
        setCurrentLine(prev => prev + 1);
        

        if (currentLine === bootLines.length - 1) {
          setBootComplete(true);
        }
      }, Math.random() * 800 + 200);
      return () => clearTimeout(timeout);
    }
  }, [currentLine]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);


  const isMobile = () => {
    return window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };


  const handleKeyPress = (e) => {
    if (!bootComplete || f11Activated) return;
    
    if (e.key === 'F11') {
      setF11Activated(true);
      
      setLines(prev => {
        const newLines = [...prev];
        const statusIndex = newLines.findIndex(line => line.includes('[F11 STATUS]'));
        if (statusIndex !== -1) {
          newLines[statusIndex] = '[F11 STATUS] >>> ACTIVATED <<<';
        }
        return newLines;
      });
      
      console.log('[F11 PROTOCOL] MAXIMUM EXPERIENCE ACTIVATED');
      setTimeout(onComplete, 1000);
    }
  };


  useEffect(() => {
    if (bootComplete && !f11Activated && isMobile()) {
      setF11Activated(true);
      setLines(prev => {
        const newLines = [...prev];
        const statusIndex = newLines.findIndex(line => line.includes('[F11 STATUS]'));
        if (statusIndex !== -1) {
          newLines[statusIndex] = '[F11 STATUS] >>> AUTO-ACTIVATED (MOBILE) <<<';
        }
        return newLines;
      });
      console.log('[F11 PROTOCOL] MAXIMUM EXPERIENCE AUTO-ACTIVATED (MOBILE)');
      setTimeout(onComplete, 1000);
    }
  }, [bootComplete, f11Activated]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [bootComplete, f11Activated, onComplete]);

  return (
    <div className='h-screen w-screen bg-black flex items-center justify-center p-4'>
      <div className='boot-text text-sm md:text-base max-w-2xl mx-auto p-4 md:p-8'>
        {lines.map((line, i) => (
          <div key={i} className={`mb-1 animate-boot-line ${
            line.includes('[SYSTEM]') ? 'text-cyan-400 font-bold' :
            line.includes('[F11 STATUS]') ? (f11Activated ? 'text-green-400 font-bold' : 'text-red-400 font-bold animate-pulse') :
            ''
          }`}>
            {line || <span>&nbsp;</span>}
          </div>
        ))}
        {currentLine < bootLines.length && (
          <span className={`inline-block w-2 h-4 bg-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} ${bootComplete ? 'bg-red-400' : ''}`} />
        )}
      </div>
    </div>
  );
}
