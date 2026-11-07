import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterId } from '../../types';
import { CharacterAvatar, CHARACTER_META } from './CharacterAvatar';
import { playSoftTap } from '../../services/audio';

interface MovableMascotProps {
  characterId: CharacterId;
  mood?: 'idle' | 'walk' | 'happy' | 'almost' | 'celebrate';
  size?: number;
  className?: string;
  showHint?: boolean;
}

export const MovableMascot: React.FC<MovableMascotProps> = ({
  characterId,
  mood = 'happy',
  size = 88,
  className = '',
  showHint = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const characterName = CHARACTER_META.find((c) => c.id === characterId)?.name.split(' ')[0] || 'Friend';

  const handleDragStart = () => {
    setIsDragging(true);
    setHasInteracted(true);
    playSoftTap('gentle');
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    playSoftTap('gentle');
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 1.12 }}
      whileDrag={{
        scale: 1.25,
        rotate: [-4, 4, -4],
        filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.22))',
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`touch-none cursor-grab active:cursor-grabbing select-none z-30 inline-block ${className}`}
      title={`Touch & move ${characterName} anywhere!`}
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full flex items-center justify-center pointer-events-auto">
        <CharacterAvatar
          characterId={characterId}
          mood={isDragging ? 'celebrate' : mood}
          size={size}
        />

        {/* Playful Floating Hearts & Sparkles when the child is picking up and moving the character */}
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: [1, 1.3, 1], y: [-6, -18] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute -top-4 text-xl pointer-events-none select-none"
          >
            💖✨
          </motion.div>
        )}

        {/* Gentle Kid-Friendly Hint Bubble before first touch */}
        {!hasInteracted && showHint && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: [0.75, 1, 0.75], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-black text-amber-900 border border-amber-300 shadow-sm pointer-events-none select-none flex items-center gap-1"
          >
            <span>👋</span>
            <span>Move {characterName}!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
