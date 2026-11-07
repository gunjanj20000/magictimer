import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId } from '../../types';
import { MovableMascot } from '../characters/MovableMascot';

interface TimerModeProps {
  progress: number; // 0.0 to 1.0 (1.0 = completed)
  direction?: 'grow' | 'disappear';
  characterId: CharacterId;
  isAlmostDone: boolean;
  isPaused: boolean;
  className?: string;
}

export const MagicGardenTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  className = '',
}) => {
  // If direction is disappear, visual growth is 1 - progress
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));

  // Key milestones
  const stemHeight = 40 + clamped * 180; // Stem height from 40 to 220
  const leafScale = Math.min(1, Math.max(0, (clamped - 0.15) / 0.4));
  const budScale = Math.min(1, Math.max(0, (clamped - 0.35) / 0.5));
  const petalSpread = Math.min(1, Math.max(0, (clamped - 0.5) / 0.5));
  const isBloom = clamped > 0.85;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full h-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl flex items-center justify-center p-1 sm:p-2">
        <svg viewBox="0 0 400 400" className="w-full h-full max-h-[58vh] sm:max-h-[62vh] md:max-h-[66vh] lg:max-h-[72vh] block object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sunBloom" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="stemGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#15803D" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>
            <radialGradient id="centerPollen" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>
          </defs>

          {/* Gentle Bloom Glow behind flower at completion */}
          {isBloom && (
            <circle cx="200" cy={340 - stemHeight} r={90 * petalSpread} fill="url(#sunBloom)" />
          )}

          {/* Soil Mound */}
          <ellipse cx="200" cy="355" rx="100" ry="24" fill="#78350F" opacity="0.3" />
          <ellipse cx="200" cy="350" rx="90" ry="18" fill="#92400E" />
          <ellipse cx="200" cy="346" rx="75" ry="12" fill="#B45309" />
          <path d="M160 348 Q180 340 200 348 Q220 340 240 348" stroke="#D97706" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Little Sprout Base */}
          {clamped < 0.2 && (
            <g transform="translate(192, 335)">
              <ellipse cx="8" cy="8" rx="6" ry="4" fill="#4ADE80" />
              <path d="M8 8 Q12 0 16 4" stroke="#22C55E" strokeWidth="2" />
            </g>
          )}

          {/* Main Stem */}
          <path
            d={`M 200 346 Q ${196 + Math.sin(clamped * 6) * 8} ${346 - stemHeight * 0.5} 200 ${346 - stemHeight}`}
            stroke="url(#stemGrad)"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Left Leaf */}
          {clamped > 0.15 && (
            <g
              transform={`translate(196, ${346 - stemHeight * 0.4}) scale(${leafScale})`}
              style={{ transformOrigin: '0px 0px' }}
            >
              <path
                d="M 0 0 C -40 -10 -55 -40 -35 -50 C -15 -45 0 -20 0 0 Z"
                fill="#22C55E"
                stroke="#16A34A"
                strokeWidth="2"
              />
              <path d="M 0 0 C -20 -15 -35 -35 -35 -50" stroke="#86EFAC" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* Right Leaf */}
          {clamped > 0.25 && (
            <g
              transform={`translate(204, ${346 - stemHeight * 0.65}) scale(${leafScale})`}
              style={{ transformOrigin: '0px 0px' }}
            >
              <path
                d="M 0 0 C 40 -10 55 -40 35 -50 C 15 -45 0 -20 0 0 Z"
                fill="#4ADE80"
                stroke="#16A34A"
                strokeWidth="2"
              />
              <path d="M 0 0 C 20 -15 35 -35 35 -50" stroke="#BBF7D0" strokeWidth="2" fill="none" />
            </g>
          )}

          {/* Flower Bud & Blooming Petals */}
          {clamped > 0.35 && (
            <g transform={`translate(200, ${346 - stemHeight}) scale(${budScale})`}>
              {/* Petals layer (Rainbow Petals!) */}
              {petalSpread > 0.1 && (
                <g>
                  {/* Petal Angles */}
                  {[
                    { angle: 0, color: '#F87171' },
                    { angle: 45, color: '#FB923C' },
                    { angle: 90, color: '#FACC15' },
                    { angle: 135, color: '#4ADE80' },
                    { angle: 180, color: '#38BDF8' },
                    { angle: 225, color: '#818CF8' },
                    { angle: 270, color: '#C084FC' },
                    { angle: 315, color: '#F472B6' },
                  ].map((p, i) => {
                    const dist = 36 * petalSpread;
                    const rad = (p.angle * Math.PI) / 180;
                    const px = Math.cos(rad) * dist;
                    const py = Math.sin(rad) * dist;
                    return (
                      <circle
                        key={i}
                        cx={px}
                        cy={py}
                        r={22 * petalSpread + 4}
                        fill={p.color}
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                      />
                    );
                  })}
                </g>
              )}

              {/* Center Pollen Disc */}
              <circle cx="0" cy="0" r={24 * (0.6 + petalSpread * 0.4)} fill="url(#centerPollen)" stroke="#F59E0B" strokeWidth="3" />

              {/* Smiling Happy Face in Center */}
              <g>
                <circle cx="-8" cy="-3" r="3" fill="#1E293B" />
                <circle cx="8" cy="-3" r="3" fill="#1E293B" />
                <circle cx="-9" cy="-4" r="1" fill="#FFFFFF" />
                <circle cx="7" cy="-4" r="1" fill="#FFFFFF" />
                <circle cx="-13" cy="4" r="3.5" fill="#F472B6" opacity="0.6" />
                <circle cx="13" cy="4" r="3.5" fill="#F472B6" opacity="0.6" />
                {isBloom ? (
                  // Open joyful smile
                  <path d="M -9 3 Q 0 14 9 3 Z" fill="#EF4444" stroke="#1E293B" strokeWidth="1.5" />
                ) : (
                  // Gentle sweet smile
                  <path d="M -7 3 Q 0 9 7 3" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                )}
              </g>

              {/* Sparkles when fully bloomed */}
              {isBloom && (
                <g fill="#FACC15">
                  <path d="M -45 -45 L -42 -37 L -34 -34 L -42 -31 L -45 -23 L -48 -31 L -56 -34 L -48 -37 Z" />
                  <path d="M 45 -40 L 48 -32 L 56 -29 L 48 -26 L 45 -18 L 42 -26 L 34 -29 L 42 -32 Z" />
                  <path d="M 50 35 L 53 41 L 59 43 L 53 45 L 50 51 L 47 45 L 41 43 L 47 41 Z" />
                </g>
              )}
            </g>
          )}

          {/* Gentle fluttering butterfly around blooming flower */}
          {clamped > 0.6 && (
            <motion.g
              animate={{
                x: [130, 150, 130],
                y: [120, 100, 120],
                rotate: [-5, 8, -5],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <ellipse cx="0" cy="0" rx="2" ry="8" fill="#475569" />
              <path d="M 0 -2 C -15 -18 -22 0 0 2" fill="#F472B6" />
              <path d="M 0 0 C -12 8 -16 18 0 6" fill="#C084FC" />
              <path d="M 0 -2 C 15 -18 22 0 0 2" fill="#F472B6" />
              <path d="M 0 0 C 12 8 16 18 0 6" fill="#C084FC" />
            </motion.g>
          )}
        </svg>

        {/* Movable Character standing alongside (Kid can drag anywhere!) */}
        <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 z-30">
          <MovableMascot
            characterId={characterId}
            mood={isBloom ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={90}
          />
        </div>
      </div>
    </div>
  );
};
