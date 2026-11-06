import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';

interface TimerModeProps {
  progress: number;
  direction?: 'grow' | 'disappear';
  characterId: CharacterId;
  isAlmostDone: boolean;
  isPaused: boolean;
  className?: string;
}

export const BalloonTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isHigh = clamped >= 0.95;

  // Balloon rises from Y = 280 (meadow level) up to Y = 90 (starry sky level)
  const balloonY = 280 - clamped * 190;
  // Balloon sways slightly side to side as it ascends
  const balloonX = 200 + Math.sin(clamped * 10) * 18;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 380" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGradBalloon" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#BAE6FD" />
              <stop offset="70%" stop-color="#E0F2FE" />
              <stop offset="100%" stop-color="#FEFCE8" />
            </linearGradient>
            <radialGradient id="balloonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#FEF08A" stop-opacity="0" />
            </radialGradient>
          </defs>

          {/* Gentle background sky panel */}
          <rect x="0" y="0" width="400" height="380" fill="url(#skyGradBalloon)" rx="24" />

          {/* Meadow at bottom */}
          <path d="M 0 330 Q 150 300 300 330 T 400 320 L 400 380 L 0 380 Z" fill="#86EFAC" />
          <path d="M 0 350 Q 200 330 400 350 L 400 380 L 0 380 Z" fill="#4ADE80" />

          {/* Friendly floating clouds at different altitudes */}
          {/* High Cloud */}
          <g transform="translate(60, 50)" opacity="0.8">
            <ellipse cx="40" cy="25" rx="30" ry="18" fill="#FFFFFF" />
            <circle cx="25" cy="20" r="16" fill="#FFFFFF" />
            <circle cx="50" cy="18" r="18" fill="#FFFFFF" />
          </g>
          {/* Mid Cloud */}
          <g transform="translate(260, 140)" opacity="0.85">
            <ellipse cx="45" cy="25" rx="35" ry="20" fill="#FFFFFF" />
            <circle cx="28" cy="20" r="18" fill="#FFFFFF" />
            <circle cx="56" cy="18" r="20" fill="#FFFFFF" />
          </g>
          {/* Low Cloud */}
          <g transform="translate(30, 240)" opacity="0.9">
            <ellipse cx="40" cy="25" rx="30" ry="18" fill="#FFFFFF" />
            <circle cx="25" cy="20" r="16" fill="#FFFFFF" />
            <circle cx="50" cy="18" r="18" fill="#FFFFFF" />
          </g>

          {/* Friendly stars glowing at high altitude */}
          {clamped > 0.7 && (
            <g fill="#FACC15">
              <motion.polygon
                points="100,70 103,77 110,77 104,82 107,89 100,85 93,89 96,82 90,77 97,77"
                animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
              <motion.polygon
                points="310,60 313,67 320,67 314,72 317,79 310,75 303,79 306,72 300,67 307,67"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </g>
          )}

          {/* Balloon Glow at completion */}
          {isHigh && (
            <circle cx={balloonX} cy={balloonY} r="75" fill="url(#balloonGlow)" />
          )}

          {/* Hot Air Balloon Assembly */}
          <g transform={`translate(${balloonX}, ${balloonY})`}>
            {/* Balloon Envelope */}
            <g transform="translate(-50, -80)">
              {/* Balloon Body with Rainbow pastel stripes */}
              <clipPath id="balloonClip">
                <path d="M 50 0 C 18 0 10 35 25 70 C 35 90 42 105 44 110 L 56 110 C 58 105 65 90 75 70 C 90 35 82 0 50 0 Z" />
              </clipPath>

              {/* Base shape */}
              <path
                d="M 50 0 C 18 0 10 35 25 70 C 35 90 42 105 44 110 L 56 110 C 58 105 65 90 75 70 C 90 35 82 0 50 0 Z"
                fill="#FDF2F8"
                stroke="#F472B6"
                strokeWidth="2.5"
              />

              {/* Stripes inside clip */}
              <g clipPath="url(#balloonClip)">
                <rect x="0" y="0" width="20" height="120" fill="#F87171" />
                <rect x="20" y="0" width="15" height="120" fill="#FB923C" />
                <rect x="35" y="0" width="15" height="120" fill="#FDE047" />
                <rect x="50" y="0" width="15" height="120" fill="#4ADE80" />
                <rect x="65" y="0" width="15" height="120" fill="#38BDF8" />
                <rect x="80" y="0" width="20" height="120" fill="#C084FC" />
              </g>

              {/* Happy smiling face on balloon */}
              <circle cx="43" cy="45" r="2.5" fill="#1E293B" />
              <circle cx="57" cy="45" r="2.5" fill="#1E293B" />
              <circle cx="38" cy="50" r="3" fill="#F472B6" opacity="0.6" />
              <circle cx="62" cy="50" r="3" fill="#F472B6" opacity="0.6" />
              <path d="M 46 51 Q 50 56 54 51" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

              {/* Ropes connecting envelope to basket */}
              <line x1="44" y1="110" x2="40" y2="126" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="56" y1="110" x2="60" y2="126" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Wicker Basket */}
              <rect x="36" y="126" width="28" height="22" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="1.8" />
              <line x1="36" y1="137" x2="64" y2="137" stroke="#92400E" strokeWidth="1.2" />
              <line x1="45" y1="126" x2="45" y2="148" stroke="#92400E" strokeWidth="1.2" />
              <line x1="55" y1="126" x2="55" y2="148" stroke="#92400E" strokeWidth="1.2" />

              {/* Little bunting pennants */}
              <polygon points="36,126 43,131 43,126" fill="#F87171" />
              <polygon points="43,126 50,131 50,126" fill="#FBBF24" />
              <polygon points="50,126 57,131 57,126" fill="#38BDF8" />
              <polygon points="57,126 64,131 64,126" fill="#C084FC" />
            </g>
          </g>

          {/* Sparkles around balloon when it reaches top */}
          {isHigh && (
            <g fill="#FACC15">
              <circle cx={balloonX - 55} cy={balloonY - 20} r="3" />
              <circle cx={balloonX + 55} cy={balloonY - 30} r="4" />
              <circle cx={balloonX - 40} cy={balloonY + 40} r="3" />
              <circle cx={balloonX + 45} cy={balloonY + 50} r="3.5" />
            </g>
          )}
        </svg>

        {/* Character sitting on meadow waving up, or peaking from basket */}
        <div className="absolute bottom-4 left-6 sm:bottom-8 sm:left-12">
          <CharacterAvatar
            characterId={characterId}
            mood={isHigh ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={85}
          />
        </div>
      </div>
    </div>
  );
};
