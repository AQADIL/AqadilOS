import React, { useState } from 'react';
import { Send, Linkedin, Mail, Phone, MessageCircle, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const HEADER_HEIGHT = 60;
const STACK_OFFSET = 60;
const EXTRACT_Y = 100;


const CARDS = [
  {
    id: 'phone',
    name: 'Phone',
    icon: Phone,
    actionLabel: '+7 776 234 9535',
    url: 'tel:+77762349535',
    cardClass: 'bg-green-500',
    buttonClass: 'bg-green-700 hover:bg-green-800',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    actionLabel: 'wa.me/77762349535',
    url: 'https://wa.me/77762349535',
    cardClass: 'bg-emerald-500',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800',
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    actionLabel: 'youtub.maj@gmail.com',
    url: 'mailto:youtub.maj@gmail.com',
    cardClass: 'bg-red-600',
    buttonClass: 'bg-red-800 hover:bg-red-900',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    actionLabel: '@aqdlsh',
    url: 'https://instagram.com/aqdlsh',
    cardClass: 'bg-pink-500',
    buttonClass: 'bg-pink-700 hover:bg-pink-800',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    actionLabel: '@wellpussy',
    url: 'https://t.me/wellpussy',
    cardClass: 'bg-sky-500',
    buttonClass: 'bg-sky-700 hover:bg-sky-800',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    actionLabel: 'akadil-alish',
    url: 'https://www.linkedin.com/in/akadil-alish-3a9113353/',
    cardClass: 'bg-blue-700',
    buttonClass: 'bg-blue-900 hover:bg-blue-950',
  },
];

const STACK_HEIGHT = HEADER_HEIGHT + STACK_OFFSET * (CARDS.length - 1);

function ContactCard({ card, index, isRaised, onToggle, onHoverStart, onHoverEnd }) {
  const baseTop = index * STACK_OFFSET;

  const baseZ = index * 10;

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
      style={{ top: baseTop }}
      initial={false}
      animate={{
        y: isRaised ? -EXTRACT_Y : 0,
        zIndex: isRaised ? 50 : baseZ,
      }}
      transition={{
        type: 'spring',
        stiffness: 520,
        damping: 30,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(card.id);
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div
        className={
          'w-[90vw] sm:w-96 h-64 rounded-2xl shadow-2xl border border-black flex flex-col overflow-hidden ' +
          card.cardClass
        }
      >
        {}
        <div className="h-[60px] flex items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <card.icon size={20} className="text-black" />
            </div>
            <span className="font-semibold text-white text-sm tracking-wide">
              {card.name}
            </span>
          </div>
          <span className="text-[11px] font-mono text-white">
            {card.id.toUpperCase()}
          </span>
        </div>

        {}
        <div className="flex-1 px-4 sm:px-5 pb-4 sm:pb-5 pt-2 sm:pt-3 flex flex-col justify-between">
          <div>
            <div className="text-white text-base font-semibold mb-1">
              {card.actionLabel}
            </div>
            <div className="text-white text-xs">
              Ready to connect
            </div>
          </div>

          <button
            type="button"
            className={
              'mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white ' +
              'transition-transform duration-150 active:scale-95 ' +
              card.buttonClass
            }
            onClick={(e) => {
              e.stopPropagation();
              if (card.url) {
                window.open(card.url, '_blank');
              }
            }}
          >
            Open {card.name}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ContactWallet() {
  const [activeCardId, setActiveCardId] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null);

  const handleToggle = (id) => {
    setActiveCardId((current) => (current === id ? null : id));
  };

  const handleBackgroundClick = () => {
    setActiveCardId(null);
    setHoveredCardId(null);
  };

  return (
    <div
      className="w-full h-full bg-slate-950 text-white flex items-center justify-center overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black">Contact Wallet</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Hover or tap a card&apos;s header to pull it out of the stack.
          </p>
        </div>

        <div
          className="relative w-full flex justify-center"
          style={{ height: STACK_HEIGHT + EXTRACT_Y }}
        >
          <div className="relative w-[90vw] sm:w-96">
            {CARDS.map((card, index) => {
              const isRaised = activeCardId === card.id || hoveredCardId === card.id;
              return (
                <ContactCard
                  key={card.id}
                  card={card}
                  index={index}
                  isRaised={isRaised}
                  onToggle={handleToggle}
                  onHoverStart={() => setHoveredCardId(card.id)}
                  onHoverEnd={() =>
                    setHoveredCardId((prev) => (prev === card.id ? null : prev))
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
