import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId, HourglassFillType } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';

interface HourglassTimerProps {
  progress: number; // 0.0 to 1.0 (1.0 = completed)
  direction?: 'grow' | 'disappear';
  characterId: CharacterId;
  isAlmostDone: boolean;
  isPaused: boolean;
  fillType?: HourglassFillType;
  onSelectFillType?: (fill: HourglassFillType) => void;
  className?: string;
}

export const HOURGLASS_FILL_CONFIGS: {
  [key in HourglassFillType]: {
    label: string;
    itemType: 'sand' | 'water' | 'rainbow';
    topGradStart: string;
    topGradEnd: string;
    streamColor: string;
    particleColor: string;
    bottomGradStart: string;
    bottomGradEnd: string;
    icon: string;
    badgeColor: string;
  };
} = {
  'sand-gold': {
    label: 'Golden Sand',
    itemType: 'sand',
    topGradStart: '#FEF08A',
    topGradEnd: '#EAB308',
    streamColor: '#FACC15',
    particleColor: '#F59E0B',
    bottomGradStart: '#FDE047',
    bottomGradEnd: '#CA8A04',
    icon: '⏳',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  'sand-pink': {
    label: 'Pink Magic Sand',
    itemType: 'sand',
    topGradStart: '#FBCFE8',
    topGradEnd: '#EC4899',
    streamColor: '#F472B6',
    particleColor: '#DB2777',
    bottomGradStart: '#F472B6',
    bottomGradEnd: '#BE185D',
    icon: '🌸',
    badgeColor: 'bg-pink-100 text-pink-900 border-pink-300',
  },
  'water-blue': {
    label: 'Ocean Water',
    itemType: 'water',
    topGradStart: '#BAE6FD',
    topGradEnd: '#0284C7',
    streamColor: '#38BDF8',
    particleColor: '#E0F2FE',
    bottomGradStart: '#38BDF8',
    bottomGradEnd: '#0369A1',
    icon: '🌊',
    badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
  },
  'sand-purple': {
    label: 'Berry Purple Sand',
    itemType: 'sand',
    topGradStart: '#E9D5FF',
    topGradEnd: '#9333EA',
    streamColor: '#C084FC',
    particleColor: '#7E22CE',
    bottomGradStart: '#C084FC',
    bottomGradEnd: '#6B21A8',
    icon: '🍇',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
  'water-green': {
    label: 'Emerald Water',
    itemType: 'water',
    topGradStart: '#BBF7D0',
    topGradEnd: '#16A34A',
    streamColor: '#4ADE80',
    particleColor: '#DCFCE7',
    bottomGradStart: '#4ADE80',
    bottomGradEnd: '#15803D',
    icon: '🍃',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  'rainbow': {
    label: 'Rainbow Dust',
    itemType: 'rainbow',
    topGradStart: '#F87171',
    topGradEnd: '#818CF8',
    streamColor: '#FACC15',
    particleColor: '#EC4899',
    bottomGradStart: '#FB923C',
    bottomGradEnd: '#C084FC',
    icon: '🌈',
    badgeColor: 'bg-gradient-to-r from-pink-100 via-amber-100 to-sky-100 text-slate-800 border-pink-300',
  },
};

export const HourglassTimer: React.FC<HourglassTimerProps> = ({
  progress,
  direction = 'grow',
  characterId,
  isAlmostDone,
  isPaused,
  fillType = 'sand-gold',
  onSelectFillType,
  className = '',
}) => {
  const visualProgress = direction === 'disappear' ? 1 - progress : progress;
  const clamped = Math.max(0, Math.min(1, visualProgress));
  const isFinished = clamped >= 0.99;

  const config = HOURGLASS_FILL_CONFIGS[fillType] || HOURGLASS_FILL_CONFIGS['sand-gold'];

  // Physics calculations for hourglass:
  // Top bulb y spans from 75 (full) to 180 (empty)
  // Height of top sand decreases as clamped goes 0 -> 1
  const topSurfaceY = 75 + clamped * 105;

  // Bottom bulb y spans from 315 (empty) up to 210 (full)
  // Height of bottom mound rises as clamped goes 0 -> 1
  const bottomSurfaceY = 315 - clamped * 105;
  const bottomMoundPeakY = Math.max(200, bottomSurfaceY - (config.itemType === 'sand' ? 18 * Math.sin(clamped * Math.PI * 0.9) : 6));

  // Flow stream is active while timer is running (between 0.01 and 0.99)
  const isFlowing = !isPaused && clamped > 0.001 && clamped < 0.999;

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      {/* Main Hourglass Illustration Container */}
      <div className="relative w-full max-w-[330px] sm:max-w-sm aspect-[380/400] flex items-center justify-center my-auto">
        <svg viewBox="0 0 380 400" className="w-full h-full max-h-[44vh] sm:max-h-[48vh] block" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Hourglass Frame Wood/Gold Gradients */}
            <linearGradient id="hgFrameGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="30%" stopColor="#B45309" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            <linearGradient id="hgCapPlinth" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Top Bulb Fill Gradient */}
            <linearGradient id="hgTopFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.topGradStart} />
              <stop offset="100%" stopColor={config.topGradEnd} />
            </linearGradient>

            {/* Bottom Bulb Fill Gradient */}
            <linearGradient id="hgBottomFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={config.bottomGradStart} />
              <stop offset="100%" stopColor={config.bottomGradEnd} />
            </linearGradient>

            {/* Glass Clip Paths: Outer Glass Bulb Shape */}
            {/* Top Bulb Interior Clip */}
            <clipPath id="topGlassClip">
              <path d="M 120 70 C 120 130 170 180 185 190 L 195 190 C 210 180 260 130 260 70 Z" />
            </clipPath>

            {/* Bottom Bulb Interior Clip */}
            <clipPath id="bottomGlassClip">
              <path d="M 185 190 C 170 200 120 250 120 315 L 260 315 C 260 250 210 200 195 190 Z" />
            </clipPath>
          </defs>

          {/* Background Shadow */}
          <ellipse cx="190" cy="370" rx="95" ry="14" fill="#94A3B8" opacity="0.3" />

          {/* Wooden / Golden Base Pillars (Left & Right) */}
          <rect x="98" y="55" width="16" height="275" rx="6" fill="url(#hgFrameGrad)" stroke="#451A03" strokeWidth="2" />
          <rect x="266" y="55" width="16" height="275" rx="6" fill="url(#hgFrameGrad)" stroke="#451A03" strokeWidth="2" />
          {/* Pillar rings */}
          <circle cx="106" cy="190" r="10" fill="#FDE047" stroke="#B45309" strokeWidth="2" />
          <circle cx="274" cy="190" r="10" fill="#FDE047" stroke="#B45309" strokeWidth="2" />

          {/* GLASS BULB INTERIOR BACKGROUND */}
          {/* Top Bulb Interior Glass */}
          <path
            d="M 120 70 C 120 130 170 180 185 190 L 195 190 C 210 180 260 130 260 70 Z"
            fill="#F8FAFC"
            opacity="0.75"
          />
          {/* Bottom Bulb Interior Glass */}
          <path
            d="M 185 190 C 170 200 120 250 120 315 L 260 315 C 260 250 210 200 195 190 Z"
            fill="#F8FAFC"
            opacity="0.75"
          />

          {/* TOP BULB FILL (DRAINS AS TIME PASSES) */}
          <g clipPath="url(#topGlassClip)">
            {clamped < 0.995 && (
              <g>
                {/* Main filled body */}
                <rect x="110" y={topSurfaceY} width="160" height="130" fill="url(#hgTopFill)" />
                {/* Draining funnel depression in center */}
                <path
                  d={`M 110 ${topSurfaceY} Q 190 ${topSurfaceY + 12} 270 ${topSurfaceY} L 270 200 L 110 200 Z`}
                  fill="url(#hgTopFill)"
                />
                {/* Shimmer line across draining surface */}
                <path
                  d={`M 125 ${topSurfaceY} Q 190 ${topSurfaceY + 10} 255 ${topSurfaceY}`}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  opacity="0.6"
                  fill="none"
                />
                {/* Little sparkling specks in top sand */}
                <circle cx="160" cy={topSurfaceY + 15} r="2" fill="#FFFFFF" opacity="0.7" />
                <circle cx="210" cy={topSurfaceY + 25} r="1.5" fill="#FFFFFF" opacity="0.8" />
                <circle cx="185" cy={topSurfaceY + 40} r="2" fill="#FFFFFF" opacity="0.6" />
              </g>
            )}
          </g>

          {/* BOTTOM BULB FILL (GROWS AS TIME PASSES) */}
          <g clipPath="url(#bottomGlassClip)">
            {clamped > 0.01 && (
              <g>
                {/* Base pool of sand / water */}
                <path
                  d={`M 110 ${bottomSurfaceY} Q 190 ${bottomMoundPeakY} 270 ${bottomSurfaceY} L 270 330 L 110 330 Z`}
                  fill="url(#hgBottomFill)"
                />
                {/* Ripple or sand mound highlight curve */}
                <path
                  d={`M 130 ${bottomSurfaceY + 2} Q 190 ${bottomMoundPeakY} 250 ${bottomSurfaceY + 2}`}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                  fill="none"
                />

                {/* Bubbles if water, or glitter specks if sand */}
                {config.itemType === 'water' ? (
                  <g fill="#FFFFFF" opacity="0.6">
                    <circle cx="170" cy={bottomSurfaceY + 25} r="3" />
                    <circle cx="205" cy={bottomSurfaceY + 35} r="2.5" />
                    <circle cx="185" cy={bottomSurfaceY + 50} r="4" />
                    <circle cx="220" cy={bottomSurfaceY + 60} r="2" />
                  </g>
                ) : (
                  <g fill="#FFFFFF" opacity="0.7">
                    <circle cx="175" cy={bottomMoundPeakY + 15} r="2" />
                    <circle cx="205" cy={bottomMoundPeakY + 25} r="1.5" />
                    <circle cx="190" cy={bottomMoundPeakY + 35} r="2.5" />
                    <circle cx="160" cy={bottomMoundPeakY + 45} r="2" />
                  </g>
                )}
              </g>
            )}
          </g>

          {/* ACTIVE FLOWING STREAM THROUGH NECK */}
          {isFlowing && (
            <g>
              {/* Central fluid/sand jet */}
              <line
                x1="190"
                y1="185"
                x2="190"
                y2={Math.min(310, bottomMoundPeakY + 4)}
                stroke={config.streamColor}
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Animated falling particles / droplets */}
              <motion.g
                animate={{ y: [0, 80] }}
                transition={{ repeat: Infinity, duration: 0.65, ease: 'linear' }}
              >
                <circle cx="190" cy="195" r="2.5" fill={config.particleColor} />
                <circle cx="190" cy="225" r="3" fill="#FFFFFF" />
                <circle cx="190" cy="255" r="2.5" fill={config.particleColor} />
              </motion.g>

              {/* Splashing spray / ripples at bottom impact point */}
              <motion.circle
                cx="190"
                cy={bottomMoundPeakY}
                r="6"
                fill={config.streamColor}
                opacity="0.8"
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.8, 0.3, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.4 }}
              />
            </g>
          )}

          {/* OUTER GLASS CONTOUR & REFLECTIONS */}
          {/* Top & Bottom Glass Contour */}
          <path
            d="M 120 70 C 120 130 170 180 185 190 C 170 200 120 250 120 315 L 260 315 C 260 250 210 200 195 190 C 210 180 260 130 260 70 Z"
            stroke="#94A3B8"
            strokeWidth="3.5"
            fill="none"
          />

          {/* Left Glass Specular Highlights */}
          <path
            d="M 132 85 C 132 125 158 158 174 175"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.65"
            fill="none"
          />
          <path
            d="M 132 300 C 132 260 158 225 174 205"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.65"
            fill="none"
          />

          {/* Checkpoint measurement notches on glass edge */}
          {[
            { y: 105, label: '3/4' },
            { y: 135, label: '1/2' },
            { y: 160, label: '1/4' },
          ].map((notch) => (
            <line
              key={notch.y}
              x1="250"
              y1={notch.y}
              x2="258"
              y2={notch.y}
              stroke="#64748B"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}

          {/* TOP WOODEN CAP / PLINTH */}
          <rect x="85" y="44" width="210" height="18" rx="7" fill="url(#hgCapPlinth)" stroke="#451A03" strokeWidth="2.5" />
          <rect x="100" y="36" width="180" height="12" rx="5" fill="url(#hgFrameGrad)" stroke="#451A03" strokeWidth="2" />
          <circle cx="190" cy="36" r="6" fill="#FDE047" stroke="#B45309" strokeWidth="1.5" />

          {/* BOTTOM WOODEN BASE / PLINTH */}
          <rect x="85" y="316" width="210" height="18" rx="7" fill="url(#hgCapPlinth)" stroke="#451A03" strokeWidth="2.5" />
          <rect x="75" y="332" width="230" height="18" rx="8" fill="url(#hgFrameGrad)" stroke="#451A03" strokeWidth="2.5" />

          {/* Finished Celebration Burst Sparkles */}
          {isFinished && (
            <g fill="#FACC15">
              <polygon points="190,130 193,138 201,138 194,143 197,151 190,146 183,151 186,143 179,138 187,138" />
              <polygon points="150,110 152,116 158,116 153,120 155,126 150,122 145,126 147,120 142,116 148,116" />
              <polygon points="230,110 232,116 238,116 233,120 235,126 230,122 225,126 227,120 222,116 228,116" />
              <circle cx="190" cy="270" r="4" fill="#FFFFFF" />
              <circle cx="165" cy="250" r="3" fill="#FFFFFF" />
              <circle cx="215" cy="250" r="3" fill="#FFFFFF" />
            </g>
          )}
        </svg>

        {/* Mascot standing beside the hourglass */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4">
          <CharacterAvatar
            characterId={characterId}
            mood={isFinished ? 'celebrate' : isAlmostDone ? 'almost' : 'happy'}
            size={85}
          />
        </div>
      </div>

      {/* Quick Item & Color Palette Switcher - Placed cleanly BELOW the hourglass */}
      {onSelectFillType && (
        <div className="flex items-center gap-1 sm:gap-2 mt-2 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm border border-amber-200">
          <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider mr-1">
            Fill:
          </span>
          {(Object.keys(HOURGLASS_FILL_CONFIGS) as HourglassFillType[]).map((key) => {
            const item = HOURGLASS_FILL_CONFIGS[key];
            const isSelected = fillType === key;
            return (
              <button
                key={key}
                onClick={() => onSelectFillType(key)}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? `${item.badgeColor} border shadow-sm scale-105 font-black ring-2 ring-amber-300`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title={item.label}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
