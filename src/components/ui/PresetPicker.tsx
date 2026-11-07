import React from 'react';
import { motion } from 'framer-motion';
import { TimerMode, CharacterId, HourglassFillType } from '../../types';
import { CHARACTER_META } from '../characters/CharacterAvatar';
import { HOURGLASS_FILL_CONFIGS } from '../timers/HourglassTimer';
import { Play, Sparkles, Check, Minus, Plus } from 'lucide-react';

interface PresetPickerProps {
  availablePresets: number[]; // in seconds
  selectedSec: number;
  selectedMode: TimerMode;
  characterId: CharacterId;
  hourglassFill?: HourglassFillType;
  onSelectSec: (sec: number) => void;
  onSelectMode: (mode: TimerMode) => void;
  onSelectHourglassFill?: (fill: HourglassFillType) => void;
  onStart: (sec: number, mode: TimerMode) => void;
  className?: string;
}

export const PRESET_VISUALS: { [key: number]: { symbol: string; title: string; color: string; desc: string } } = {
  30: { symbol: '🌱', title: 'Tiny Sprout', color: 'from-emerald-300 to-green-400', desc: '30s' },
  60: { symbol: '🌿', title: 'Little Leaf', color: 'from-green-300 to-teal-400', desc: '1m' },
  120: { symbol: '🌷', title: 'Sweet Tulip', color: 'from-pink-300 to-rose-400', desc: '2m' },
  180: { symbol: '🌼', title: 'Daisy Bloom', color: 'from-yellow-300 to-amber-400', desc: '3m' },
  300: { symbol: '🌻', title: 'Sunny Sunflower', color: 'from-amber-300 to-orange-400', desc: '5m' },
  420: { symbol: '🌸', title: 'Cherry Blossom', color: 'from-fuchsia-300 to-pink-400', desc: '7m' },
  600: { symbol: '🌺', title: 'Rainbow Bloom', color: 'from-purple-300 to-indigo-400', desc: '10m' },
  900: { symbol: '🍎', title: 'Apple Tree', color: 'from-red-300 to-pink-400', desc: '15m' },
  1200: { symbol: '🌈', title: 'Full Rainbow', color: 'from-sky-300 to-blue-500', desc: '20m' },
  1800: { symbol: '🏰', title: 'Garden Castle', color: 'from-violet-300 to-purple-500', desc: '30m' },
};

function formatMinutes(sec: number): string {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const rem = sec % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

function formatDurationLong(sec: number): string {
  if (sec < 60) return `${sec} Seconds`;
  const m = Math.floor(sec / 60);
  const rem = sec % 60;
  if (rem === 0) return `${m} Minute${m > 1 ? 's' : ''}`;
  return `${m} Min ${rem}s`;
}

export const PresetPicker: React.FC<PresetPickerProps> = ({
  availablePresets,
  selectedSec,
  selectedMode,
  characterId,
  hourglassFill = 'sand-gold',
  onSelectSec,
  onSelectMode,
  onSelectHourglassFill,
  onStart,
  className = '',
}) => {
  const characterName = CHARACTER_META.find((c) => c.id === characterId)?.name.split(' ')[0] || 'Bunny';

  const timerModesInfo: {
    id: TimerMode;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
  }[] = [
    { id: 'garden', title: 'Magic Flower', subtitle: 'Grows & blooms', icon: '🌸', color: 'from-pink-300 to-rose-400' },
    { id: 'hourglass', title: 'Hourglass Flow', subtitle: 'Sand & water stream', icon: '⏳', color: 'from-amber-300 to-yellow-500' },
    { id: 'rainbow', title: 'Rainbow Arch', subtitle: 'Colors fill up', icon: '🌈', color: 'from-amber-300 to-orange-400' },
    { id: 'journey', title: `${characterName} Journey`, subtitle: 'Walks to cozy home', icon: '🏡', color: 'from-emerald-300 to-teal-400' },
    { id: 'balloon', title: 'Balloon Float', subtitle: 'Gently ascends', icon: '🎈', color: 'from-sky-300 to-blue-400' },
    { id: 'butterfly', title: 'Butterfly Hop', subtitle: 'Flutters to flowers', icon: '🦋', color: 'from-purple-300 to-indigo-400' },
    { id: 'sunset', title: 'Sunset to Moon', subtitle: 'Day turns to night', icon: '🌙', color: 'from-indigo-300 to-violet-400' },
  ];

  return (
    <div className={`w-full max-w-3xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* STEP 1: FIRST SELECT TIME */}
      <div className="w-full mb-6 flex flex-col items-center">
        <div className="text-center mb-3">
          <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider">
            Step 1: Select Sitting Time ⏱️
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            How long will we sit?
          </h2>
        </div>

        {/* Simple Golden Preset Pills (Clean & Compact) */}
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full max-w-lg px-2">
          {availablePresets.map((sec) => {
            const isSelected = selectedSec === sec;

            return (
              <motion.button
                key={sec}
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectSec(sec)}
                className={`py-2.5 sm:py-3 px-2 rounded-2xl font-black text-xs sm:text-sm md:text-base transition-all flex items-center justify-center border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 border-white ring-4 ring-amber-300/80 shadow-lg scale-105 z-10'
                    : 'bg-[#D99B26] hover:bg-amber-500 text-amber-950 border-amber-600/30 shadow-sm opacity-95 hover:opacity-100'
                }`}
              >
                <span>{formatMinutes(sec)}</span>
                {isSelected && <Sparkles className="w-3.5 h-3.5 ml-1 fill-amber-950 text-amber-950 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {/* Custom Duration Slider */}
        <div className="w-full max-w-lg mt-3 px-2">
          <div className="p-3 sm:p-4 rounded-3xl bg-amber-50/90 border-2 border-amber-200/90 shadow-sm flex flex-col items-center">
            {/* Header with live duration badge */}
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Custom Slider
              </span>
              <span className="text-sm sm:text-base font-black text-amber-950 px-3.5 py-1 rounded-full bg-amber-200 border border-amber-300 shadow-xs">
                ⏱️ {formatDurationLong(selectedSec)}
              </span>
            </div>

            {/* Interactive Slider with [-] and [+] Stepper Buttons */}
            <div className="w-full flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => onSelectSec(Math.max(30, selectedSec - 30))}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 border-2 border-amber-300 font-black text-xl flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0"
                title="Decrease 30 seconds"
              >
                <Minus className="w-5 h-5 stroke-[3]" />
              </button>

              <input
                type="range"
                min={30}
                max={1800}
                step={30}
                value={selectedSec}
                onChange={(e) => onSelectSec(Number(e.target.value))}
                className="flex-1 h-4 bg-amber-200 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner"
              />

              <button
                type="button"
                onClick={() => onSelectSec(Math.min(3600, selectedSec + 30))}
                className="w-10 h-10 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 border-2 border-amber-300 font-black text-xl flex items-center justify-center shadow-sm active:scale-95 transition-all shrink-0"
                title="Increase 30 seconds"
              >
                <Plus className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

            {/* Slider Scale Indicators */}
            <div className="w-full flex justify-between text-[11px] font-extrabold text-amber-800/80 px-1 mt-1.5">
              <span>30s</span>
              <span>5m</span>
              <span>10m</span>
              <span>15m</span>
              <span>20m</span>
              <span>30m</span>
            </div>
          </div>
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

        {/* Hourglass Sand / Water Item Selector */}
        {selectedMode === 'hourglass' && (
          <div className="mt-4 p-3.5 bg-amber-50/90 rounded-3xl border-2 border-amber-300 w-full flex flex-col items-center animate-fade-in shadow-inner">
            <span className="text-xs font-black text-amber-900 mb-2">
              Choose Sand or Water Liquid Item:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 w-full">
              {(Object.keys(HOURGLASS_FILL_CONFIGS) as HourglassFillType[]).map((key) => {
                const item = HOURGLASS_FILL_CONFIGS[key];
                const isSelected = hourglassFill === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSelectHourglassFill?.(key)}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-2xl text-xs font-bold transition-all border ${
                      isSelected
                        ? `${item.badgeColor} shadow-md scale-105 font-black ring-2 ring-amber-400`
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="leading-tight">{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
