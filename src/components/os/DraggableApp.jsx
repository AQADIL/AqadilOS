import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

export default function DraggableApp({ app, onDropInBin }) {
  const [isCrying, setIsCrying] = useState(false);

  const handleDrag = (event, info) => {
    const windowWidth = window.innerWidth;
    const x = info.point.x;


    if (x > windowWidth - 400) {
      setIsCrying(true);
    } else {
      setIsCrying(false);
    }
  };

  const handleDragEnd = (event, info) => {
    const windowWidth = window.innerWidth;
    if (info.point.x > windowWidth - 300) {
      onDropInBin(app.id);
    }
    setIsCrying(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      animate={
        isCrying
          ? {
              rotate: [0, -5, 5, -5, 0],
              transition: { repeat: Infinity, duration: 0.2 },
            }
          : { rotate: 0 }
      }
      className="relative flex flex-col items-center gap-2 p-2 w-24 cursor-grab active:cursor-grabbing select-none"
    >
      {}
      <div
        className={`absolute -top-8 text-2xl transition-opacity duration-300 ${
          isCrying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        😭
      </div>

      {}
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg transition-colors ${
          app.removable ? 'bg-red-500' : 'bg-blue-500'
        } ${isCrying ? 'bg-red-600 shadow-red-500/50' : ''}`}
      >
        {app.id.includes('bloatware') ? (
          <Ghost size={28} />
        ) : (
          <div className="font-bold text-xs">App</div>
        )}
      </div>

      <span className="text-white text-xs font-medium text-center drop-shadow-md bg-black/20 px-2 rounded">
        {app.name}
      </span>
    </motion.div>
  );
}
