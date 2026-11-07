import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId, TimerDirection } from '../../types';
import { MovableMascot } from '../characters/MovableMascot';

interface TimerModeProps {
  progress: number;
  direction?: TimerDirection;
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
  isPaused,
  className = '',
}) => {
  // Support both 'grow' (fills 0% -> 100%) and 'disappear' (drains 100% -> 0%)
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isComplete = clamped >= 0.99;

  // 6 Radiant Sensory Rainbow Bands
  const bands = [
    { color: '#FF5964', r: 154, stroke: 14, label: 'Red' },
    { color: '#FF9F1C', r: 140, stroke: 14, label: 'Orange' },
    { color: '#FEE440', r: 126, stroke: 14, label: 'Yellow' },
    { color: '#2EC4B6', r: 112, stroke: 14, label: 'Green' },
    { color: '#3A86FF', r: 98, stroke: 14, label: 'Blue' },
    { color: '#9B5DE5', r: 84, stroke: 14, label: 'Purple' },
  ];

  const centerX = 200;
  const baseY = 270;

  // Compute smooth geometric arc endpoints without any stroke-dashoffset glitches
  // Angle progresses smoothly from 180 deg (PI rad) at start to 0 deg at completion
  const currentAngleRad = Math.PI - clamped * Math.PI;

  // Star guide rides the middle yellow band (r = 126)
  const starRadius = 126;
  const starX = centerX + Math.cos(currentAngleRad) * starRadius;
  const starY = baseY - Math.sin(currentAngleRad) * starRadius;

  // Checkpoints at 25%, 50%, 75%, 100%
  const checkpoints = [
    { pct: 0.25, angle: Math.PI * 0.75, label: '🌱' },
    { pct: 0.5, angle: Math.PI * 0.5, label: '⭐' },
    { pct: 0.75, angle: Math.PI * 0.25, label: '🌸' },
    { pct: 1.0, angle: 0, label: '🏆' },
  ];

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 370" className="w-full h-full max-h-[46vh] sm:max-h-[50vh] block" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>
            <filter id="rainbowGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Gentle Sunny Backdrop */}
          <circle cx="200" cy="180" r="140" fill="url(#sunGlow)" />

          {/* Soft Pastel Background Guide Tracks (so child sees the full rainbow outline) */}
          {bands.map((b, idx) => (
            <path
              key={`guide-${idx}`}
              d={`M ${centerX - b.r} ${baseY} A ${b.r} ${b.r} 0 0 1 ${centerX + b.r} ${baseY}`}
              stroke={b.color}
              strokeWidth={b.stroke}
              strokeLinecap="round"
              opacity="0.18"
            />
          ))}

          {/* Active Filling Rainbow Arches (Geometric Arc Calculation) */}
          {bands.map((b, idx) => {
            if (clamped <= 0.002) {
              return null;
            }

            // End point of this specific band
            const bandEndX = centerX + Math.cos(currentAngleRad) * b.r;
            const bandEndY = baseY - Math.sin(currentAngleRad) * b.r;

            // Semi-circle sweep: large-arc-flag is 0 since max angle is 180 degrees
            const pathD = `M ${centerX - b.r} ${baseY} A ${b.r} ${b.r} 0 0 1 ${bandEndX} ${bandEndY}`;

            return (
              <path
                key={`active-${idx}`}
                d={pathD}
                stroke={b.color}
                strokeWidth={b.stroke}
                strokeLinecap="round"
                filter={isAlmostDone ? 'url(#rainbowGlow)' : undefined}
              />
            );
          })}

          {/* Milestone Checkpoint Gems Along Rainbow Arch */}
          {checkpoints.map((cp, idx) => {
            const cpX = centerX + Math.cos(cp.angle) * 168;
            const cpY = baseY - Math.sin(cp.angle) * 168;
            const isReached = clamped >= cp.pct;

            return (
              <g key={`cp-${idx}`} transform={`translate(${cpX}, ${cpY})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={isReached ? 11 : 8}
                  fill={isReached ? '#FEF08A' : '#FFFFFF'}
                  stroke={isReached ? '#F59E0B' : '#E2E8F0'}
                  strokeWidth="2"
                  opacity={isReached ? 1 : 0.6}
                />
                {isReached && (
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="15"
                    stroke="#FDE047"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fontSize={isReached ? '10' : '8'}
                  className="select-none pointer-events-none"
                >
                  {cp.label}
                </text>
              </g>
            );
          })}

          {/* Left Cloud Base (Starting Island) */}
          <g transform="translate(15, 215)">
            <ellipse cx="45" cy="55" rx="42" ry="28" fill="url(#cloudGrad)" filter="url(#rainbowGlow)" />
            <circle cx="28" cy="42" r="25" fill="#FFFFFF" />
            <circle cx="58" cy="36" r="28" fill="#FFFFFF" />
            <circle cx="80" cy="48" r="22" fill="#FFFFFF" />
            {/* Cloud Smiling Face */}
            <circle cx="42" cy="48" r="3" fill="#64748B" />
            <circle cx="62" cy="48" r="3" fill="#64748B" />
            <circle cx="34" cy="54" r="4" fill="#F472B6" opacity="0.6" />
            <circle cx="70" cy="54" r="4" fill="#F472B6" opacity="0.6" />
            <path d="M 47 52 Q 52 58 57 52" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Cloud Base (Destination Island) */}
          <g transform="translate(295, 215)">
            <ellipse cx="45" cy="55" rx="42" ry="28" fill="url(#cloudGrad)" filter="url(#rainbowGlow)" />
            <circle cx="22" cy="48" r="22" fill="#FFFFFF" />
            <circle cx="48" cy="36" r="28" fill="#FFFFFF" />
            <circle cx="75" cy="44" r="25" fill="#FFFFFF" />
            {/* Cloud Smiling Face */}
            <circle cx="40" cy="48" r="3" fill="#64748B" />
            <circle cx="60" cy="48" r="3" fill="#64748B" />
            <circle cx="32" cy="54" r="4" fill="#F472B6" opacity="0.6" />
            <circle cx="68" cy="54" r="4" fill="#F472B6" opacity="0.6" />
            <path d="M 45 52 Q 50 58 55 52" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Star Guide Riding the Leading Crest of the Rainbow */}
          {clamped > 0.01 && clamped < 0.99 && (
            <g transform={`translate(${starX}, ${starY})`}>
              <motion.g
                animate={{ rotate: 360, scale: isAlmostDone ? [1, 1.25, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
              >
                {/* 5-Point Star Guide */}
                <polygon
                  points="0,-18 5.5,-6 18,-6 9,3 12.5,15 0,7.5 -12.5,15 -9,3 -18,-6 -5.5,-6"
                  fill="#FDE047"
                  stroke="#F59E0B"
                  strokeWidth="2.5"
                />
                <circle cx="-3.5" cy="-2" r="1.8" fill="#1E293B" />
                <circle cx="3.5" cy="-2" r="1.8" fill="#1E293B" />
                <path d="M -3.5 3 Q 0 6.5 3.5 3" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </motion.g>
              {/* Shimmer trails */}
              <circle cx="-12" cy="12" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="12" cy="12" r="2.5" fill="#FDE047" opacity="0.8" />
            </g>
          )}

          {/* Joyful Celebration Stars Burst upon Timer Completion */}
          {isComplete && (
            <g>
              {[
                { x: 200, y: 110, s: 1.3 },
                { x: 150, y: 130, s: 0.9 },
                { x: 250, y: 130, s: 0.9 },
                { x: 110, y: 160, s: 0.8 },
                { x: 290, y: 160, s: 0.8 },
              ].map((pos, i) => (
                <motion.g
                  key={`star-${i}`}
                  transform={`translate(${pos.x}, ${pos.y}) scale(${pos.s})`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, pos.s * 1.3, pos.s], opacity: [0, 1, 0.9] }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <polygon
                    points="0,-14 4,-4 14,-4 7,2 10,12 0,6 -10,12 -7,2 -14,-4 -4,-4"
                    fill="#FDE047"
                    stroke="#F59E0B"
                    strokeWidth="2"
                  />
                </motion.g>
              ))}
            </g>
          )}

          {/* SVG Elements End */}
        </svg>

        {/* Movable Mascot watching the rainbow (Child can drag anywhere!) */}
        <div className="absolute bottom-3 left-4 sm:bottom-6 sm:left-8 z-30">
          <MovableMascot
            characterId={characterId}
            mood={
              isComplete
                ? 'celebrate'
                : isPaused
                ? 'idle'
                : isAlmostDone
                ? 'almost'
                : 'happy'
            }
            size={84}
          />
        </div>
      </div>
    </div>
  );
};
