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

export const ButterflyTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isFinalFlower = clamped >= 0.98;

  // We place 5 checkpoint flowers along a gentle meadow curve:
  // Flower 0: (60, 280) - Pink Daisy
  // Flower 1: (130, 230) - Yellow Sunflower
  // Flower 2: (200, 270) - Purple Tulip
  // Flower 3: (270, 210) - Blue Bell
  // Flower 4: (340, 250) - Grand Golden Rainbow Flower

  const flowers = [
    { x: 60, y: 280, color: '#F472B6', center: '#FDE047', label: '1', threshold: 0.0 },
    { x: 130, y: 230, color: '#FACC15', center: '#F97316', label: '2', threshold: 0.25 },
    { x: 200, y: 270, color: '#C084FC', center: '#FEF08A', label: '3', threshold: 0.50 },
    { x: 270, y: 210, color: '#60A5FA', center: '#FEF08A', label: '4', threshold: 0.75 },
    { x: 335, y: 240, color: '#F87171', center: '#FACC15', label: '5', threshold: 0.95 },
  ];

  // Interpolate butterfly position smoothly between flowers based on clamped progress
  // 4 segments: 0-0.25, 0.25-0.5, 0.5-0.75, 0.75-1.0
  const segment = Math.min(3, Math.floor(clamped * 4));
  const segProgress = (clamped - segment * 0.25) / 0.25;

  const fStart = flowers[segment];
  const fEnd = flowers[segment + 1];

  // Arc the butterfly trajectory slightly upward between flowers
  const currentX = fStart.x + (fEnd.x - fStart.x) * segProgress;
  const baseY = fStart.y + (fEnd.y - fStart.y) * segProgress;
  // Hover 40px above flower when resting, arch higher during flight
  const archHeight = Math.sin(segProgress * Math.PI) * 45;
  const currentY = baseY - 35 - archHeight;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
        <svg viewBox="0 0 400 380" className="w-full h-full max-h-[46vh] sm:max-h-[50vh] block" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Meadow Background */}
          <path d="M 0 310 Q 150 270 300 310 T 400 290 L 400 380 L 0 380 Z" fill="#86EFAC" />
          <path d="M 0 330 Q 200 300 400 330 L 400 380 L 0 380 Z" fill="#4ADE80" />

          {/* Dotted Flight Path */}
          <path
            d={`M 60 245 Q 95 160 130 195 Q 165 240 200 235 Q 235 150 270 175 Q 302 210 335 205`}
            stroke="#CBD5E1"
            strokeWidth="2.5"
            strokeDasharray="6 8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Flower Checkpoints */}
          {flowers.map((fl, idx) => {
            const isReached = clamped >= fl.threshold;
            const isFinal = idx === flowers.length - 1;

            return (
              <g key={idx} transform={`translate(${fl.x}, ${fl.y})`}>
                {/* Stem */}
                <path d={`M 0 0 C 0 20 ${idx % 2 === 0 ? 5 : -5} 50 0 80`} stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
                {/* Leaves */}
                <path d={`M 0 35 Q ${idx % 2 === 0 ? 18 : -18} 30 ${idx % 2 === 0 ? 22 : -22} 45`} stroke="#4ADE80" strokeWidth="4" strokeLinecap="round" />

                {/* Glow ring if reached */}
                {isReached && (
                  <circle cx="0" cy="0" r={isFinal ? 38 : 28} fill="#FEF08A" opacity="0.4" />
                )}

                {/* Petals */}
                {[0, 60, 120, 180, 240, 300].map((deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const px = Math.cos(rad) * (isFinal ? 20 : 15);
                  const py = Math.sin(rad) * (isFinal ? 20 : 15);
                  return (
                    <circle
                      key={deg}
                      cx={px}
                      cy={py}
                      r={isFinal ? 14 : 10}
                      fill={isReached ? fl.color : '#E2E8F0'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Center Core */}
                <circle cx="0" cy="0" r={isFinal ? 16 : 12} fill={isReached ? fl.center : '#CBD5E1'} stroke="#FFFFFF" strokeWidth="2" />
                {/* Cheerful face */}
                {isReached && (
                  <g>
                    <circle cx="-3" cy="-2" r="1.5" fill="#1E293B" />
                    <circle cx="3" cy="-2" r="1.5" fill="#1E293B" />
                    <path d="M -3 2 Q 0 5 3 2" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Golden Celebration Sparkles on Final Flower */}
          {isFinalFlower && (
            <g fill="#FACC15">
              <circle cx="335" cy="180" r="4" />
              <circle cx="305" cy="190" r="3" />
              <circle cx="365" cy="195" r="3.5" />
              <polygon points="335,160 338,166 345,166 339,171 341,177 335,173 329,177 331,171 325,166 332,166" />
            </g>
          )}

          {/* Butterfly in Motion */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            <motion.g
              animate={{
                rotate: [ -6, 6, -6 ],
                scale: isFinalFlower ? [1, 1.2, 1] : 1,
              }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            >
              {/* Fluttering Wings Left */}
              <motion.g
                animate={{ scaleX: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: 'easeInOut' }}
                style={{ transformOrigin: '0px 0px' }}
              >
                <path d="M 0 0 C -35 -30 -45 5 -10 15 Z" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M 0 5 C -25 15 -35 40 -5 28 Z" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="-18" cy="-8" r="4" fill="#FFFFFF" opacity="0.8" />
              </motion.g>

              {/* Fluttering Wings Right */}
              <motion.g
                animate={{ scaleX: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.35, ease: 'easeInOut' }}
                style={{ transformOrigin: '0px 0px' }}
              >
                <path d="M 0 0 C 35 -30 45 5 10 15 Z" fill="#F472B6" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M 0 5 C 25 15 35 40 5 28 Z" fill="#C084FC" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="18" cy="-8" r="4" fill="#FFFFFF" opacity="0.8" />
              </motion.g>

              {/* Butterfly Body */}
              <ellipse cx="0" cy="5" rx="3.5" ry="14" fill="#334155" />
              {/* Head */}
              <circle cx="0" cy="-10" r="4.5" fill="#334155" />
              {/* Antennae */}
              <path d="M -2 -14 Q -8 -22 -10 -20" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M 2 -14 Q 8 -22 10 -20" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <circle cx="-10" cy="-20" r="1.5" fill="#F472B6" />
              <circle cx="10" cy="-20" r="1.5" fill="#F472B6" />
            </motion.g>
          </g>
        </svg>

        {/* Character watching in meadow */}
        <div className="absolute bottom-4 left-6 sm:bottom-8 sm:left-10">
          <CharacterAvatar
            characterId={characterId}
            mood={isFinalFlower ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={85}
          />
        </div>
      </div>
    </div>
  );
};
