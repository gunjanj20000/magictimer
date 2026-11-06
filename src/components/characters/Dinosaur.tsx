import React from 'react';
import { motion } from 'framer-motion';

interface CharacterProps {
  className?: string;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
}

export const Dinosaur: React.FC<CharacterProps> = ({ className = '', mood = 'idle', size = 120 }) => {
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
          <radialGradient id="dinoBody" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="100%" stopColor="#4ADE80" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="80" cy="148" rx="42" ry="8" fill="#CBD5E1" opacity="0.4" />

        {/* Gentle Rounded Back Plates / Spikes */}
        <polygon points="46,60 52,48 58,60" fill="#FACC15" />
        <polygon points="62,46 70,32 78,46" fill="#FACC15" />
        <polygon points="82,46 90,32 98,46" fill="#FACC15" />
        <polygon points="102,60 108,48 114,60" fill="#FACC15" />

        {/* Tail sticking out behind */}
        <path d="M115 120 Q145 124 140 108 Q130 115 110 116 Z" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="2" />
        <polygon points="130,110 134,102 138,110" fill="#FACC15" />

        {/* Body */}
        <ellipse cx="80" cy="112" rx="44" ry="36" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="2" />
        {/* Soft yellow tummy */}
        <ellipse cx="76" cy="116" rx="26" ry="24" fill="#FEF08A" />

        {/* Little dino feet */}
        <ellipse cx="58" cy="142" rx="14" ry="10" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="2" />
        <ellipse cx="98" cy="142" rx="14" ry="10" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="2" />
        <circle cx="53" cy="145" r="2" fill="#FFFFFF" />
        <circle cx="58" cy="146" r="2" fill="#FFFFFF" />
        <circle cx="63" cy="145" r="2" fill="#FFFFFF" />
        <circle cx="93" cy="145" r="2" fill="#FFFFFF" />
        <circle cx="98" cy="146" r="2" fill="#FFFFFF" />
        <circle cx="103" cy="145" r="2" fill="#FFFFFF" />

        {/* Head */}
        <ellipse cx="78" cy="72" rx="38" ry="32" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="2" />

        {/* Cheeks */}
        <circle cx="56" cy="78" r="7" fill="#F472B6" opacity="0.45" />
        <circle cx="100" cy="78" r="7" fill="#F472B6" opacity="0.45" />

        {/* Eyes */}
        {mood === 'celebrate' || mood === 'happy' ? (
          <>
            <path d="M60 66 Q66 58 72 66" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M84 66 Q90 58 96 66" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="66" cy="66" r="5" fill="#0F172A" />
            <circle cx="90" cy="66" r="5" fill="#0F172A" />
            <circle cx="64" cy="64" r="2" fill="#FFFFFF" />
            <circle cx="88" cy="64" r="2" fill="#FFFFFF" />
          </>
        )}

        {/* Snout nostrils */}
        <circle cx="74" cy="74" r="1.5" fill="#15803D" />
        <circle cx="82" cy="74" r="1.5" fill="#15803D" />

        {/* Happy smile */}
        <path d="M72 80 Q78 86 84 80" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Little tiny dino hands */}
        <ellipse cx="64" cy="102" rx="7" ry="6" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="1.5" />
        <ellipse cx="88" cy="102" rx="7" ry="6" fill="url(#dinoBody)" stroke="#22C55E" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
};
