import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CharacterId, ActivityItem } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';
import { Check, Star, ArrowRight } from 'lucide-react';

interface CelebrationModalProps {
  isOpen: boolean;
  characterId: CharacterId;
  firstActivity?: ActivityItem;
  thenActivity?: ActivityItem;
  starsEarned: number;
  onFinish: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  characterId,
  firstActivity,
  thenActivity,
  starsEarned,
  onFinish,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Gentle, soft pastel confetti burst (low velocity, slow gravity, no loud pop)
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#FBBF24', '#4ADE80', '#60A5FA', '#C084FC'],
          gravity: 0.6,
          scalar: 1.2,
          ticks: 200,
        });
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-yellow-50 via-pink-50 to-sky-50 rounded-5xl p-6 sm:p-8 text-center shadow-2xl border-4 border-white flex flex-col items-center"
      >
        {/* Large green checkmark badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-green-200 border-4 border-white -mt-12 mb-3"
        >
          <Check className="w-12 h-12 stroke-[3.5]" />
        </motion.div>

        {/* Happy Character Celebrating */}
        <div className="my-2">
          <CharacterAvatar characterId={characterId} mood="celebrate" size={130} />
        </div>

        {/* Celebration Title */}
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-wide mt-1">
          All Done! 🌟
        </h2>

        {/* Star Reward indicator */}
        <div className="flex items-center gap-2 bg-amber-100/80 border-2 border-amber-300 px-5 py-2 rounded-full my-3">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin-slow" />
          <span className="font-extrabold text-amber-900 text-lg sm:text-xl">
            +{starsEarned} Star Added to Garden!
          </span>
        </div>

        {/* First-Then visual transition if First-Then was running */}
        {firstActivity && thenActivity && (
          <div className="w-full my-3 p-4 rounded-3xl bg-white/90 shadow-md border-2 border-pink-100 flex items-center justify-around gap-2">
            {/* FIRST card (Completed with checkmark) */}
            <div className="flex flex-col items-center opacity-70">
              <div className="relative w-16 h-16 rounded-2xl bg-slate-100 border-2 border-green-400 flex items-center justify-center overflow-hidden">
                {firstActivity.customImageDataUrl ? (
                  <img src={firstActivity.customImageDataUrl} alt={firstActivity.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🪑</span>
                )}
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600 stroke-[3]" />
                </div>
              </div>
              <span className="text-xs font-bold text-slate-500 mt-1">Finished!</span>
            </div>

            {/* Transition Arrow */}
            <ArrowRight className="w-8 h-8 text-amber-500 stroke-[3] animate-pulse" />

            {/* THEN card (Highlighted & pulsing joyful celebration) */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-200 to-amber-200 border-4 border-amber-400 flex items-center justify-center shadow-lg overflow-hidden">
                {thenActivity.customImageDataUrl ? (
                  <img src={thenActivity.customImageDataUrl} alt={thenActivity.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl">🧸</span>
                )}
              </div>
              <span className="text-sm font-black text-pink-600 mt-1">Now: Play! 🎉</span>
            </motion.div>
          </div>
        )}

        {/* Large Big Finish / Home button */}
        <button
          onClick={onFinish}
          className="w-full mt-4 py-4 px-6 rounded-3xl bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-black text-xl sm:text-2xl shadow-lg shadow-purple-200 flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-white"
        >
          <span>Yay! Celebrate! 🌸</span>
        </button>
      </motion.div>
    </div>
  );
};
