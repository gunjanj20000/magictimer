import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrainingLevel, CharacterId } from '../../types';
import { CharacterAvatar } from '../characters/CharacterAvatar';
import { ChevronLeft, Play, Star, CheckCircle, Lock, Edit3 } from 'lucide-react';

interface GradualTrainingScreenProps {
  levels: TrainingLevel[];
  characterId: CharacterId;
  onUpdateLevels: (levels: TrainingLevel[]) => void;
  onStartLevel: (level: TrainingLevel) => void;
  onBack: () => void;
}

export const GradualTrainingScreen: React.FC<GradualTrainingScreenProps> = ({
  levels,
  characterId,
  onUpdateLevels,
  onStartLevel,
  onBack,
}) => {
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editMinutes, setEditMinutes] = useState<number>(1);

  const selectedLevel = levels.find((l) => l.level === selectedLevelNum) || levels[0];

  const handleToggleUnlock = (lvlNum: number) => {
    const updated = levels.map((l) => {
      if (l.level === lvlNum) {
        return { ...l, unlocked: !l.unlocked };
      }
      return l;
    });
    onUpdateLevels(updated);
  };

  const handleSaveDuration = (lvlNum: number) => {
    const updated = levels.map((l) => {
      if (l.level === lvlNum) {
        return { ...l, durationSec: Math.max(10, editMinutes * 60) };
      }
      return l;
    });
    onUpdateLevels(updated);
    setIsEditing(null);
  };

  function formatDuration(sec: number): string {
    if (sec < 60) return `${sec}s`;
    const m = Math.floor(sec / 60);
    const rem = sec % 60;
    return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center select-none animate-fade-in">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-bold text-sm shadow-sm border border-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Garden Home</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight text-center">
          Gentle Sitting Journey 🌿
        </h1>
        <div className="w-20" />
      </div>

      <p className="text-sm font-semibold text-slate-600 text-center max-w-lg mb-6">
        Grow sitting comfort at your child's own gentle pace. Repeat any level as much as you like!
      </p>

      {/* Selected Level Highlight Card with Character */}
      <div className="w-full max-w-md bg-white rounded-5xl p-6 shadow-xl border-4 border-amber-300 flex flex-col items-center mb-6 relative">
        <div className="flex items-center gap-3 mb-2">
          <CharacterAvatar characterId={characterId} mood="happy" size={70} />
          <div className="text-left">
            <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
              Selected Level {selectedLevel.level}
            </span>
            <h2 className="text-2xl font-black text-slate-800">
              {selectedLevel.name}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-sm">
                ⏱️ {formatDuration(selectedLevel.durationSec)}
              </span>
              {selectedLevel.completedTimes > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <CheckCircle className="w-4 h-4 fill-emerald-100" />
                  {selectedLevel.completedTimes} times completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onStartLevel(selectedLevel)}
          className="w-full mt-4 py-3.5 px-6 rounded-3xl bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-xl shadow-lg shadow-green-200 border-2 border-white flex items-center justify-center gap-3 transition-transform"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>Start Level {selectedLevel.level}</span>
        </motion.button>
      </div>

      {/* 10 Levels Stepping Map */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-5 gap-3">
        {levels.map((lvl) => {
          const isSelected = selectedLevelNum === lvl.level;

          return (
            <motion.div
              key={lvl.level}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedLevelNum(lvl.level)}
              className={`relative rounded-3xl p-3.5 text-center transition-all cursor-pointer border-4 flex flex-col items-center justify-between ${
                isSelected
                  ? 'bg-amber-50 border-amber-400 shadow-lg scale-105'
                  : lvl.unlocked
                  ? 'bg-white/90 border-transparent hover:border-amber-200 shadow-sm'
                  : 'bg-slate-100/70 border-slate-200 opacity-60'
              }`}
            >
              {/* Top badge */}
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center mb-1">
                {lvl.level}
              </div>

              <span className="font-extrabold text-slate-800 text-sm leading-tight">
                {lvl.name}
              </span>

              <span className="mt-1 font-bold text-xs text-slate-500">
                {formatDuration(lvl.durationSec)}
              </span>

              {/* Status footer */}
              <div className="mt-2 flex items-center gap-1">
                {lvl.completedTimes > 0 ? (
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{lvl.completedTimes}</span>
                  </div>
                ) : lvl.unlocked ? (
                  <span className="text-[10px] text-emerald-600 font-bold">Ready</span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              {/* Parent edit trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(lvl.level);
                  setEditMinutes(Math.round(lvl.durationSec / 60) || 1);
                }}
                className="absolute top-2 right-2 p-1 text-slate-300 hover:text-slate-600"
                title="Customize duration"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Edit Duration Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-200 flex flex-col items-center">
            <h3 className="text-lg font-black text-slate-800 mb-2">
              Level {isEditing} Duration
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Set sitting time in minutes:
            </p>
            <input
              type="number"
              min="0.5"
              step="0.5"
              max="60"
              value={editMinutes}
              onChange={(e) => setEditMinutes(Number(e.target.value))}
              className="w-28 text-center text-3xl font-black text-amber-600 p-2 border-2 border-amber-300 rounded-2xl mb-4"
            />
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setIsEditing(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveDuration(isEditing)}
                className="flex-1 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-sm"
              >
                Save
              </button>
            </div>
            <button
              onClick={() => {
                handleToggleUnlock(isEditing);
                setIsEditing(null);
              }}
              className="mt-3 text-xs text-slate-400 underline font-semibold"
            >
              Toggle Unlocked Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
