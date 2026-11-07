import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId, TimerDirection } from '../../types';
import { CharacterAvatar, CHARACTER_META } from '../characters/CharacterAvatar';

interface TimerModeProps {
  progress: number;
  direction?: TimerDirection;
  characterId: CharacterId;
  isAlmostDone: boolean;
  isPaused: boolean;
  className?: string;
}

// Cubic Bezier evaluation helper
function getBezierPoint(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number] {
  const oneMinusT = 1 - t;
  const x =
    Math.pow(oneMinusT, 3) * p0[0] +
    3 * Math.pow(oneMinusT, 2) * t * p1[0] +
    3 * oneMinusT * Math.pow(t, 2) * p2[0] +
    Math.pow(t, 3) * p3[0];
  const y =
    Math.pow(oneMinusT, 3) * p0[1] +
    3 * Math.pow(oneMinusT, 2) * t * p1[1] +
    3 * oneMinusT * Math.pow(t, 2) * p2[1] +
    Math.pow(t, 3) * p3[1];
  return [x, y];
}

export const BunnyJourneyTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  isPaused,
  className = '',
}) => {
  // Support both 'grow' (journey from gate to home) and 'disappear'
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isHome = clamped >= 0.98;

  const characterName = CHARACTER_META.find((c) => c.id === characterId)?.name.split(' ')[0] || 'Bella';

  // Bezier curve control points across the scenic garden
  // P0: Starting Gate (55, 305)
  // P1: Lower meadow curve (120, 310)
  // P2: Upper hill ascent (200, 205)
  // P3: Cozy Cottage doorstep (305, 155)
  const P0: [number, number] = [55, 305];
  const P1: [number, number] = [120, 310];
  const P2: [number, number] = [200, 205];
  const P3: [number, number] = [305, 155];

  // Current coordinates of Bella along the path
  const [charX, charY] = getBezierPoint(clamped, P0, P1, P2, P3);

  // Generate 10 stepping stones along the journey (t = 0.1 to 1.0)
  const stoneTValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const stoneColors = [
    '#F472B6', // Pink
    '#FB923C', // Orange
    '#FACC15', // Yellow
    '#4ADE80', // Green
    '#38BDF8', // Cyan
    '#A78BFA', // Purple
    '#F472B6', // Pink
    '#FACC15', // Yellow
    '#4ADE80', // Green
    '#F43F5E', // Rose (Home Step)
  ];

  // Build the dynamic filled ribbon path behind Bella (from t = 0 to clamped)
  const sampleSteps = 24;
  const currentStepCount = Math.max(1, Math.round(clamped * sampleSteps));
  let ribbonD = `M ${P0[0]} ${P0[1]}`;
  for (let i = 1; i <= currentStepCount; i++) {
    const tVal = (i / sampleSteps) * clamped;
    const [sx, sy] = getBezierPoint(tVal, P0, P1, P2, P3);
    ribbonD += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full h-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex items-center justify-center p-1 sm:p-2">
        <svg viewBox="0 0 400 370" className="w-full h-full max-h-[58vh] sm:max-h-[62vh] md:max-h-[66vh] lg:max-h-[72vh] block object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#F0FDF4" />
            </linearGradient>
            <linearGradient id="hillBack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
            <linearGradient id="hillFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
            <linearGradient id="trailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
            <linearGradient id="cottageRoof" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Gentle Sky & Rolling Hills */}
          <rect width="400" height="370" rx="36" fill="url(#skyGrad)" opacity="0.5" />
          <path d="M 0 280 Q 110 240 230 270 T 400 250 L 400 370 L 0 370 Z" fill="url(#hillBack)" />
          <path d="M 0 310 Q 180 275 400 305 L 400 370 L 0 370 Z" fill="url(#hillFront)" />

          {/* Full Scenic Stepping Stone Path (Dotted Guide) */}
          <path
            d="M 55 305 C 120 310 200 205 305 155"
            stroke="#CBD5E1"
            strokeWidth="24"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          />

          {/* Glowing Golden Trail physically illuminated behind Bella */}
          {clamped > 0.02 && (
            <path
              d={ribbonD}
              stroke="url(#trailGrad)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#softGlow)"
            />
          )}

          {/* 10 Stepping Stones Along Path */}
          {stoneTValues.map((tVal, idx) => {
            const [sx, sy] = getBezierPoint(tVal, P0, P1, P2, P3);
            const isStepped = clamped >= tVal;
            const color = isStepped ? stoneColors[idx] : '#E2E8F0';

            return (
              <g key={`stone-${idx}`} transform={`translate(${sx}, ${sy})`}>
                <ellipse
                  cx="0"
                  cy="0"
                  rx="10"
                  ry="7"
                  fill={color}
                  stroke={isStepped ? '#FFFFFF' : '#CBD5E1'}
                  strokeWidth="2"
                  filter={isStepped ? 'url(#softGlow)' : undefined}
                />
                {isStepped && (
                  <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                )}
              </g>
            );
          })}

          {/* Starting Gate (0% Checkpoint) */}
          <g transform="translate(32, 275)">
            {/* Wooden posts */}
            <rect x="0" y="0" width="6" height="36" rx="2" fill="#78350F" />
            <rect x="24" y="0" width="6" height="36" rx="2" fill="#78350F" />
            <path d="M -2 6 Q 15 -2 32 6" stroke="#92400E" strokeWidth="4" fill="none" />
            {/* Gate Sign */}
            <rect x="2" y="8" width="26" height="12" rx="3" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
            <text x="15" y="17" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#78350F">
              START
            </text>
            {/* Flower by gate */}
            <circle cx="-4" cy="30" r="4" fill="#F472B6" />
            <circle cx="-4" cy="30" r="1.5" fill="#FDE047" />
          </g>

          {/* 33% Milestone: Sweet Strawberry Bush */}
          <g transform="translate(138, 280)">
            <circle cx="0" cy="0" r="12" fill="#22C55E" />
            <circle cx="-5" cy="2" r="4" fill="#EF4444" />
            <circle cx="4" cy="4" r="3.5" fill="#EF4444" />
            {clamped >= 0.33 && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <circle cx="0" cy="-14" r="7" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="0" y="-11" textAnchor="middle" fontSize="8">⭐</text>
              </motion.g>
            )}
          </g>

          {/* 66% Milestone: Cheerful Sunflower Bridge */}
          <g transform="translate(202, 175)">
            <line x1="0" y1="0" x2="0" y2="24" stroke="#16A34A" strokeWidth="3" />
            <circle cx="0" cy="0" r="10" fill="#FACC15" />
            <circle cx="0" cy="0" r="5" fill="#78350F" />
            {clamped >= 0.66 && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <circle cx="0" cy="-14" r="7" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="0" y="-11" textAnchor="middle" fontSize="8">⭐</text>
              </motion.g>
            )}
          </g>

          {/* Finish Line (100%): Cozy Cottage Burrow at Top Right */}
          <g transform="translate(270, 70)">
            {/* Puffs of Chimney Smoke */}
            <motion.ellipse
              cx="75"
              cy="10"
              rx="6"
              ry="4"
              fill="#FFFFFF"
              opacity="0.8"
              animate={isHome ? { y: [-5, -28], opacity: [0.9, 0], scale: [1, 2.2] } : { y: [-5, -18], opacity: [0.7, 0], scale: [1, 1.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
            />
            {/* Red Brick Chimney */}
            <rect x="70" y="20" width="12" height="24" fill="#B45309" rx="2" />

            {/* Cozy House Walls */}
            <rect x="25" y="60" width="76" height="56" rx="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />

            {/* Pink Thatched Roof */}
            <polygon points="14,65 63,22 112,65" fill="url(#cottageRoof)" stroke="#DB2777" strokeWidth="2.5" />

            {/* Warm Welcoming Door */}
            <rect x="52" y="80" width="22" height="36" rx="10" fill="#78350F" stroke="#B45309" strokeWidth="2" />
            <circle cx="58" cy="98" r="2.5" fill="#FDE047" />

            {/* Glowing Golden Windows */}
            <circle cx="38" cy="85" r="7.5" fill={isHome ? '#FDE047' : '#FEF08A'} stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="31" y1="85" x2="45" y2="85" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="38" y1="78" x2="38" y2="92" stroke="#F59E0B" strokeWidth="1.5" />

            {/* Soft Doorstep Mat */}
            <ellipse cx="63" cy="118" rx="18" ry="6" fill="#F472B6" />

            {/* Cottage Title */}
            <text x="63" y="55" textAnchor="middle" fontSize="8" fontWeight="900" fill="#BE185D">
              HOME 🏡
            </text>

            {/* Celebration Hearts Erupting when Bella arrives */}
            {isHome && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ y: [-5, -25], scale: [1, 1.4], opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                <path
                  d="M 63 15 Q 67 10 72 15 Q 72 22 63 29 Q 54 22 54 15 Q 59 10 63 15 Z"
                  fill="#EC4899"
                />
              </motion.g>
            )}
          </g>

          {/* Bella Moving Directly within SVG Coordinates (Always Pixel-Perfect) */}
          <foreignObject
            x={charX - 42}
            y={charY - 72}
            width={84}
            height={84}
            className="overflow-visible pointer-events-none"
          >
            <div className="w-full h-full flex items-center justify-center">
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
                size={78}
              />
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Nonverbal Progress Subtitle */}
      <div className="mt-1 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm flex items-center gap-2">
        <span className="text-sm">
          {isHome ? '🎉' : '🏡'}
        </span>
        <span className="text-xs sm:text-sm font-black text-slate-700">
          {isHome
            ? `${characterName} made it home! Great sitting!`
            : `${characterName} is walking home... (${Math.round(clamped * 100)}%)`}
        </span>
      </div>
    </div>
  );
};
