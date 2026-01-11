import React, { useState } from 'react';
import { Heart, CreditCard, ChevronLeft, ChevronRight, Box } from 'lucide-react';

const StaticCard = ({ type, number, expiry, color, gradient, logo, isActive }) => {
  const formatCardNumber = (num) => {
    return num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  return (
    <div className={`relative w-full h-64 rounded-2xl p-6 transition-all duration-300 transform ${
      isActive ? 'scale-105 shadow-2xl' : 'scale-95 opacity-70'
    }`} style={{ background: gradient }}>
      <div className="absolute top-4 right-4">
        {logo}
      </div>
      
      <div className="flex flex-col h-full justify-between text-white">
        <div>
          <div className="text-xs uppercase tracking-wider opacity-80 mb-2">{type}</div>
          <div className="text-2xl font-mono tracking-wider">
            {formatCardNumber(number)}
          </div>
        </div>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs uppercase tracking-wider opacity-80">Valid Thru</div>
            <div className="text-lg font-mono">{expiry}</div>
          </div>
          <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <div className="w-8 h-6 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show3D, setShow3D] = useState(false);

  const cards = [
    {
      type: 'Kaspi Gold',
      number: '4400430301729460',
      expiry: '11/28',
      gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      logo: <div className="text-white font-bold text-xl">KASPI</div>
    },
    {
      type: 'Halyk Bank',
      number: '5522042707770152',
      expiry: '09/30',
      gradient: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
      logo: <div className="text-white font-bold text-xl">HALYK</div>
    },
    {
      type: 'Freedom Bank',
      number: '4002890020742254',
      expiry: '03/28',
      gradient: 'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
      logo: <div className="text-white font-bold text-xl">FREEDOM</div>
    }
  ];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (show3D) {
    return (
      <div className="w-full h-full relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setShow3D(false)}
            className="bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            ← Back to Cards
          </button>
        </div>
        <iframe
          src="https://app.sloyd.ai/embed/6103um76?width=800&height=600&fullscreen=true&mode=live&autoplay=true"
          width="800"
          height="600"
          sandbox="allow-scripts allow-same-origin allow-forms"
          allow="autoplay; fullscreen; xr-spatial-tracking; execution-while-out-of-viewport; execution-while-not-rendered"
          allowFullScreen
          referrerPolicy="no-referrer"
          style={{
            border: 'none',
            position: 'absolute',
            inset: 0,
            width: 'calc(100% + 260px)',
            height: '100%',
            transform: 'translateX(-260px)',
            pointerEvents: 'none'
          }}
          title="Kaspi Gold 3D Model"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <div className="relative h-64">
            {cards.map((card, index) => {
              const offset = index - currentIndex;
              const isActive = index === currentIndex;
              const position = offset === 0 ? 0 : offset > 0 ? 100 : -100;
              
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    isActive ? 'z-10' : 'z-0'
                  }`}
                  style={{
                    transform: `translateX(${position}%)`,
                    opacity: Math.abs(offset) > 1 ? 0 : 1
                  }}
                >
                  <StaticCard {...card} isActive={isActive} />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevCard}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            
            <div className="flex gap-2">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white w-8' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextCard}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="text-white" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShow3D(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Box size={20} />
          <span>View 3D Model</span>
        </button>
      </div>
    </div>
  );
};

export default function DonateApp() {
  return (
    <div className="w-full h-full bg-slate-950 text-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-pink-500" />
          <div>
            <h1 className="text-base md:text-lg font-bold leading-tight">Support / Donate</h1>
            <p className="text-xs text-slate-400">Bank Cards</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CreditCard size={16} className="text-sky-400" />
          <span className="hidden md:inline">Secure Payment</span>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        <CardCarousel />
      </div>
    </div>
  );
}
