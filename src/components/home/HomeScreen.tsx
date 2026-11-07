import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterId, ParentSettings, TimerMode } from '../../types';
import { CharacterAvatar, CHARACTER_META } from '../characters/CharacterAvatar';
import { MovableMascot } from '../characters/MovableMascot';
import { Sparkles, Star, Settings } from 'lucide-react';

interface HomeScreenProps {
  settings: ParentSettings;
  currentMode: TimerMode;
  totalStars: number;
  onSelectCharacter: (id: CharacterId) => void;
  onStartSitting: () => void;
  onOpenFirstThen: () => void;
  onOpenRewards: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  currentMode,
  totalStars,
  onSelectCharacter,
  onStartSitting,
  onOpenFirstThen,
  onOpenRewards,
  onOpenSettings,
}) => {
  const [showCharPicker, setShowCharPicker] = useState(false);

  const characterName = CHARACTER_META.find((c) => c.id === settings.character)?.name.split(' ')[0] || 'Bunny';

  const modeDescriptions: { [key in TimerMode]: { icon: string; subtitle: string } } = {
    garden: { icon: '🌸', subtitle: 'Watch Flower Grow' },
    rainbow: { icon: '🌈', subtitle: 'Watch Rainbow Fill' },
    journey: { icon: '🏡', subtitle: `${characterName}'s Journey` },
    balloon: { icon: '🎈', subtitle: 'Float Balloon' },
    butterfly: { icon: '🦋', subtitle: 'Butterfly Hop' },
    sunset: { icon: '🌙', subtitle: 'Gentle Sunset' },
    hourglass: { icon: '⏳', subtitle: 'Hourglass Stream' },
  };

  const activeModeVisual = modeDescriptions[currentMode] || modeDescriptions.garden;

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-5xl mx-auto select-none">
      {/* Top Bar: Title & Parent Settings Icon */}
      <div className="w-full flex items-center justify-between z-20">
        {/* Child Character Picker Pill */}
        <button
          onClick={() => setShowCharPicker(!showCharPicker)}
          className="flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-full shadow-sm border border-pink-100 transition-transform active:scale-95"
        >
          <CharacterAvatar characterId={settings.character} mood="happy" size={36} />
          <span className="text-xs sm:text-sm font-black text-slate-700">
            {CHARACTER_META.find((c) => c.id === settings.character)?.name.split(' ')[0]}
          </span>
          <span className="text-xs text-pink-500 font-bold">▼</span>
        </button>

        {/* Stars Counter Pill */}
        <button
          onClick={onOpenRewards}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 text-amber-950 px-4 py-2 rounded-full shadow-md border-2 border-white transition-transform active:scale-95"
        >
          <Star className="w-5 h-5 fill-amber-700 text-amber-700" />
          <span className="font-black text-sm sm:text-base">{totalStars}</span>
        </button>

        {/* Parent Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-11 h-11 rounded-2xl bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200 flex items-center justify-center transition-colors"
          title="Parent Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Character Picker Dropdown */}
      {showCharPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-4 z-40 bg-white rounded-3xl p-3 shadow-2xl border-2 border-pink-200 grid grid-cols-3 gap-2"
        >
          {CHARACTER_META.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelectCharacter(c.id);
                setShowCharPicker(false);
              }}
              className={`p-2 rounded-2xl border flex flex-col items-center ${
                settings.character === c.id
                  ? 'bg-pink-100 border-pink-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-pink-50'
              }`}
            >
              <CharacterAvatar characterId={c.id} mood="happy" size={45} />
              <span className="text-[10px] font-bold text-slate-700 mt-1">{c.name.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>
      )}

      {/* Center Welcome Hero: App Name & Kid's Friendly Mascot */}
      <div className="relative z-10 flex flex-col items-center my-2 text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-800 tracking-tight drop-shadow-sm flex items-center gap-2 sm:gap-3">
          <span>Magic Garden</span>
          <Sparkles className="w-8 h-8 sm:w-11 sm:h-11 text-amber-400 animate-spin-slow" />
        </h1>
        <p className="text-sm sm:text-base font-extrabold text-pink-600 tracking-wide mt-1">
          Watch, Grow, and Celebrate! 🌷
        </p>

        {/* Big Interactive Movable Mascot (Child can drag or play with anywhere) */}
        <div className="my-2 sm:my-4 z-30">
          <MovableMascot characterId={settings.character} mood="happy" size={145} showHint={true} />
        </div>
      </div>

      {/* 4 Large Visual Buttons for the Child (Minimal Text, Large Picture Icons) */}
      <div className="relative z-20 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-2">
        {/* 1. START SITTING BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartSitting}
          className="col-span-1 rounded-4xl p-4 sm:p-5 bg-gradient-to-tr from-emerald-400 to-green-500 text-white shadow-xl shadow-green-200 border-4 border-white flex flex-col items-center justify-between text-center transition-all"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-white/25 flex items-center justify-center text-4xl mb-2 shadow-inner">
            <span>{activeModeVisual.icon}</span>
          </div>
          <span className="font-black text-base sm:text-xl leading-tight">
            START SITTING
          </span>
          <span className="text-xs font-bold text-green-100 mt-0.5">
            {activeModeVisual.subtitle}
          </span>
        </motion.button>

        {/* 2. FIRST-THEN BUTTON */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenFirstThen}
          className="col-span-1 rounded-4xl p-4 sm:p-5 bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-xl shadow-purple-200 border-4 border-white flex flex-col items-center justify-between text-center transition-all"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-white/25 flex items-center justify-center text-3xl mb-2 shadow-inner">
            <span>🪑 ➜ 🧸</span>
          </div>
          <span className="font-black text-base sm:text-xl leading-tight">
            FIRST – THEN
          </span>
          <span className="text-xs font-bold text-pink-100 mt-0.5">
            First Sit, Then Play
          </span>
        </motion.button>

        {/* 3. MY STARS (GARDEN REWARDS) */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenRewards}
          className="col-span-1 rounded-4xl p-4 sm:p-5 bg-gradient-to-tr from-amber-400 to-yellow-500 text-white shadow-xl shadow-yellow-200 border-4 border-white flex flex-col items-center justify-between text-center transition-all"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-white/25 flex items-center justify-center text-4xl mb-2 shadow-inner">
            <span>🌟</span>
          </div>
          <span className="font-black text-base sm:text-xl leading-tight">
            MY STARS
          </span>
          <span className="text-xs font-bold text-amber-100 mt-0.5">
            {totalStars} in Garden
          </span>
        </motion.button>

        {/* 4. PARENT SETTINGS / TRAINING */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSettings}
          className="col-span-1 rounded-4xl p-4 sm:p-5 bg-white/90 hover:bg-white text-slate-700 shadow-xl border-4 border-slate-200 hover:border-amber-300 flex flex-col items-center justify-between text-center transition-all"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-amber-50 flex items-center justify-center text-3xl mb-2 shadow-inner text-amber-500">
            <span>🌻</span>
          </div>
          <span className="font-black text-base sm:text-xl leading-tight text-slate-800">
            SETTINGS
          </span>
          <span className="text-xs font-bold text-slate-400 mt-0.5">
            Times & Safeguards
          </span>
        </motion.button>
      </div>
    </div>
  );
};
