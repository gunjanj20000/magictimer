import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Elephant: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
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
          <radialGradient id="elephantBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#BAE6FD" />
            <stop offset="100%" stop-color="#7DD3FC" />
          </radialGradient>
          <radialGradient id="elephantEar" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FBCFE8" />
            <stop offset="100%" stop-color="#F472B6" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Big flapping ears */}
        <ellipse cx="36" cy="74" rx="24" ry="32" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />
        <ellipse cx="36" cy="74" rx="14" ry="20" fill="url(#elephantEar)" opacity="0.5" />

        <ellipse cx="124" cy="74" rx="24" ry="32" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />
        <ellipse cx="124" cy="74" rx="14" ry="20" fill="url(#elephantEar)" opacity="0.5" />

        {/* Body */}
        <ellipse cx="80" cy="112" rx="44" ry="36" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />
        {/* Tummy */}
        <ellipse cx="80" cy="118" rx="26" ry="20" fill="#E0F2FE" />

        {/* Feet with cute toenails */}
        <ellipse cx="58" cy="142" rx="14" ry="10" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />
        <ellipse cx="102" cy="142" rx="14" ry="10" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="53" cy="146" r="2.5" fill="#FFFFFF" />
        <circle cx="58" cy="147" r="2.5" fill="#FFFFFF" />
        <circle cx="63" cy="146" r="2.5" fill="#FFFFFF" />
        <circle cx="97" cy="146" r="2.5" fill="#FFFFFF" />
        <circle cx="102" cy="147" r="2.5" fill="#FFFFFF" />
        <circle cx="107" cy="146" r="2.5" fill="#FFFFFF" />

        {/* Head */}
        <ellipse cx="80" cy="74" rx="38" ry="34" fill="url(#elephantBody)" stroke="#38BDF8" strokeWidth="2" />

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

        {/* Cheeks */}
        <circle cx="54" cy="80" r="7" fill="#F472B6" opacity="0.45" />
        <circle cx="106" cy="80" r="7" fill="#F472B6" opacity="0.45" />

        {/* Elephant Trunk */}
        <motion.path
          d={
            mood === 'celebrate'
              ? "M74 80 C74 100 86 108 90 94 Q92 88 84 88"
              : "M76 80 C76 96 84 102 88 94 Q90 88 84 88"
          }
          stroke="url(#elephantBody)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
          animate={mood === 'celebrate' ? { rotate: [-5, 5, -5] } : { rotate: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          style={{ transformOrigin: '80px 80px' }}
        />

        {/* Little heart or water drop at trunk tip */}
        {mood === 'celebrate' && (
          <path d="M88 82 Q92 78 96 82 Q96 88 88 94 Q80 88 80 82 Q84 78 88 82 Z" fill="#F472B6" />
        )}
      </svg>
    </motion.div>
  );
};
