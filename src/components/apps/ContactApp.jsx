import React, { useState, useRef, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Instagram, Linkedin, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactCard = ({ icon, title, value, description, color, isActive, index, total, onClick, onDragStart, onDragEnd, isDragging }) => {
  const cardVariants = {
    inactive: { 
      scale: 0.85,
      opacity: 0.7,
      rotateY: 15,
      transition: { duration: 0.3 }
    },
    active: { 
      scale: 1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.3 }
    },
    dragging: {
      scale: 1.1,
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className={`absolute cursor-pointer transition-all duration-300`}
      style={{
        width: '280px',
        height: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        top: `${index * 140 + 20}px`,
        zIndex: isActive ? 100 : total - index,
      }}
      variants={cardVariants}
      animate={isDragging ? 'dragging' : (isActive ? 'active' : 'inactive')}
      whileHover={{ scale: isActive ? 1 : 0.9 }}
      whileTap={{ scale: 0.95 }}
      drag="y"
      dragConstraints={{ top: 20, bottom: (total - 1) * 140 + 20 }}
      dragElastic={0.2}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      <div 
        className="w-full h-full rounded-2xl p-4 backdrop-blur-md border border-white/20 flex items-center gap-3 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}40 100%)`,
          boxShadow: isActive ? `0 10px 30px -10px ${color}60, 0 0 0 1px ${color}30` : `0 5px 15px -5px ${color}40`
        }}
      >
        {}
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              `radial-gradient(circle at 20% 30%, ${color}60 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 70%, ${color}60 0%, transparent 50%)`,
              `radial-gradient(circle at 50% 50%, ${color}60 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 30%, ${color}60 0%, transparent 50%)`
            ]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color }}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {icon}
          </motion.div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-white/80">{value}</p>
          </div>
        </div>

        {}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: color,
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default function ContactApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const containerRef = useRef(null);

  const contacts = [
    {
      icon: <Phone size={20} />,
      title: "Phone",
      value: "+7 776 234 9535",
      description: "Direct connection • Instant response",
      color: "#10b981",
      action: () => window.open("tel:+77762349535")
    },
    {
      icon: <MessageCircle size={20} />,
      title: "WhatsApp",
      value: "wa.me/77762349535",
      description: "Chat support • Media sharing",
      color: "#25d366",
      action: () => window.open("https://wa.me/77762349535")
    },
    {
      icon: <Instagram size={20} />,
      title: "Instagram",
      value: "@aqdlsh",
      description: "Visual stories • Portfolio updates",
      color: "#e4405f",
      action: () => window.open("https://instagram.com/aqdlsh")
    },
    {
      icon: <MessageCircle size={20} />,
      title: "Telegram",
      value: "@wellpussy",
      description: "Fast messaging • File sharing",
      color: "#0088cc",
      action: () => window.open("https://t.me/wellpussy")
    },
    {
      icon: <Linkedin size={20} />,
      title: "LinkedIn",
      value: "akadil-alish",
      description: "Professional network • Career",
      color: "#0077b5",
      action: () => window.open("https://www.linkedin.com/in/akadil-alish-3a9113353/")
    },
    {
      icon: <Mail size={20} />,
      title: "Email",
      value: "youtub.maj@gmail.com",
      description: "Business inquiries • Proposals",
      color: "#3b82f6",
      action: () => window.open("mailto:youtub.maj@gmail.com")
    }
  ];

  const handleCardClick = (index) => {
    setCurrentIndex(index);
    contacts[index].action();
  };

  const handleDragStart = (index) => {
    setIsDragging(true);
    setDraggedIndex(index);
  };

  const handleDragEnd = (info, index) => {
    setIsDragging(false);
    

    const cardHeight = 140;
    const newIndex = Math.round(info.point.y / cardHeight);
    const clampedIndex = Math.max(0, Math.min(contacts.length - 1, newIndex));
    
    setCurrentIndex(clampedIndex);
    setDraggedIndex(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        setCurrentIndex((prev) => Math.min(contacts.length - 1, prev + 1));
      } else if (e.key === 'Enter') {
        contacts[currentIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/50 to-blue-900/20" />
        
        {}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(37, 211, 102, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, rgba(228, 64, 95, 0.05) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {}
      <motion.div 
        className="relative z-20 p-6 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-2 text-white">Get In Touch</h1>
        <p className="text-white/60 text-sm">Drag cards or use arrows to select</p>
      </motion.div>

      {}
      <div 
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        <div className="relative w-full h-full">
          {contacts.map((contact, index) => (
            <ContactCard
              key={index}
              icon={contact.icon}
              title={contact.title}
              value={contact.value}
              description={contact.description}
              color={contact.color}
              isActive={currentIndex === index}
              index={index}
              total={contacts.length}
              onClick={() => handleCardClick(index)}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={(info) => handleDragEnd(info, index)}
              isDragging={isDragging && draggedIndex === index}
            />
          ))}
        </div>
      </div>

      {}
      <motion.div
        className="relative z-20 p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-md mx-auto">
          <motion.div
            className="p-4 rounded-2xl backdrop-blur-md border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${contacts[currentIndex].color}20 0%, ${contacts[currentIndex].color}10 100%)`,
              borderColor: `${contacts[currentIndex].color}30`
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: contacts[currentIndex].color }}
              >
                {contacts[currentIndex].icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{contacts[currentIndex].title}</h3>
                <p className="text-sm text-white/80">{contacts[currentIndex].value}</p>
              </div>
            </div>
            <p className="text-sm text-white/60">{contacts[currentIndex].description}</p>
          </motion.div>
          
          <motion.button
            onClick={() => contacts[currentIndex].action()}
            className="w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${contacts[currentIndex].color} 0%, ${contacts[currentIndex].color}70 100%)`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Connect via {contacts[currentIndex].title}
          </motion.button>
        </div>
      </motion.div>

      {}
      <motion.div 
        className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-sm z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Drag cards up/down • Arrow keys • Click to connect
      </motion.div>
    </div>
  );
}
