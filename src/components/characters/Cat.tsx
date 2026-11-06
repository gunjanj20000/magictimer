import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Cat: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
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
          <radialGradient id="catBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#FB923C" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Tail */}
        <motion.path
          d="M116 118 Q140 114 136 94 Q130 84 122 88"
          stroke="#EA580C"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          animate={{ rotate: [-4, 6, -4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ transformOrigin: '116px 118px' }}
        />

        {/* Ears */}
        <polygon points="52,48 42,22 66,36" fill="url(#catBody)" stroke="#EA580C" strokeWidth="2" />
        <polygon points="52,44 46,26 62,36" fill="#FBCFE8" />

        <polygon points="108,48 118,22 94,36" fill="url(#catBody)" stroke="#EA580C" strokeWidth="2" />
        <polygon points="108,44 114,26 98,36" fill="#FBCFE8" />

        {/* Body */}
        <ellipse cx="80" cy="112" rx="42" ry="34" fill="url(#catBody)" stroke="#EA580C" strokeWidth="2" />
        {/* Soft cream belly */}
        <ellipse cx="80" cy="116" rx="26" ry="22" fill="#FFF7ED" />

        {/* Paws */}
        <ellipse cx="60" cy="142" rx="13" ry="9" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" />
        <ellipse cx="100" cy="142" rx="13" ry="9" fill="#FFF7ED" stroke="#EA580C" strokeWidth="2" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="42" ry="35" fill="url(#catBody)" stroke="#EA580C" strokeWidth="2" />

        {/* Cheeks */}
        <circle cx="56" cy="82" r="8" fill="#F472B6" opacity="0.45" />
        <circle cx="104" cy="82" r="8" fill="#F472B6" opacity="0.45" />

        {/* Eyes */}
        {mood === 'celebrate' || mood === 'happy' ? (
          <>
            <path d="M60 70 Q67 62 74 70" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M86 70 Q93 62 100 70" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="67" cy="70" r="5" fill="#0F172A" />
            <circle cx="93" cy="70" r="5" fill="#0F172A" />
            <circle cx="65" cy="68" r="2" fill="#FFFFFF" />
            <circle cx="91" cy="68" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Nose */}
        <polygon points="80,78 76,74 84,74" fill="#F472B6" />

        {/* Smile */}
        <path d="M75 80 Q80 84 80 84 Q80 84 85 80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <path d="M48 76 L34 74" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M48 81 L34 83" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M112 76 L126 74" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M112 81 L126 83" stroke="#9A3412" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
