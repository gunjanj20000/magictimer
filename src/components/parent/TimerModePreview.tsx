import React, { useState } from 'react';
import { TimerMode, CharacterId, TimerDirection } from '../../types';
import { MagicGardenTimer } from '../timers/MagicGardenTimer';
import { RainbowTimer } from '../timers/RainbowTimer';
import { BunnyJourneyTimer } from '../timers/BunnyJourneyTimer';
import { BalloonTimer } from '../timers/BalloonTimer';
import { ButterflyTimer } from '../timers/ButterflyTimer';
import { SunsetTimer } from '../timers/SunsetTimer';
import { HourglassTimer } from '../timers/HourglassTimer';
import { HourglassFillType } from '../../types';

interface TimerModePreviewProps {
  currentMode: TimerMode;
  characterId: CharacterId;
  direction: TimerDirection;
  hourglassFill?: HourglassFillType;
  onSelectMode: (mode: TimerMode) => void;
}

export const TimerModePreview: React.FC<TimerModePreviewProps> = ({
  currentMode,
  characterId,
  direction,
  hourglassFill,
  onSelectMode,
}) => {
  const [previewProgress, setPreviewProgress] = useState(0.5);

  const modes: { id: TimerMode; title: string; desc: string; icon: string }[] = [
    { id: 'garden', title: 'Magic Garden', desc: 'Flower grows from seed to full bloom', icon: '🌸' },
    { id: 'rainbow', title: 'Rainbow Timer', desc: 'Rainbow arches fill with sensory colors', icon: '🌈' },
    { id: 'journey', title: 'Bunny Journey', desc: 'Character walks garden path to cozy home', icon: '🏡' },
    { id: 'balloon', title: 'Balloon Float', desc: 'Pastel balloon gently ascends to starry sky', icon: '🎈' },
    { id: 'butterfly', title: 'Butterfly Hop', desc: 'Butterfly flutters between flowers', icon: '🦋' },
    { id: 'sunset', title: 'Sunset to Moon', desc: 'Sun sets gently into smiling crescent moon', icon: '🌙' },
    { id: 'hourglass', title: 'Hourglass Flow', desc: 'Sand & water trickles with real time', icon: '⏳' },
  ];

  const renderPreviewMode = () => {
    const props = {
      progress: previewProgress,
      direction,
      characterId,
      isAlmostDone: previewProgress >= 0.85,
      isPaused: false,
    };

    switch (currentMode) {
      case 'rainbow':
        return <RainbowTimer {...props} />;
      case 'journey':
        return <BunnyJourneyTimer {...props} />;
      case 'balloon':
        return <BalloonTimer {...props} />;
      case 'butterfly':
        return <ButterflyTimer {...props} />;
      case 'sunset':
        return <SunsetTimer {...props} />;
      case 'hourglass':
        return <HourglassTimer {...props} fillType={hourglassFill || 'sand-gold'} />;
      case 'garden':
      default:
        return <MagicGardenTimer {...props} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode selection buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full mb-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
              currentMode === m.id
                ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                : 'bg-white border-slate-200 hover:border-amber-200 text-slate-700'
            }`}
          >
            <span className="text-2xl mb-1">{m.icon}</span>
            <span className="font-extrabold text-xs sm:text-sm text-slate-800">{m.title}</span>
            <span className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Live Interactive Preview Screen */}
      <div className="w-full max-w-sm aspect-square bg-sky-50 rounded-3xl border-4 border-amber-200 overflow-hidden shadow-inner relative flex items-center justify-center p-2 mb-3">
        {renderPreviewMode()}
      </div>

      {/* Scrubber slider to preview progress */}
      <div className="w-full max-w-sm px-2 flex flex-col items-center">
        <div className="w-full flex justify-between text-xs font-bold text-slate-500 mb-1">
          <span>Start (0%)</span>
          <span>Halfway (50%)</span>
          <span>Done (100%)</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={previewProgress}
          onChange={(e) => setPreviewProgress(Number(e.target.value))}
          className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <span className="text-xs font-semibold text-slate-400 mt-1">
          Drag slider to preview animation at any stage
        </span>
      </div>
    </div>
  );
};
