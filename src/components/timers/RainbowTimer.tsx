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

export const RainbowTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isComplete = clamped >= 0.99;

  // 6 Rainbow bands
  const bands = [
    { color: '#F87171', r: 150, stroke: 14 },
    { color: '#FB923C', r: 136, stroke: 14 },
    { color: '#FACC15', r: 122, stroke: 14 },
    { color: '#4ADE80', r: 108, stroke: 14 },
    { color: '#38BDF8', r: 94, stroke: 14 },
    { color: '#C084FC', r: 80, stroke: 14 },
  ];

  // Circumference of semi-circle: PI * r
  // We can use strokeDasharray and strokeDashoffset to fill or reveal the semi-circle!
  // Angle of traveling star along the middle arc (r = 115) from 180 deg (left) to 0 deg (right)
  const currentAngleRad = Math.PI - clamped * Math.PI;
  const starX = 200 + Math.cos(currentAngleRad) * 122;
  const starY = 270 - Math.sin(currentAngleRad) * 122;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 360" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background guide arch (soft faint pastel rainbow in background) */}
          {bands.map((b, idx) => (
            <path
              key={`bg-${idx}`}
              d={`M ${200 - b.r} 270 A ${b.r} ${b.r} 0 0 1 ${200 + b.r} 270`}
              stroke={b.color}
              strokeWidth={b.stroke}
              strokeLinecap="round"
              opacity="0.18"
            />
          ))}

          {/* Active Filling Rainbow Arches */}
          {bands.map((b, idx) => {
            const arcLength = Math.PI * b.r;
            // StrokeDashoffset: at 0 clamped offset is arcLength, at 1 clamped offset is 0
            const offset = arcLength * (1 - clamped);
            return (
              <path
                key={`active-${idx}`}
                d={`M ${200 - b.r} 270 A ${b.r} ${b.r} 0 0 1 ${200 + b.r} 270`}
                stroke={b.color}
                strokeWidth={b.stroke}
                strokeLinecap="round"
                strokeDasharray={arcLength}
                strokeDashoffset={offset}
                style={{
                  transition: 'stroke-dashoffset 0.25s linear',
                }}
              />
            );
          })}

          {/* Left Cloud Base */}
          <g transform="translate(15, 220)">
            <ellipse cx="40" cy="50" rx="35" ry="25" fill="#FFFFFF" />
            <circle cx="25" cy="40" r="22" fill="#FFFFFF" />
            <circle cx="50" cy="35" r="25" fill="#FFFFFF" />
            <circle cx="70" cy="45" r="20" fill="#FFFFFF" />
            {/* Friendly Cloud Face */}
            <circle cx="36" cy="45" r="2.5" fill="#64748B" />
            <circle cx="54" cy="45" r="2.5" fill="#64748B" />
            <circle cx="30" cy="50" r="3" fill="#F472B6" opacity="0.5" />
            <circle cx="60" cy="50" r="3" fill="#F472B6" opacity="0.5" />
            <path d="M 40 49 Q 45 54 50 49" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Cloud Base */}
          <g transform="translate(295, 220)">
            <ellipse cx="40" cy="50" rx="35" ry="25" fill="#FFFFFF" />
            <circle cx="20" cy="45" r="20" fill="#FFFFFF" />
            <circle cx="45" cy="35" r="25" fill="#FFFFFF" />
            <circle cx="65" cy="40" r="22" fill="#FFFFFF" />
            {/* Friendly Cloud Face */}
            <circle cx="36" cy="45" r="2.5" fill="#64748B" />
            <circle cx="54" cy="45" r="2.5" fill="#64748B" />
            <circle cx="30" cy="50" r="3" fill="#F472B6" opacity="0.5" />
            <circle cx="60" cy="50" r="3" fill="#F472B6" opacity="0.5" />
            <path d="M 40 49 Q 45 54 50 49" stroke="#64748B" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* Star Guide Riding the Rainbow */}
          <g transform={`translate(${starX}, ${starY})`}>
            <motion.g
              animate={{ rotate: 360, scale: isAlmostDone ? [1, 1.25, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              {/* Star shape */}
              <polygon
                points="0,-16 5,-5 16,-5 8,3 11,14 0,7 -11,14 -8,3 -16,-5 -5,-5"
                fill="#FACC15"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <circle cx="-3" cy="-2" r="1.5" fill="#1E293B" />
              <circle cx="3" cy="-2" r="1.5" fill="#1E293B" />
              <path d="M -3 3 Q 0 6 3 3" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </motion.g>
          </g>

          {/* Celebration Burst Stars at Completion */}
          {isComplete && (
            <g fill="#FBBF24">
              <circle cx="200" cy="115" r="5" />
              <circle cx="160" cy="130" r="4" />
              <circle cx="240" cy="130" r="4" />
              <path d="M 200 70 L 204 82 L 216 82 L 206 90 L 210 102 L 200 94 L 190 102 L 194 90 L 184 82 L 196 82 Z" />
            </g>
          )}
        </svg>

        {/* Character watching the rainbow */}
        <div className="absolute bottom-4 left-6 sm:bottom-6 sm:left-10">
          <CharacterAvatar
            characterId={characterId}
            mood={isComplete ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={85}
          />
        </div>
      </div>
    </div>
  );
};
