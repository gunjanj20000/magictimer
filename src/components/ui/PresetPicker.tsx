import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TimerMode, CharacterId } from '../../types';
import { CHARACTER_META } from '../characters/CharacterAvatar';
import { Play, Sparkles, Check } from 'lucide-react';

interface PresetPickerProps {
  availablePresets: number[]; // in seconds
  selectedSec: number;
  selectedMode: TimerMode;
  characterId: CharacterId;
  onSelectSec: (sec: number) => void;
  onSelectMode: (mode: TimerMode) => void;
  onStart: (sec: number, mode: TimerMode) => void;
  className?: string;
}

export const PRESET_VISUALS: { [key: number]: { symbol: string; title: string; color: string; desc: string } } = {
  30: { symbol: '🌱', title: 'Tiny Sprout', color: 'from-emerald-300 to-green-400', desc: 'Quick & Gentle' },
  60: { symbol: '🌿', title: 'Little Leaf', color: 'from-green-300 to-teal-400', desc: 'Short Sitting' },
  120: { symbol: '🌷', title: 'Sweet Tulip', color: 'from-pink-300 to-rose-400', desc: 'Just Right' },
  180: { symbol: '🌼', title: 'Daisy Bloom', color: 'from-yellow-300 to-amber-400', desc: 'Good Sitting' },
  300: { symbol: '🌻', title: 'Sunny Sunflower', color: 'from-amber-300 to-orange-400', desc: 'Sunny Time' },
  420: { symbol: '🌸', title: 'Cherry Blossom', color: 'from-fuchsia-300 to-pink-400', desc: 'Calm Focus' },
  600: { symbol: '🌺', title: 'Rainbow Bloom', color: 'from-purple-300 to-indigo-400', desc: 'Great Job' },
  900: { symbol: '🍎', title: 'Apple Tree', color: 'from-red-300 to-pink-400', desc: 'Big Journey' },
  1200: { symbol: '🌈', title: 'Full Rainbow', color: 'from-sky-300 to-blue-500', desc: 'Hero Sitting' },
  1800: { symbol: '🏰', title: 'Garden Castle', color: 'from-violet-300 to-purple-500', desc: 'Master Garden' },
};

function formatMinutes(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const rem = sec % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

export const PresetPicker: React.FC<PresetPickerProps> = ({
  availablePresets,
  selectedSec,
  selectedMode,
  characterId,
  onSelectSec,
  onSelectMode,
  onStart,
  className = '',
}) => {
  const [customMinutes, setCustomMinutes] = useState(Math.round(selectedSec / 60) || 2);
  const [showCustom, setShowCustom] = useState(false);

  const characterName = CHARACTER_META.find((c) => c.id === characterId)?.name.split(' ')[0] || 'Bunny';

  const timerModesInfo: {
    id: TimerMode;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
  }[] = [
    { id: 'garden', title: 'Magic Flower', subtitle: 'Grows & blooms', icon: '🌸', color: 'from-pink-300 to-rose-400' },
    { id: 'rainbow', title: 'Rainbow Arch', subtitle: 'Colors fill up', icon: '🌈', color: 'from-amber-300 to-orange-400' },
    { id: 'journey', title: `${characterName} Journey`, subtitle: 'Walks to cozy home', icon: '🏡', color: 'from-emerald-300 to-teal-400' },
    { id: 'balloon', title: 'Balloon Float', subtitle: 'Gently ascends', icon: '🎈', color: 'from-sky-300 to-blue-400' },
    { id: 'butterfly', title: 'Butterfly Hop', subtitle: 'Flutters to flowers', icon: '🦋', color: 'from-purple-300 to-indigo-400' },
    { id: 'sunset', title: 'Sunset to Moon', subtitle: 'Day turns to night', icon: '🌙', color: 'from-indigo-300 to-violet-400' },
  ];

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* STEP 1: FIRST SELECT TIME */}
      <div className="w-full mb-6">
        <div className="text-center mb-3">
          <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider">
            Step 1: Select Sitting Time ⏱️
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            How long will we sit?
          </h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4 w-full p-2">
          {availablePresets.map((sec) => {
            const isSelected = selectedSec === sec && !showCustom;
            const visual = PRESET_VISUALS[sec] || {
              symbol: '🌸',
              title: formatMinutes(sec),
              color: 'from-teal-300 to-emerald-400',
              desc: formatMinutes(sec),
            };

            return (
              <motion.button
                key={sec}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowCustom(false);
                  onSelectSec(sec);
                }}
                className={`relative rounded-3xl p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-between border-4 ${
                  isSelected
                    ? 'bg-white shadow-xl ring-4 ring-amber-400/50 border-amber-400 scale-105'
                    : 'bg-white/80 hover:bg-white border-transparent hover:border-amber-200 shadow-md'
                }`}
              >
                {/* Symbol bubble */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${visual.color} flex items-center justify-center text-2xl sm:text-3xl shadow-md mb-2`}
                >
                  <span>{visual.symbol}</span>
                </div>

                {/* Kid-friendly title */}
                <span className="font-extrabold text-slate-700 text-xs sm:text-sm leading-tight">
                  {visual.title}
                </span>

                {/* Subtitle with duration badge */}
                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                  {formatMinutes(sec)}
                </span>

                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1 shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Duration Toggle & Slider */}
        <div className="w-full mt-2 px-3 flex flex-col items-center">
          {!showCustom ? (
            <button
              onClick={() => setShowCustom(true)}
              className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-700 underline decoration-dotted"
            >
              Choose Custom Sitting Minutes
            </button>
          ) : (
            <div className="w-full max-w-sm bg-white/90 rounded-2xl p-4 shadow-sm border border-pink-100 flex flex-col items-center">
              <span className="font-bold text-slate-700 text-sm mb-2">
                Custom Time: {customMinutes} Minutes
              </span>
              <input
                type="range"
                min="1"
                max="60"
                value={customMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomMinutes(val);
                  onSelectSec(val * 60);
                }}
                className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* STEP 2: THEN CHOOSE ANIMATION */}
      <div className="w-full mb-6">
        <div className="text-center mb-3">
          <span className="px-4 py-1 rounded-full bg-pink-100 text-pink-700 font-black text-xs uppercase tracking-wider">
            Step 2: Choose Animation ✨
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            What would you like to watch grow?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full px-2">
          {timerModesInfo.map((m) => {
            const isSelected = selectedMode === m.id;

            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectMode(m.id)}
                className={`relative rounded-3xl p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-between border-4 ${
                  isSelected
                    ? 'bg-white shadow-xl ring-4 ring-pink-400/50 border-pink-500 scale-105 z-10'
                    : 'bg-white/80 hover:bg-white border-transparent hover:border-pink-200 shadow-md'
                }`}
              >
                {/* Icon bubble */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-3xl sm:text-4xl shadow-md mb-2`}
                >
                  <span>{m.icon}</span>
                </div>

                <span className="font-black text-slate-800 text-sm sm:text-base leading-tight">
                  {m.title}
                </span>

                <span className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {m.subtitle}
                </span>

                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-md flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: START SITTING */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onStart(selectedSec, selectedMode)}
        className="w-full max-w-md mt-2 mb-4 py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-white font-black text-xl sm:text-2xl shadow-xl shadow-green-200/80 border-4 border-white flex items-center justify-center gap-3 transition-transform"
      >
        <Play className="w-8 h-8 fill-current" />
        <span>Step 3: Start Sitting 🌸</span>
      </motion.button>
    </div>
  );
};
