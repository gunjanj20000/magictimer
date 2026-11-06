import React from 'react';
import { motion } from 'framer-motion';

interface VisualCheckpointsProps {
  progress: number; // 0 to 1
  className?: string;
}

export const VisualCheckpoints: React.FC<VisualCheckpointsProps> = ({ progress, className = '' }) => {
  // 4 visual stages:
  // 0: Sprout (Start)
  // 1: Little Bud (1/3)
  // 2: Growing Blossom (2/3)
  // 3: Golden Star Flower (Finish)
  const stages = [
    { threshold: 0.05, symbol: '🌱', label: 'Start' },
    { threshold: 0.33, symbol: '🌿', label: 'Growing' },
    { threshold: 0.66, symbol: '🌸', label: 'Almost' },
    { threshold: 0.99, symbol: '🌟', label: 'All Done!' },
  ];

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-6 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-white/60 ${className}`}>
      {stages.map((stage, i) => {
        const isReached = progress >= stage.threshold;
        const isCurrent =
          progress >= stage.threshold &&
          (i === stages.length - 1 || progress < stages[i + 1].threshold);

        return (
          <div key={i} className="flex items-center gap-2">
            <motion.div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all duration-300 ${
                isReached
                  ? 'bg-gradient-to-tr from-amber-200 to-yellow-100 text-slate-800 shadow-md ring-2 ring-amber-400 scale-105'
                  : 'bg-slate-100/80 text-slate-400 opacity-50'
              }`}
              animate={isCurrent ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span>{stage.symbol}</span>
            </motion.div>

            {/* Connecting dot line between checkpoints */}
            {i < stages.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-1.5 rounded-full transition-colors duration-300 ${
                  progress >= stages[i + 1].threshold ? 'bg-amber-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
