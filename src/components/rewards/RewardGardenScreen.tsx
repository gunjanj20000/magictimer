import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GardenReward, CharacterId, SoundMode } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';
import { playSoftTap } from '../../services/audio';
import { ChevronLeft, Star, Heart, Sparkles } from 'lucide-react';

interface RewardGardenScreenProps {
  rewards: GardenReward[];
  characterId: CharacterId;
  soundMode: SoundMode;
  totalStars: number;
  onBack: () => void;
}

export const RewardGardenScreen: React.FC<RewardGardenScreenProps> = ({
  rewards,
  characterId,
  soundMode,
  totalStars,
  onBack,
}) => {
  const [tappedRewardId, setTappedRewardId] = useState<string | null>(null);

  const handleTapItem = (id: string) => {
    setTappedRewardId(id);
    playSoftTap(soundMode);
    setTimeout(() => setTappedRewardId(null), 1000);
  };

  // If no rewards yet, provide at least 2 starter friendly flowers so the garden never looks empty
  const displayRewards = rewards.length > 0 ? rewards : [
    { id: 'starter_1', type: 'flower', title: 'First Daisy', earnedAt: 0, posX: 30, posY: 65, variant: 0 },
    { id: 'starter_2', type: 'butterfly', title: 'Gentle Flutter', earnedAt: 0, posX: 70, posY: 40, variant: 1 },
  ];

  return (
    <div className="w-full h-full min-h-screen flex flex-col justify-between select-none relative overflow-hidden animate-fade-in">
      {/* Top Header Bar */}
      <div className="relative z-30 w-full p-4 sm:p-6 flex items-center justify-between max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-bold text-sm shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Garden Home</span>
        </button>

        {/* Total Stars Counter Badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-400 px-5 py-2.5 rounded-full shadow-lg border-2 border-white">
          <Star className="w-6 h-6 fill-amber-600 text-amber-600 animate-spin-slow" />
          <span className="font-black text-amber-950 text-xl sm:text-2xl">
            {totalStars} Stars
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="relative z-20 text-center px-4 -mt-2 mb-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 drop-shadow-sm flex items-center justify-center gap-2">
          <span>My Magic Garden</span>
          <Sparkles className="w-7 h-7 text-amber-400" />
        </h1>
        <p className="text-sm font-semibold text-slate-600">
          Tap your flowers and butterflies to play with them! 🌸
        </p>
      </div>

      {/* Interactive Garden Meadow Canvas */}
      <div className="relative z-20 flex-1 w-full max-w-5xl mx-auto px-4 py-2 min-h-[420px] relative">
        {/* Child's Favorite Character roaming happily in the garden */}
        <div className="absolute left-8 bottom-8 z-30 cursor-pointer" onClick={() => playSoftTap(soundMode)}>
          <CharacterAvatar characterId={characterId} mood="celebrate" size={110} />
        </div>

        {/* Garden items positioned in the meadow */}
        {displayRewards.map((item) => {
          const isTapped = tappedRewardId === item.id;

          return (
            <motion.div
              key={item.id}
              onClick={() => handleTapItem(item.id)}
              className="absolute cursor-pointer transition-transform z-20"
              style={{
                left: `${item.posX}%`,
                top: `${item.posY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={
                isTapped
                  ? { scale: [1, 1.4, 1], rotate: [-15, 15, 0], y: [0, -20, 0] }
                  : { y: [0, -6, 0] }
              }
              transition={{
                duration: isTapped ? 0.6 : 3 + (item.variant || 0),
                repeat: isTapped ? 0 : Infinity,
                ease: 'easeInOut',
              }}
            >
              {item.type === 'butterfly' ? (
                <div className="relative">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 24 Q10 10 8 26 Q16 34 24 26 Z" fill="#F472B6" />
                    <path d="M24 24 Q38 10 40 26 Q32 34 24 26 Z" fill="#F472B6" />
                    <path d="M24 24 Q12 32 14 42 Q22 40 24 26 Z" fill="#C084FC" />
                    <path d="M24 24 Q36 32 34 42 Q26 40 24 26 Z" fill="#C084FC" />
                    <ellipse cx="24" cy="26" rx="2.5" ry="9" fill="#334155" />
                  </svg>
                  {isTapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute -top-4 -right-4"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  )}
                </div>
              ) : item.type === 'tree' ? (
                <div className="relative">
                  <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
                    <rect x="28" y="50" width="14" height="35" rx="4" fill="#92400E" />
                    <circle cx="35" cy="40" r="30" fill="#22C55E" />
                    <circle cx="20" cy="30" r="16" fill="#4ADE80" />
                    <circle cx="50" cy="30" r="16" fill="#4ADE80" />
                    <circle cx="35" cy="20" r="18" fill="#86EFAC" />
                    {/* Apples */}
                    <circle cx="28" cy="35" r="4.5" fill="#EF4444" />
                    <circle cx="42" cy="42" r="4.5" fill="#EF4444" />
                    <circle cx="35" cy="25" r="4.5" fill="#EF4444" />
                  </svg>
                </div>
              ) : (
                // Blooming Flower
                <div className="relative">
                  <svg width="55" height="55" viewBox="0 0 60 60" fill="none">
                    {/* Stem & Leaves */}
                    <path d="M30 30 C30 45 28 55 30 60" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
                    <path d="M30 46 Q20 40 16 48" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
                    <path d="M30 44 Q40 38 44 46" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />
                    {/* Petals */}
                    {[0, 60, 120, 180, 240, 300].map((deg) => {
                      const rad = (deg * Math.PI) / 180;
                      const px = 30 + Math.cos(rad) * 14;
                      const py = 26 + Math.sin(rad) * 14;
                      const colors = ['#F87171', '#FB923C', '#FACC15', '#4ADE80', '#60A5FA', '#C084FC'];
                      return (
                        <circle
                          key={deg}
                          cx={px}
                          cy={py}
                          r="9"
                          fill={colors[(deg / 60 + (item.variant || 0)) % colors.length]}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                    {/* Center */}
                    <circle cx="30" cy="26" r="11" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2" />
                    <circle cx="27" cy="24" r="1.5" fill="#1E293B" />
                    <circle cx="33" cy="24" r="1.5" fill="#1E293B" />
                    <path d="M28 27 Q30 30 32 27" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </svg>
                  {isTapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute -top-3 -right-3"
                    >
                      <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="relative z-30 w-full p-4 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-pink-100 shadow-sm flex items-center gap-3">
          <span className="text-xs sm:text-sm font-bold text-slate-700">
            Every completed sitting timer grows another flower or animal friend! 🌷
          </span>
        </div>
      </div>
    </div>
  );
};
