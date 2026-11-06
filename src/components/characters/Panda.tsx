import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Panda: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
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
          <radialGradient id="pandaBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#F8FAFC" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Black Ears */}
        <circle cx="48" cy="48" r="18" fill="#1E293B" />
        <circle cx="48" cy="48" r="10" fill="#334155" />
        <circle cx="112" cy="48" r="18" fill="#1E293B" />
        <circle cx="112" cy="48" r="10" fill="#334155" />

        {/* Arms / Feet */}
        <ellipse cx="44" cy="116" rx="14" ry="24" fill="#1E293B" />
        <ellipse cx="116" cy="116" rx="14" ry="24" fill="#1E293B" />
        <ellipse cx="58" cy="144" rx="15" ry="10" fill="#1E293B" />
        <ellipse cx="102" cy="144" rx="15" ry="10" fill="#1E293B" />

        {/* Body */}
        <ellipse cx="80" cy="112" rx="42" ry="34" fill="url(#pandaBody)" stroke="#E2E8F0" strokeWidth="2" />
        {/* Black chest band */}
        <path d="M42 100 Q80 115 118 100 Q110 125 80 125 Q50 125 42 100 Z" fill="#1E293B" opacity="0.12" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="44" ry="38" fill="url(#pandaBody)" stroke="#E2E8F0" strokeWidth="2" />

        {/* Eye Patches */}
        <ellipse cx="60" cy="72" rx="14" ry="12" fill="#1E293B" transform="rotate(-15 60 72)" />
        <ellipse cx="100" cy="72" rx="14" ry="12" fill="#1E293B" transform="rotate(15 100 72)" />

        {/* Eyes */}
        {mood === 'celebrate' || mood === 'happy' ? (
          <>
            <path d="M54 73 Q60 67 66 73" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M94 73 Q100 67 106 73" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="60" cy="71" r="5" fill="#FFFFFF" />
            <circle cx="100" cy="71" r="5" fill="#FFFFFF" />
            <circle cx="61" cy="70" r="3" fill="#0F172A" />
            <circle cx="99" cy="70" r="3" fill="#0F172A" />
            <circle cx="62" cy="69" r="1.2" fill="#FFFFFF" />
            <circle cx="100" cy="69" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Cute Cheeks */}
        <circle cx="50" cy="88" r="8" fill="#F472B6" opacity="0.4" />
        <circle cx="110" cy="88" r="8" fill="#F472B6" opacity="0.4" />

        {/* Nose */}
        <ellipse cx="80" cy="82" rx="6" ry="4" fill="#0F172A" />

        {/* Smile */}
        <path d="M74 88 Q80 94 86 88" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Little green bamboo leaf snack */}
        <path d="M86 94 Q98 90 102 80 Q92 84 86 94 Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="1" />
      </svg>
    </motion.div>
  );
};
