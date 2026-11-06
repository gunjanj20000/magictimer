import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

interface PresetPickerProps {
  availablePresets: number[]; // in seconds
  selectedSec: number;
  onSelect: (sec: number) => void;
  onStart: (sec: number) => void;
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
  onSelect,
  onStart,
  className = '',
}) => {
  const [customMinutes, setCustomMinutes] = useState(Math.round(selectedSec / 60) || 2);
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col items-center select-none ${className}`}>
      {/* Preset cards grid */}
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
                onSelect(sec);
              }}
              className={`relative rounded-3xl p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-between border-4 ${
                isSelected
                  ? 'bg-white shadow-xl ring-4 ring-pink-400/50 border-pink-400 scale-105'
                  : 'bg-white/80 hover:bg-white border-transparent hover:border-pink-200 shadow-md'
              }`}
            >
              {/* Symbol bubble */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${visual.color} flex items-center justify-center text-3xl sm:text-4xl shadow-md mb-2`}
              >
                <span>{visual.symbol}</span>
              </div>

              {/* Kid-friendly title */}
              <span className="font-extrabold text-slate-700 text-sm sm:text-base leading-tight">
                {visual.title}
              </span>

              {/* Subtitle with duration badge */}
              <span className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs">
                {formatMinutes(sec)}
              </span>

              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full p-1 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Custom Duration Toggle & Slider */}
      <div className="w-full mt-4 px-3 flex flex-col items-center">
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
                onSelect(val * 60);
              }}
              className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        )}
      </div>

      {/* Immediate Launch Start Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onStart(selectedSec)}
        className="w-full max-w-sm mt-5 py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500 text-white font-black text-xl sm:text-2xl shadow-xl shadow-green-200/80 border-4 border-white flex items-center justify-center gap-3 transition-transform"
      >
        <Play className="w-8 h-8 fill-current" />
        <span>Start Sitting</span>
      </motion.button>
    </div>
  );
};
