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

export const BunnyJourneyTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  isPaused,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isHome = clamped >= 0.98;

  // We define a 2D winding path across the garden:
  // Points along the path from Start (40, 290) to Home (340, 140)
  // Checkpoint 0: x: 50, y: 290 (Start)
  // Checkpoint 1: x: 130, y: 260 (1/3)
  // Checkpoint 2: x: 210, y: 210 (2/3)
  // Checkpoint 3: x: 300, y: 155 (Home Doorstep)

  // Calculate character X and Y along the bezier curve
  // Using cubic Bezier interpolation: P0=(50,290), P1=(120,290), P2=(200,180), P3=(300,155)
  const t = clamped;
  const cx = 3 * (120 - 50);
  const bx = 3 * (200 - 120) - cx;
  const ax = 300 - 50 - cx - bx;

  const cy = 3 * (290 - 290);
  const by = 3 * (180 - 290) - cy;
  const ay = 155 - 290 - cy - by;

  const charX = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + 50;
  const charY = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + 290;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 380" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#FDE68A" />
              <stop offset="100%" stop-color="#FCD34D" />
            </linearGradient>
            <linearGradient id="cottageRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F472B6" />
              <stop offset="100%" stop-color="#EC4899" />
            </linearGradient>
          </defs>

          {/* Rolling Hills Landscape */}
          <path d="M 0 320 Q 120 280 240 310 T 400 290 L 400 380 L 0 380 Z" fill="#86EFAC" />
          <path d="M 0 340 Q 200 310 400 335 L 400 380 L 0 380 Z" fill="#4ADE80" />

          {/* Cozy Cottage / Burrow at the top right */}
          <g transform="translate(265, 75)">
            {/* Chimney smoke */}
            <motion.ellipse
              cx="75"
              cy="10"
              rx="6"
              ry="4"
              fill="#FFFFFF"
              opacity="0.7"
              animate={{ y: [-5, -20], opacity: [0.7, 0], scale: [1, 1.6] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
            />
            {/* Chimney */}
            <rect x="70" y="20" width="12" height="24" fill="#B45309" rx="2" />

            {/* Cottage Walls */}
            <rect x="25" y="60" width="75" height="55" rx="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />

            {/* Cottage Roof */}
            <polygon points="15,65 62,25 110,65" fill="url(#cottageRoof)" stroke="#DB2777" strokeWidth="2.5" />

            {/* Cozy Door */}
            <rect x="52" y="80" width="22" height="35" rx="10" fill="#78350F" stroke="#B45309" strokeWidth="2" />
            <circle cx="58" cy="98" r="2" fill="#FDE047" />

            {/* Glowing Window */}
            <circle cx="38" cy="85" r="7" fill={isHome ? '#FDE047' : '#FEF08A'} stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="31" y1="85" x2="45" y2="85" stroke="#F59E0B" strokeWidth="1" />
            <line x1="38" y1="78" x2="38" y2="92" stroke="#F59E0B" strokeWidth="1" />

            {/* Welcome mat / doorstep */}
            <ellipse cx="63" cy="116" rx="16" ry="5" fill="#F472B6" />
          </g>

          {/* Stepping Stone Garden Path */}
          <path
            d="M 50 290 C 120 290 200 180 300 155"
            stroke="url(#pathGrad)"
            strokeWidth="28"
            strokeLinecap="round"
            fill="none"
          />

          {/* Path Border / Stepping Pebbles */}
          <path
            d="M 50 290 C 120 290 200 180 300 155"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeDasharray="6 12"
            strokeLinecap="round"
            fill="none"
          />

          {/* Checkpoint 1 (Start - Blooming Daisy) */}
          <g transform="translate(48, 290)">
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
            <circle cx="0" cy="0" r="6" fill="#FACC15" />
          </g>

          {/* Checkpoint 2 (1/3 Stone) */}
          <g transform="translate(130, 252)">
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="8"
              fill={clamped >= 0.33 ? '#FDE047' : '#E2E8F0'}
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {clamped >= 0.33 && <circle cx="0" cy="0" r="3" fill="#F59E0B" />}
          </g>

          {/* Checkpoint 3 (2/3 Stone) */}
          <g transform="translate(208, 195)">
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="8"
              fill={clamped >= 0.66 ? '#FDE047' : '#E2E8F0'}
              stroke="#CBD5E1"
              strokeWidth="2"
            />
            {clamped >= 0.66 && <circle cx="0" cy="0" r="3" fill="#F59E0B" />}
          </g>

          {/* Decorative Flowers along the path */}
          <circle cx="110" cy="320" r="6" fill="#F472B6" />
          <circle cx="110" cy="320" r="2.5" fill="#FEF08A" />
          <circle cx="170" cy="275" r="7" fill="#C084FC" />
          <circle cx="170" cy="275" r="3" fill="#FEF08A" />
          <circle cx="240" cy="235" r="6" fill="#60A5FA" />
          <circle cx="240" cy="235" r="2.5" fill="#FEF08A" />

          {/* Friendly Heart floating above cottage when character arrives */}
          {isHome && (
            <motion.path
              d="M 328 120 Q 332 114 338 120 Q 338 128 328 136 Q 318 128 318 120 Q 324 114 328 120 Z"
              fill="#F472B6"
              animate={{ y: [-5, -20], scale: [1, 1.25], opacity: [1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
          )}
        </svg>

        {/* Character dynamically moving along the path */}
        <div
          className="absolute pointer-events-none transition-all duration-300"
          style={{
            left: `${(charX / 400) * 100}%`,
            top: `${(charY / 380) * 100}%`,
            transform: 'translate(-50%, -85%)',
          }}
        >
          <CharacterAvatar
            characterId={characterId}
            mood={
              isHome
                ? 'celebrate'
                : isPaused
                ? 'idle'
                : isAlmostDone
                ? 'almost'
                : 'walk'
            }
            size={76}
          />
        </div>
      </div>
    </div>
  );
};
