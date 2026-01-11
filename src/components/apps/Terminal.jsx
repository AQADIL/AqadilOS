import React, { useState, useEffect, useRef } from 'react';

const bootText = [
  'AqadilOS Kernel v2.5.0-generic #42 SMP PREEMPT Thu Dec 16 20:55:32 UTC 2025',
  'Checking file systems...',
  'EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode. Opts: (null)',
  'systemd[1]: Detected virtualization \'react-vm\'.',
  'systemd[1]: Detected architecture \'x86-64\'.',
  'Welcome to AqadilOS!',
  '',
  'Type \'help\' to see available commands.',
  ''
];

export default function TerminalApp() {
  const [lines, setLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (currentLineIndex < bootText.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, bootText[currentLineIndex]]);
        setCurrentLineIndex(prev => prev + 1);
      }, Math.random() * 100 + 50);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = userInput.trim().toLowerCase();
      const newLines = ['user@aqadil:~$ ' + userInput];
      
      switch(cmd) {
        case 'help': newLines.push('Available commands: about, skills, contact, clear, date'); break;
        case 'about': newLines.push('Alish Aqadil. Fullstack Developer focused on complex product logic.'); break;
        case 'skills': newLines.push('React, Node.js, Firebase, PWA, Secure Architecture.'); break;
        case 'contact': newLines.push('Telegram: @wellpussy | Phone: +7 776 234 9535'); break;
        case 'date': newLines.push(new Date().toString()); break;
        case 'clear': setLines([]); setUserInput(''); return;
        case '': break;
        default: newLines.push('bash: ' + cmd + ': command not found');
      }
      
      setLines(prev => [...prev, ...newLines, '']);
      setUserInput('');
    }
  };

  return (
    <div className='h-full bg-black/95 p-4 font-mono text-sm md:text-base text-green-500 overflow-auto' ref={bodyRef} onClick={() => inputRef.current?.focus()}>
      {lines.map((line, i) => (
        <div key={i} className='whitespace-pre-wrap mb-1'>{line}</div>
      ))}
      
      {currentLineIndex === bootText.length && (
        <div className='flex items-center'>
          <span className='text-blue-400 mr-2'>user@aqadil:~$</span>
          <input 
            ref={inputRef}
            type='text' 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleCommand}
            className='flex-1 bg-transparent outline-none border-none text-green-500 caret-green-500'
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
