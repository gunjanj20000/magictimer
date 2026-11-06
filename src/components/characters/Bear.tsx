import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Bear: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      animate={
        mood === 'walk'
          ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
          : mood === 'celebrate'
          ? { y: [0, -15, 0], scale: [1, 1.08, 1] }
          : mood === 'almost'
          ? { scale: [1, 1.04, 1] }
          : { y: [0, -4, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: mood === 'walk' ? 0.7 : mood === 'celebrate' ? 0.5 : 2.5,
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 160 160" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bearBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Round Ears */}
        <circle cx="50" cy="46" r="16" fill="url(#bearBody)" stroke="#92400E" strokeWidth="2" />
        <circle cx="50" cy="46" r="9" fill="#FDE68A" />

        <circle cx="110" cy="46" r="16" fill="url(#bearBody)" stroke="#92400E" strokeWidth="2" />
        <circle cx="110" cy="46" r="9" fill="#FDE68A" />

        {/* Body */}
        <ellipse cx="80" cy="112" rx="44" ry="36" fill="url(#bearBody)" stroke="#92400E" strokeWidth="2" />
        {/* Warm honey belly */}
        <ellipse cx="80" cy="116" rx="26" ry="22" fill="#FEF3C7" />

        {/* Paws */}
        <ellipse cx="58" cy="142" rx="14" ry="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
        <ellipse cx="102" cy="142" rx="14" ry="10" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="42" ry="36" fill="url(#bearBody)" stroke="#92400E" strokeWidth="2" />

        {/* Snout */}
        <ellipse cx="80" cy="82" rx="18" ry="14" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />

        {/* Cheeks */}
        <circle cx="54" cy="80" r="7" fill="#F472B6" opacity="0.45" />
        <circle cx="106" cy="80" r="7" fill="#F472B6" opacity="0.45" />

        {/* Eyes */}
        {mood === 'celebrate' || mood === 'happy' ? (
          <>
            <path d="M60 68 Q66 60 72 68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M88 68 Q94 60 100 68" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="66" cy="68" r="5" fill="#0F172A" />
            <circle cx="94" cy="68" r="5" fill="#0F172A" />
            <circle cx="65" cy="66" r="2" fill="#FFFFFF" />
            <circle cx="93" cy="66" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Big soft nose */}
        <ellipse cx="80" cy="78" rx="7" ry="5" fill="#451A03" />

        {/* Smile */}
        <path d="M74 85 Q80 91 86 85" stroke="#451A03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </motion.div>
  );
};
