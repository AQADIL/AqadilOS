import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Music, Disc } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);


  const songs = [
    {
      title: "Mimosa 2000",
      artist: "Furacão 2000",
      cover: "/music/covers/mimosa.jpg",
      audioFile: "/music/audio/mimosa.mp3"
    },
    {
      title: "Night Dancer",
      artist: "imase",
      cover: "/music/covers/night-dancer.jpg", 
      audioFile: "/music/audio/night-dancer.mp3"
    },
    {
      title: "Salvatore",
      artist: "Lana Del Rey",
      cover: "/music/covers/salvatore.jpg", 
      audioFile: "/music/audio/salvatore.mp3"
    },
    {
      title: "Empire State of Mind",
      artist: "Jay-Z ft. Alicia Keys",
      cover: "/music/covers/empire-state-mind.jpg", 
      audioFile: "/music/audio/empire-state-mind.mp3"
    },
    {
      title: "Ләззат алауы",
      artist: "Ерболат Құдайбергенов",
      cover: "/music/covers/lyazzat-alauy.jpg", 
      audioFile: "/music/audio/lyazzat-alauy.mp3"
    }
  ];

  const currentSong = songs[currentSongIndex];


  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    

    audio.volume = volume / 100;
    

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    
    const handleEnded = () => {
      handleNext();
    };
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateTime);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioFile;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSongIndex]);


  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleNext = () => {
    setProgress(0);
    setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      audioRef.current.currentTime = clickedValue;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex text-white select-none">
        
        {}
        <div className="absolute inset-0 z-0">
          <img 
            src={currentSong.cover} 
            alt="bg" 
            className="w-full h-full object-cover opacity-60 blur-3xl scale-125 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          {}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        {}
        <div className="relative z-10 w-[45%] h-full flex flex-col items-center justify-center p-8 border-r border-white/10 backdrop-blur-md bg-black/20">
          
          {}
          <div className="relative w-64 h-64 mb-8 group">
             {}
            <div className={`absolute inset-0 rounded-full bg-black/50 blur-xl transform translate-y-4 transition-all duration-500 ${isPlaying ? 'scale-100' : 'scale-90'}`}></div>
            
            {}
            <div className={`relative w-full h-full rounded-full border-4 border-black/80 bg-black shadow-2xl overflow-hidden transition-transform duration-[5s] ease-linear ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
              <img 
                src={currentSong.cover} 
                alt="cover" 
                className="w-full h-full object-cover opacity-80"
              />
              {}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/20">
                <div className="w-3 h-3 bg-black rounded-full border border-gray-700"></div>
              </div>
              {}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full pointer-events-none"></div>
            </div>
          </div>

          {}
          <div className="text-center space-y-1 mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">{currentSong.title}</h2>
            <p className="text-gray-300 font-medium text-lg">{currentSong.artist}</p>
          </div>

          {}
          <div className="w-full space-y-2 mb-6">
            <div 
              className="relative h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-300 group-hover:bg-blue-400"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {}
          <div className="flex items-center gap-6">
            <button onClick={handlePrev} className="text-gray-300 hover:text-white transition-transform active:scale-90">
              <SkipBack size={28} fill="currentColor" />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)} 
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            
            <button onClick={handleNext} className="text-gray-300 hover:text-white transition-transform active:scale-90">
              <SkipForward size={28} fill="currentColor" />
            </button>
          </div>
        </div>

        {}
        <div className="relative z-10 flex-1 h-full bg-black/40 backdrop-blur-xl p-6 flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-xl font-bold flex items-center gap-2">
               <Disc className={isPlaying ? "animate-spin" : ""} size={20}/> Current Playlist
             </h3>
             <div className="flex items-center gap-2">
               <Volume2 size={16} className="text-gray-400"/>
               <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white w-[80%]"></div>
               </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {songs.map((song, index) => (
              <div 
                key={index}
                onClick={() => {
                  setCurrentSongIndex(index);
                  setIsPlaying(true);
                  setProgress(0);
                }}
                className={`
                  group p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 border border-transparent
                  ${currentSongIndex === index 
                    ? 'bg-white/10 border-white/20 backdrop-blur-sm' 
                    : 'hover:bg-white/5 hover:border-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <img src={song.cover} alt="cover" className="w-full h-full object-cover" />
                    {}
                    {currentSongIndex === index && isPlaying && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-[2px]">
                        <div className="w-[3px] bg-blue-400 h-3 animate-[bounce_1s_infinite]"></div>
                        <div className="w-[3px] bg-blue-400 h-5 animate-[bounce_1.2s_infinite]"></div>
                        <div className="w-[3px] bg-blue-400 h-2 animate-[bounce_0.8s_infinite]"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${currentSongIndex === index ? 'text-blue-300' : 'text-white'}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-gray-400">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 font-mono">{song.duration}</span>
                  {currentSongIndex === index && (
                    <button onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}>
                      <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-white"} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="h-12 flex items-end justify-center gap-1 mt-4 opacity-50">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i}
                className={`w-1.5 bg-white/80 rounded-t-sm transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'h-1'}`}
                style={{ 
                  height: isPlaying ? `${Math.random() * 100}%` : '4px',
                  animationDelay: `${i * 0.05}s`
                }}
              ></div>
            ))}
          </div>

        </div>
      </div>
  );
}