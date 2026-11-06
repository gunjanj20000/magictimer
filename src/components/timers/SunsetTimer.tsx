import React from 'react';
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

export const SunsetTimer: React.FC<TimerModeProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isNight = clamped >= 0.90;

  // The Sun starts high in the midday sky (x: 80, y: 70)
  // And arcs downwards toward the horizon (x: 320, y: 280)
  // While the Moon rises up from horizon (x: 200, y: 300) to starry sky (x: 200, y: 90) as clamped -> 1.0
  const sunAngle = Math.PI * 0.9 - clamped * Math.PI * 0.8;
  const sunX = 200 - Math.cos(sunAngle) * 160;
  const sunY = 270 - Math.sin(sunAngle) * 190;

  const moonOpacity = Math.max(0, (clamped - 0.6) / 0.4);
  const moonY = 160 - moonOpacity * 70;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div className="relative w-full max-w-lg aspect-square flex items-center justify-center overflow-hidden rounded-3xl shadow-inner">
        <svg viewBox="0 0 400 380" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Daytime Sky */}
            <linearGradient id="daySky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#7DD3FC" />
              <stop offset="60%" stop-color="#BAE6FD" />
              <stop offset="100%" stop-color="#FEF08A" />
            </linearGradient>

            {/* Sunset Sky */}
            <linearGradient id="sunsetSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#F472B6" />
              <stop offset="40%" stop-color="#FB923C" />
              <stop offset="80%" stop-color="#FACC15" />
              <stop offset="100%" stop-color="#C084FC" />
            </linearGradient>

            {/* Twilight Night Sky */}
            <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#312E81" />
              <stop offset="50%" stop-color="#4C1D95" />
              <stop offset="85%" stop-color="#831843" />
              <stop offset="100%" stop-color="#1E1B4B" />
            </linearGradient>

            {/* Sun Glow */}
            <radialGradient id="sunOrbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
            </radialGradient>
          </defs>

          {/* Background Sky Layers blending based on time */}
          <rect x="0" y="0" width="400" height="380" fill="url(#daySky)" />

          {/* Sunset layer fades in (0.3 to 0.7) */}
          <rect
            x="0"
            y="0"
            width="400"
            height="380"
            fill="url(#sunsetSky)"
            opacity={Math.min(1, Math.max(0, (clamped - 0.25) / 0.45))}
          />

          {/* Twilight layer fades in (0.7 to 1.0) */}
          <rect
            x="0"
            y="0"
            width="400"
            height="380"
            fill="url(#twilightSky)"
            opacity={Math.min(1, Math.max(0, (clamped - 0.65) / 0.35))}
          />

          {/* Sun Orbital Arc Guide (dotted) */}
          <path
            d="M 50 250 A 170 170 0 0 1 350 250"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="4 8"
            opacity="0.35"
          />

          {/* Smiling Golden Sun descending */}
          {clamped < 0.95 && (
            <g transform={`translate(${sunX}, ${sunY})`}>
              <circle cx="0" cy="0" r="38" fill="url(#sunOrbGlow)" />
              <circle cx="0" cy="0" r="26" fill="#FACC15" stroke="#F59E0B" strokeWidth="2.5" />
              {/* Sun Face */}
              <circle cx="-7" cy="-3" r="2.5" fill="#1E293B" />
              <circle cx="7" cy="-3" r="2.5" fill="#1E293B" />
              <circle cx="-11" cy="3" r="3" fill="#F87171" opacity="0.6" />
              <circle cx="11" cy="3" r="3" fill="#F87171" opacity="0.6" />
              <path d="M -6 4 Q 0 9 6 4" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Gentle Stars appearing during twilight */}
          {clamped > 0.65 && (
            <g fill="#FDE047" opacity={moonOpacity}>
              <circle cx="70" cy="70" r="3" />
              <circle cx="120" cy="110" r="2" />
              <circle cx="280" cy="80" r="3" />
              <circle cx="330" cy="120" r="2.5" />
              <polygon points="90,40 92,45 97,45 93,48 95,53 90,50 85,53 87,48 83,45 88,45" />
              <polygon points="310,50 312,55 317,55 313,58 315,63 310,60 305,63 307,58 303,55 308,55" />
            </g>
          )}

          {/* Friendly Smiling Crescent Moon rising */}
          {clamped > 0.6 && (
            <g transform={`translate(200, ${moonY})`} opacity={moonOpacity}>
              {/* Moon Glow */}
              <circle cx="0" cy="0" r="42" fill="#FEF08A" opacity="0.25" />
              {/* Crescent Moon */}
              <path
                d="M 15 -25 C 2 -25 -10 -15 -10 0 C -10 15 2 25 15 25 C 0 25 -25 15 -25 0 C -25 -15 0 -25 15 -25 Z"
                fill="#FEF08A"
                stroke="#FACC15"
                strokeWidth="2"
              />
              {/* Moon sleepy sweet face */}
              <circle cx="-14" cy="-2" r="1.8" fill="#1E293B" />
              <circle cx="-16" cy="4" r="2.5" fill="#F472B6" opacity="0.7" />
              <path d="M -15 3 Q -12 7 -9 3" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Rolling Hills in Foreground */}
          {/* Back Hill */}
          <path
            d="M 0 270 Q 150 230 300 260 T 400 240 L 400 380 L 0 380 Z"
            fill={isNight ? '#1E1B4B' : clamped > 0.5 ? '#831843' : '#86EFAC'}
            opacity="0.8"
          />
          {/* Front Hill */}
          <path
            d="M 0 300 Q 200 260 400 290 L 400 380 L 0 380 Z"
            fill={isNight ? '#0F172A' : clamped > 0.5 ? '#4C1D95' : '#4ADE80'}
          />

          {/* Gentle Flowers closing or glowing */}
          <circle cx="100" cy="330" r="5" fill="#F472B6" />
          <circle cx="100" cy="330" r="2" fill="#FEF08A" />
          <circle cx="280" cy="320" r="5" fill="#FACC15" />
          <circle cx="280" cy="320" r="2" fill="#FFFFFF" />
        </svg>

        {/* Character standing peacefully */}
        <div className="absolute bottom-4 left-6 sm:bottom-8 sm:left-10">
          <CharacterAvatar
            characterId={characterId}
            mood={isNight ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={85}
          />
        </div>
      </div>
    </div>
  );
};
