import React from 'react';
import { motion } from 'framer-motion';
import { VisualTheme } from '../../types';

interface GardenBackgroundProps {
  theme?: VisualTheme;
  showSun?: boolean;
  showRainbow?: boolean;
  showClouds?: boolean;
  showHills?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const GardenBackground: React.FC<GardenBackgroundProps> = ({
  theme = 'pastel',
  showSun = true,
  showRainbow = true,
  showClouds = true,
  showHills = true,
  children,
  className = '',
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isBright = theme === 'bright';

  // Sky gradient classes
  const skyClass = isHighContrast
    ? 'bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100'
    : isBright
    ? 'bg-gradient-to-b from-[#38BDF8] via-[#BAE6FD] to-[#FEF08A]'
    : 'bg-gradient-to-b from-[#E0F2FE] via-[#F0FDF4] to-[#FEFCE8]';

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between ${skyClass} ${className}`}>
      {/* Sky elements layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Rainbow */}
        {showRainbow && (
          <div className="absolute -top-12 -left-16 sm:left-4 md:left-12 opacity-60 sm:opacity-80">
            <svg width="280" height="150" viewBox="0 0 280 150" fill="none">
              <path d="M 10 150 A 130 130 0 0 1 270 150" stroke="#F87171" strokeWidth="10" strokeLinecap="round" />
              <path d="M 22 150 A 118 118 0 0 1 258 150" stroke="#FB923C" strokeWidth="10" strokeLinecap="round" />
              <path d="M 34 150 A 106 106 0 0 1 246 150" stroke="#FACC15" strokeWidth="10" strokeLinecap="round" />
              <path d="M 46 150 A 94 94 0 0 1 234 150" stroke="#4ADE80" strokeWidth="10" strokeLinecap="round" />
              <path d="M 58 150 A 82 82 0 0 1 222 150" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round" />
              <path d="M 70 150 A 70 70 0 0 1 210 150" stroke="#C084FC" strokeWidth="10" strokeLinecap="round" />
            </svg>
          </div>
        )}

        {/* Smiling Sun */}
        {showSun && (
          <motion.div
            className="absolute top-4 right-4 sm:top-8 sm:right-12"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          >
            <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
              {/* Rays */}
              <g stroke="#FDE047" strokeWidth="6" strokeLinecap="round" opacity="0.9">
                <line x1="50" y1="6" x2="50" y2="18" />
                <line x1="50" y1="82" x2="50" y2="94" />
                <line x1="6" y1="50" x2="18" y2="50" />
                <line x1="82" y1="50" x2="94" y2="50" />
                <line x1="19" y1="19" x2="28" y2="28" />
                <line x1="72" y1="72" x2="81" y2="81" />
                <line x1="19" y1="81" x2="28" y2="72" />
                <line x1="72" y1="28" x2="81" y2="19" />
              </g>
              {/* Sun Core */}
              <circle cx="50" cy="50" r="28" fill="#FACC15" stroke="#F59E0B" strokeWidth="2.5" />
              {/* Sun Cheeks */}
              <circle cx="40" cy="55" r="4" fill="#F87171" opacity="0.5" />
              <circle cx="60" cy="55" r="4" fill="#F87171" opacity="0.5" />
              {/* Sun Eyes */}
              <circle cx="43" cy="47" r="3" fill="#1E293B" />
              <circle cx="57" cy="47" r="3" fill="#1E293B" />
              <circle cx="42" cy="46" r="1" fill="#FFFFFF" />
              <circle cx="56" cy="46" r="1" fill="#FFFFFF" />
              {/* Sun Smile */}
              <path d="M45 54 Q50 60 55 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>
        )}

        {/* Gentle Drifting Clouds */}
        {showClouds && (
          <>
            <motion.div
              className="absolute top-12 left-1/4 opacity-80"
              animate={{ x: [0, 30, 0] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'easeInOut' }}
            >
              <svg width="110" height="55" viewBox="0 0 110 55" fill="#FFFFFF">
                <path d="M 25 45 Q 10 45 15 32 Q 10 18 28 20 Q 38 8 58 14 Q 72 6 86 18 Q 102 18 100 35 Q 108 45 92 45 Z" opacity="0.85" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute top-28 right-1/4 opacity-70"
              animate={{ x: [0, -25, 0] }}
              transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
            >
              <svg width="90" height="45" viewBox="0 0 90 45" fill="#FFFFFF">
                <path d="M 20 38 Q 8 38 12 26 Q 8 16 22 18 Q 30 8 48 12 Q 60 6 72 16 Q 85 16 82 30 Q 88 38 75 38 Z" opacity="0.8" />
              </svg>
            </motion.div>
          </>
        )}

        {/* Flying Butterfly */}
        <motion.div
          className="absolute top-1/3 left-8 sm:left-20"
          animate={{
            x: [0, 40, 20, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        >
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            {/* Left Wings */}
            <path d="M20 20 Q8 10 6 22 Q12 28 20 22 Z" fill="#F472B6" />
            <path d="M20 20 Q10 26 12 34 Q18 32 20 22 Z" fill="#C084FC" />
            {/* Right Wings */}
            <path d="M20 20 Q32 10 34 22 Q28 28 20 22 Z" fill="#F472B6" />
            <path d="M20 20 Q30 26 28 34 Q22 32 20 22 Z" fill="#C084FC" />
            {/* Body */}
            <ellipse cx="20" cy="22" rx="2" ry="7" fill="#475569" />
          </svg>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col w-full h-full">
        {children}
      </div>

      {/* Ground & Grass Hills Layer */}
      {showHills && (
        <div className="relative w-full pointer-events-none z-0 mt-auto">
          <svg viewBox="0 0 1200 160" preserveAspectRatio="none" className="w-full h-24 sm:h-32 md:h-40 block">
            {/* Back Hill */}
            <path
              d="M0 80 Q300 20 600 70 T1200 60 L1200 160 L0 160 Z"
              fill={isHighContrast ? '#22C55E' : isBright ? '#4ADE80' : '#86EFAC'}
              opacity="0.75"
            />
            {/* Front Hill */}
            <path
              d="M0 100 Q400 50 800 100 T1200 90 L1200 160 L0 160 Z"
              fill={isHighContrast ? '#16A34A' : isBright ? '#22C55E' : '#4ADE80'}
            />
            {/* Soft decorative flower patches on the hills */}
            <circle cx="150" cy="115" r="5" fill="#F472B6" />
            <circle cx="150" cy="115" r="2" fill="#FDE047" />
            <circle cx="380" cy="95" r="6" fill="#FBBF24" />
            <circle cx="380" cy="95" r="2.5" fill="#FFFFFF" />
            <circle cx="720" cy="120" r="6" fill="#C084FC" />
            <circle cx="720" cy="120" r="2.5" fill="#FDE047" />
            <circle cx="980" cy="105" r="5" fill="#60A5FA" />
            <circle cx="980" cy="105" r="2" fill="#FFFFFF" />
          </svg>
        </div>
      )}
    </div>
  );
};
