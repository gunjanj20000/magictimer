import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ActivityItem, TimerMode } from '../../types';
import { AddCustomActivityModal } from './AddCustomActivityModal';
import { ArrowRight, ArrowDown, Plus, Play, ChevronLeft } from 'lucide-react';

interface FirstThenScreenProps {
  activities: ActivityItem[];
  defaultDurationSec: number;
  currentMode: TimerMode;
  onSaveNewActivity: (activity: ActivityItem) => void;
  onStartTimer: (first: ActivityItem, then: ActivityItem, durationSec: number, mode: TimerMode) => void;
  onBack: () => void;
}

export const ACTIVITY_ICONS: { [key: string]: string } = {
  chair: '🪑',
  utensils: '🥣',
  'book-open': '📚',
  hourglass: '⏳',
  puzzle: '🧩',
  sparkles: '✨',
  footprints: '👟',
  moon: '🌙',
  'gamepad-2': '🧸',
  tv: '📺',
  sun: '🌳',
  music: '🎵',
  apple: '🍎',
  wind: '🫧',
  heart: '🫂',
  tablet: '📱',
};

export const FirstThenScreen: React.FC<FirstThenScreenProps> = ({
  activities,
  defaultDurationSec,
  currentMode,
  onSaveNewActivity,
  onStartTimer,
  onBack,
}) => {
  const firstOptions = activities.filter((a) => a.category === 'first');
  const thenOptions = activities.filter((a) => a.category === 'then');

  const [selectedFirst, setSelectedFirst] = useState<ActivityItem>(firstOptions[0]);
  const [selectedThen, setSelectedThen] = useState<ActivityItem>(thenOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState<number>(defaultDurationSec);
  const [selectedMode, setSelectedMode] = useState<TimerMode>(currentMode);
  const [activePicker, setActivePicker] = useState<'first' | 'then' | null>(null);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  const durationPresets = [30, 60, 120, 180, 300, 600];

  const timerModesList: { id: TimerMode; label: string; icon: string }[] = [
    { id: 'garden', label: 'Flower', icon: '🌸' },
    { id: 'hourglass', label: 'Hourglass', icon: '⏳' },
    { id: 'rainbow', label: 'Rainbow', icon: '🌈' },
    { id: 'journey', label: 'Journey', icon: '🏡' },
    { id: 'balloon', label: 'Balloon', icon: '🎈' },
    { id: 'butterfly', label: 'Butterfly', icon: '🦋' },
    { id: 'sunset', label: 'Sunset', icon: '🌙' },
  ];

  const handleLaunch = () => {
    onStartTimer(selectedFirst, selectedThen, selectedDuration, selectedMode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center select-none animate-fade-in">
      {/* Header with back button */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-bold text-sm shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Garden Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight text-center">
          First → Then 🌈
        </h1>
        <div className="w-20" />
      </div>

      {/* Main First -> Then Cards Layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4 items-center my-2 sm:my-4">
        {/* FIRST CARD */}
        <div className="md:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-xs bg-white rounded-4xl p-5 shadow-xl border-4 border-amber-300 flex flex-col items-center relative">
            <span className="px-4 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-sm uppercase tracking-wider mb-3">
              1. FIRST
            </span>

            {/* Visual Icon / Photo */}
            <div className="w-36 h-36 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
              {selectedFirst?.customImageDataUrl ? (
                <img
                  src={selectedFirst.customImageDataUrl}
                  alt={selectedFirst.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">
                  {ACTIVITY_ICONS[selectedFirst?.iconName] || '🪑'}
                </span>
              )}
            </div>

            <span className="text-xl font-extrabold text-slate-800 text-center">
              {selectedFirst?.title}
            </span>

            <button
              onClick={() => setActivePicker('first')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-600 font-bold text-xs border border-slate-200"
            >
              Change Picture
            </button>
          </div>
        </div>

        {/* ARROW */}
        <div className="md:col-span-1 flex items-center justify-center py-2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-pink-400 text-white flex items-center justify-center shadow-md animate-pulse">
            <ArrowRight className="w-8 h-8 hidden md:block" />
            <ArrowDown className="w-8 h-8 block md:hidden" />
          </div>
        </div>

        {/* THEN CARD */}
        <div className="md:col-span-3 flex flex-col items-center">
          <div className="w-full max-w-xs bg-white rounded-4xl p-5 shadow-xl border-4 border-pink-400 flex flex-col items-center relative">
            <span className="px-4 py-1 rounded-full bg-pink-400 text-white font-black text-sm uppercase tracking-wider mb-3">
              2. THEN
            </span>

            {/* Visual Icon / Photo */}
            <div className="w-36 h-36 rounded-3xl bg-pink-50 border-2 border-pink-200 flex items-center justify-center overflow-hidden mb-3 shadow-inner">
              {selectedThen?.customImageDataUrl ? (
                <img
                  src={selectedThen.customImageDataUrl}
                  alt={selectedThen.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">
                  {ACTIVITY_ICONS[selectedThen?.iconName] || '🧸'}
                </span>
              )}
            </div>

            <span className="text-xl font-extrabold text-slate-800 text-center">
              {selectedThen?.title}
            </span>

            <button
              onClick={() => setActivePicker('then')}
              className="mt-3 px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-pink-100 text-slate-600 font-bold text-xs border border-slate-200"
            >
              Change Picture
            </button>
          </div>
        </div>
      </div>

      {/* Sitting Duration Quick Selector */}
      <div className="w-full max-w-md bg-white/80 rounded-3xl p-4 shadow-sm border border-slate-200 my-4 flex flex-col items-center">
        <span className="font-extrabold text-slate-700 text-sm mb-2.5">
          Sitting Time for First Activity:
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {durationPresets.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedDuration(sec)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs sm:text-sm border transition-all ${
                selectedDuration === sec
                  ? 'bg-amber-400 border-amber-500 text-amber-950 scale-105 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Mode Selector for First-Then */}
      <div className="w-full max-w-md bg-white/85 rounded-3xl p-4 shadow-sm border border-slate-200 my-2 flex flex-col items-center">
        <span className="font-extrabold text-slate-700 text-sm mb-2">
          Animation to Watch While Sitting:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full">
          {timerModesList.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id)}
              className={`p-2 rounded-2xl flex flex-col items-center text-center border-2 transition-all ${
                selectedMode === m.id
                  ? 'bg-pink-100 border-pink-400 font-black text-pink-900 shadow-sm scale-105'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <span className="text-[10px] font-bold mt-0.5">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleLaunch}
        className="w-full max-w-sm py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-xl sm:text-2xl shadow-xl shadow-green-200 border-4 border-white flex items-center justify-center gap-3 transition-transform"
      >
        <Play className="w-8 h-8 fill-current" />
        <span>Start First Sitting</span>
      </motion.button>

      {/* Activity Picker Modal */}
      {activePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-white rounded-4xl p-6 shadow-2xl border-4 border-pink-200 flex flex-col max-h-[85vh] overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">
                Choose {activePicker === 'first' ? 'FIRST' : 'THEN'} Card
              </h3>
              <button
                onClick={() => setActivePicker(null)}
                className="px-3 py-1 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto p-2 my-3">
              {(activePicker === 'first' ? firstOptions : thenOptions).map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    if (activePicker === 'first') setSelectedFirst(act);
                    else setSelectedThen(act);
                    setActivePicker(null);
                  }}
                  className="rounded-2xl p-3 bg-slate-50 hover:bg-pink-50 border-2 border-slate-200 hover:border-pink-300 flex flex-col items-center text-center transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden mb-2 shadow-sm">
                    {act.customImageDataUrl ? (
                      <img src={act.customImageDataUrl} alt={act.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{ACTIVITY_ICONS[act.iconName] || '🌸'}</span>
                    )}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-700 leading-tight">
                    {act.title}
                  </span>
                </button>
              ))}

              {/* Add Custom Button Card */}
              <button
                onClick={() => setIsAddCustomOpen(true)}
                className="rounded-2xl p-3 bg-pink-50 hover:bg-pink-100 border-2 border-dashed border-pink-300 flex flex-col items-center justify-center text-center text-pink-600 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-1 shadow-sm">
                  <Plus className="w-6 h-6 text-pink-500" />
                </div>
                <span className="font-extrabold text-xs">Add Photo Card</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Custom Activity Dialog */}
      <AddCustomActivityModal
        isOpen={isAddCustomOpen}
        category={activePicker || 'first'}
        onAdd={(newAct) => {
          onSaveNewActivity(newAct);
          if (newAct.category === 'first') setSelectedFirst(newAct);
          else setSelectedThen(newAct);
          setActivePicker(null);
        }}
        onClose={() => setIsAddCustomOpen(false)}
      />
    </div>
  );
};
