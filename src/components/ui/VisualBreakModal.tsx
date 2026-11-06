import React from 'react';
import { motion } from 'framer-motion';
import { CharacterId } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';
import { Play } from 'lucide-react';

interface VisualBreakModalProps {
  isOpen: boolean;
  characterId: CharacterId;
  onResume: () => void;
}

export const VisualBreakModal: React.FC<VisualBreakModalProps> = ({
  isOpen,
  characterId,
  onResume,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-gradient-to-b from-sky-50 to-pink-50 rounded-4xl p-6 sm:p-8 text-center shadow-2xl border-4 border-white flex flex-col items-center"
      >
        {/* Soft breathing halo around character */}
        <div className="relative my-4 flex items-center justify-center">
          <motion.div
            className="absolute w-44 h-44 rounded-full bg-pink-200/50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />
          <CharacterAvatar characterId={characterId} mood="idle" size={120} />
        </div>

        {/* Visual prompt without complex text */}
        <div className="bg-white/80 rounded-2xl px-5 py-3 mb-6 shadow-sm border border-pink-100">
          <p className="text-xl sm:text-2xl font-black text-slate-700">
            🌸 Peaceful Break 🌸
          </p>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Breathe gently. Take your time!
          </p>
        </div>

        {/* Big friendly Resume button */}
        <button
          onClick={onResume}
          className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-black text-xl sm:text-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 transition-transform active:scale-95 border-2 border-white"
        >
          <Play className="w-8 h-8 fill-current" />
          <span>Ready to Continue</span>
        </button>
      </motion.div>
    </div>
  );
};
