import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Bunny: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
  return (
    <motion.div
      className={`relative inline-block select-none ${className}`}
      style={{ width: size, height: size }}
      animate={
        mood === 'walk'
          ? { y: [0, -10, 0], rotate: [-2, 2, -2] }
          : mood === 'celebrate'
          ? { y: [0, -16, 0], scale: [1, 1.08, 1] }
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
          <radialGradient id="bunnyBodyGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#F1F5F9" />
          </radialGradient>
          <radialGradient id="earInnerPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FBCFE8" />
            <stop offset="100%" stop-color="#F472B6" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Ears */}
        {/* Left Ear */}
        <motion.g
          animate={mood === 'celebrate' ? { rotate: [-5, 5, -5] } : { rotate: [-2, 1, -2] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ transformOrigin: '55px 50px' }}
        >
          <path d="M45 52 C35 20 45 6 56 6 C67 6 72 24 62 52 Z" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M48 48 C42 24 48 14 55 14 C62 14 65 26 59 48 Z" fill="url(#earInnerPink)" opacity="0.8" />
        </motion.g>

        {/* Right Ear */}
        <motion.g
          animate={mood === 'celebrate' ? { rotate: [5, -5, 5] } : { rotate: [2, -1, 2] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ transformOrigin: '105px 50px' }}
        >
          <path d="M104 52 C94 24 99 6 110 6 C121 6 131 20 121 52 Z" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M107 48 C101 26 104 14 111 14 C118 14 124 24 118 48 Z" fill="url(#earInnerPink)" opacity="0.8" />
        </motion.g>

        {/* Body */}
        <ellipse cx="80" cy="108" rx="46" ry="38" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />
        {/* Tummy highlight */}
        <ellipse cx="80" cy="114" rx="28" ry="22" fill="#FDF2F8" opacity="0.9" />

        {/* Feet */}
        <ellipse cx="56" cy="142" rx="14" ry="8" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2" />
        <ellipse cx="104" cy="142" rx="14" ry="8" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2" />

        {/* Head */}
        <ellipse cx="80" cy="72" rx="42" ry="36" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2.5" />

        {/* Little Cheeks */}
        <circle cx="56" cy="78" r="8" fill="#F472B6" opacity="0.45" />
        <circle cx="104" cy="78" r="8" fill="#F472B6" opacity="0.45" />

        {/* Eyes */}
        {mood === 'celebrate' || mood === 'happy' ? (
          // Happy curved eyes ^^
          <>
            <path d="M60 67 Q68 59 74 67" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M86 67 Q92 59 100 67" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          // Round big cute shiny eyes
          <>
            <ellipse cx="66" cy="66" rx="5" ry="6.5" fill="#1E293B" />
            <ellipse cx="94" cy="66" rx="5" ry="6.5" fill="#1E293B" />
            <circle cx="64" cy="63.5" r="2.2" fill="#FFFFFF" />
            <circle cx="92" cy="63.5" r="2.2" fill="#FFFFFF" />
            <circle cx="68" cy="68" r="1.2" fill="#FFFFFF" />
            <circle cx="96" cy="68" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Cute Pink Nose */}
        <polygon points="80,74 76,70 84,70" fill="#F472B6" />

        {/* Gentle Mouth */}
        <path d="M76 77 Q80 81 80 81 Q80 81 84 77" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Whiskers */}
        <path d="M44 72 L32 70" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M44 76 L32 78" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M116 72 L128 70" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M116 76 L128 78" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />

        {/* Cute paws */}
        <ellipse cx="68" cy="104" rx="8" ry="7" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2" />
        <ellipse cx="92" cy="104" rx="8" ry="7" fill="url(#bunnyBodyGrad)" stroke="#CBD5E1" strokeWidth="2" />

        {/* Optional Star or Flower decoration */}
        {mood === 'celebrate' && (
          <g>
            <path d="M80 18 L83 26 L91 26 L85 31 L87 39 L80 34 L73 39 L75 31 L69 26 L77 26 Z" fill="#FACC15" />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
