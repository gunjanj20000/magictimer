import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TimerMode,
  ParentSettings,
  ActivityItem,
  SessionRecord,
  GardenReward,
  AmbientSoundType,
  HourglassFillType,
} from '../../types';
import { MagicGardenTimer } from './MagicGardenTimer';
import { RainbowTimer } from './RainbowTimer';
import { BunnyJourneyTimer } from './BunnyJourneyTimer';
import { BalloonTimer } from './BalloonTimer';
import { ButterflyTimer } from './ButterflyTimer';
import { SunsetTimer } from './SunsetTimer';
import { HourglassTimer } from './HourglassTimer';
import { VisualCheckpoints } from './VisualCheckpoints';
import { TimerWatch } from './TimerWatch';
import { VisualBreakModal } from '../ui/VisualBreakModal';
import { CelebrationModal } from '../ui/CelebrationModal';
import { ParentLockModal } from '../ui/ParentLockModal';
import { requestScreenWakeLock, releaseScreenWakeLock } from '../../services/wakelock';
import {
  playSoftTap,
  playCheckpointChime,
  playCompletionChime,
  speakGentlePhrase,
  startAmbientSound,
  stopAmbientSound,
} from '../../services/audio';
import { saveSessionRecord, saveReward } from '../../services/storage';
import { Pause, Play, X, Coffee, Lock } from 'lucide-react';

interface TimerContainerProps {
  durationSec: number;
  mode: TimerMode;
  settings: ParentSettings;
  firstActivity?: ActivityItem;
  thenActivity?: ActivityItem;
  trainingLevel?: number;
  onExit: () => void;
  onComplete: (record: SessionRecord) => void;
}

export const TimerContainer: React.FC<TimerContainerProps> = ({
  durationSec,
  mode,
  settings,
  firstActivity,
  thenActivity,
  trainingLevel,
  onExit,
  onComplete,
}) => {
  // Accurate Timestamp State
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBreakOpen, setIsBreakOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isParentLockOpen, setIsParentLockOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pause' | 'stop' | null>(null);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>(settings.ambientSound || 'river');
  const [hourglassFill, setHourglassFill] = useState<HourglassFillType>(settings.hourglassFill || 'sand-gold');

  // Start & manage relaxing ambient soundscape (River, Rain, Sea, or None)
  useEffect(() => {
    if (ambientSound !== 'none') {
      startAmbientSound(ambientSound, settings.ambientVolume || 0.35);
    } else {
      stopAmbientSound();
    }
    return () => {
      stopAmbientSound();
    };
  }, [ambientSound, settings.ambientVolume]);

  // References for accurate timing
  const startTimestampRef = useRef<number>(Date.now());
  const accumulatedMsRef = useRef<number>(0);
  const pausedTimestampRef = useRef<number | null>(null);
  const isCompletedRef = useRef<boolean>(false);
  const checkpointsFiredRef = useRef<Set<number>>(new Set());

  const totalDurationMs = durationSec * 1000;
  const progress = Math.min(1, elapsedMs / totalDurationMs);
  const isAlmostDone = progress >= 0.85;

  // Manage Wake Lock
  useEffect(() => {
    if (settings.wakeLockEnabled) {
      requestScreenWakeLock();
    }
    return () => {
      releaseScreenWakeLock();
    };
  }, [settings.wakeLockEnabled]);

  // Synchronize on Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isPaused && !isCompletedRef.current) {
        if (settings.wakeLockEnabled) {
          requestScreenWakeLock();
        }
        // Immediately sync elapsed time
        const now = Date.now();
        const currentElapsed = accumulatedMsRef.current + (now - startTimestampRef.current);
        setElapsedMs(Math.min(totalDurationMs, currentElapsed));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, totalDurationMs, settings.wakeLockEnabled]);

  // Handle completion
  const handleTimerComplete = useCallback(async () => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setIsPaused(true);

    // Stop calming background music & play joyful completion melody
    stopAmbientSound();
    playCompletionChime(settings.soundMode);
    speakGentlePhrase('All done! Wonderful job sitting!', settings.spokenInstructions);

    // Record session
    const stars = settings.starsPerCompletedTimer || 1;
    const sessionRec: SessionRecord = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      durationSelectedSec: durationSec,
      durationCompletedSec: durationSec,
      completed: true,
      starsEarned: stars,
      mode,
      activityTitle: firstActivity ? `${firstActivity.title} → ${thenActivity?.title}` : undefined,
      trainingLevel,
    };
    await saveSessionRecord(sessionRec);

    // Add garden reward (random flower or butterfly)
    const rewardTypes: GardenReward['type'][] = ['flower', 'butterfly', 'tree', 'sparkle'];
    const randomType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)];
    const rewardItem: GardenReward = {
      id: 'reward_' + Date.now(),
      type: randomType,
      title: 'Garden Treasure',
      earnedAt: Date.now(),
      posX: 15 + Math.random() * 70,
      posY: 30 + Math.random() * 40,
      variant: Math.floor(Math.random() * 4),
    };
    await saveReward(rewardItem);

    setIsCelebrationOpen(true);
  }, [durationSec, mode, settings, firstActivity, thenActivity, trainingLevel]);

  // Core Animation Frame Timer Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPaused && !isCompletedRef.current) {
        const now = Date.now();
        const currentElapsed = accumulatedMsRef.current + (now - startTimestampRef.current);
        setElapsedMs(Math.min(totalDurationMs, currentElapsed));

        // Check for 33% and 66% chimes
        const currentProgress = currentElapsed / totalDurationMs;
        if (currentProgress >= 0.33 && !checkpointsFiredRef.current.has(33)) {
          checkpointsFiredRef.current.add(33);
          playCheckpointChime(settings.soundMode);
        }
        if (currentProgress >= 0.66 && !checkpointsFiredRef.current.has(66)) {
          checkpointsFiredRef.current.add(66);
          playCheckpointChime(settings.soundMode);
        }

        if (currentElapsed >= totalDurationMs) {
          handleTimerComplete();
          return;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, totalDurationMs, handleTimerComplete, settings.soundMode]);

  // Pause logic
  const handlePause = () => {
    if (isCompletedRef.current) return;
    if (settings.lockTimerControls) {
      setPendingAction('pause');
      setIsParentLockOpen(true);
      return;
    }
    executePause();
  };

  const executePause = () => {
    if (isPaused) return;
    pausedTimestampRef.current = Date.now();
    accumulatedMsRef.current += pausedTimestampRef.current - startTimestampRef.current;
    setIsPaused(true);
    playSoftTap(settings.soundMode);
  };

  // Resume logic
  const handleResume = () => {
    if (isCompletedRef.current) return;
    startTimestampRef.current = Date.now();
    pausedTimestampRef.current = null;
    setIsPaused(false);
    playSoftTap(settings.soundMode);
  };

  // Stop/Exit logic
  const handleStop = () => {
    if (settings.lockTimerControls) {
      setPendingAction('stop');
      setIsParentLockOpen(true);
      return;
    }
    executeStop();
  };

  const executeStop = async () => {
    stopAmbientSound();
    // Record incomplete session without penalty
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const sessionRec: SessionRecord = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      durationSelectedSec: durationSec,
      durationCompletedSec: elapsedSec,
      completed: false,
      starsEarned: 0,
      mode,
      activityTitle: firstActivity?.title,
      trainingLevel,
    };
    await saveSessionRecord(sessionRec);
    onExit();
  };

  // Visual Break
  const handleTriggerBreak = () => {
    executePause();
    setIsBreakOpen(true);
  };

  const handleResumeBreak = () => {
    setIsBreakOpen(false);
    handleResume();
  };

  const handleFinishCelebration = () => {
    setIsCelebrationOpen(false);
    onComplete({
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      durationSelectedSec: durationSec,
      durationCompletedSec: durationSec,
      completed: true,
      starsEarned: settings.starsPerCompletedTimer || 1,
      mode,
      trainingLevel,
    });
  };

  // Render timer mode component
  const renderModeComponent = () => {
    const props = {
      progress,
      direction: settings.direction,
      characterId: settings.character,
      isAlmostDone,
      isPaused,
    };

    switch (mode) {
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
        return (
          <HourglassTimer
            {...props}
            fillType={hourglassFill}
            onSelectFillType={(f) => setHourglassFill(f)}
          />
        );
      case 'garden':
      default:
        return <MagicGardenTimer {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-[#E0F2FE] via-[#F0FDF4] to-[#FEFCE8] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar: First Activity card (if any) + Checkpoints + Calming Music + Break */}
      <div className="relative z-20 w-full px-3 py-2 sm:px-6 sm:py-2.5 flex items-center justify-between gap-2 max-w-4xl mx-auto shrink-0">
        {/* FIRST Activity visual badge */}
        {firstActivity ? (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded-2xl shadow-sm border border-pink-100 shrink-0">
            <span className="text-[10px] sm:text-xs font-black uppercase text-pink-500 tracking-wider">
              First
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-pink-100 flex items-center justify-center overflow-hidden">
              {firstActivity.customImageDataUrl ? (
                <img src={firstActivity.customImageDataUrl} alt={firstActivity.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">🪑</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-700 hidden sm:inline max-w-[110px] truncate">
              {firstActivity.title}
            </span>
          </div>
        ) : (
          <div className="w-2 sm:w-4" />
        )}

        {/* Visual Checkpoints Indicator */}
        <VisualCheckpoints progress={progress} className="scale-75 sm:scale-85 md:scale-95 origin-center py-1 px-3" />

        {/* Calming Nature Music Selector & Break Button */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Nature Music Toggle (River / Rain / Sea / Off) */}
          <div className="flex items-center bg-white/85 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-sky-200">
            {[
              { type: 'river' as AmbientSoundType, icon: '🏞️', title: 'River' },
              { type: 'rain' as AmbientSoundType, icon: '🌧️', title: 'Rain' },
              { type: 'sea' as AmbientSoundType, icon: '🌊', title: 'Sea' },
              { type: 'none' as AmbientSoundType, icon: '🔇', title: 'Mute' },
            ].map((snd) => (
              <button
                key={snd.type}
                onClick={() => setAmbientSound(snd.type)}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-xs transition-all ${
                  ambientSound === snd.type
                    ? 'bg-sky-400 text-white shadow-sm scale-105'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title={`Sound: ${snd.title}`}
              >
                <span>{snd.icon}</span>
              </button>
            ))}
          </div>

          {/* Break Button (if enabled) */}
          {settings.allowVisualBreak && (
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTriggerBreak}
              className="flex items-center gap-1 bg-white/85 hover:bg-white backdrop-blur-md px-2 py-1 rounded-2xl shadow-sm border border-amber-200 text-amber-700 font-bold text-xs active:bg-amber-50"
              title="Take a gentle break"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">Break</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Dedicated Clocks Row: Big Digital Clock + Round Clock side by side (No Overlap) */}
      <div className="relative z-20 w-full flex items-center justify-center my-0.5 sm:my-1 px-2 shrink-0">
        <TimerWatch
          progress={progress}
          elapsedMs={elapsedMs}
          totalDurationMs={totalDurationMs}
          isPaused={isPaused}
          direction={settings.direction}
        />
      </div>

      {/* Main Central Visualization Screen */}
      <div className="relative flex-1 min-h-0 w-full flex flex-col items-center justify-center p-1 sm:p-3 overflow-hidden">
        {renderModeComponent()}
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-20 w-full p-2.5 sm:p-4 flex items-center justify-center gap-4 max-w-md mx-auto shrink-0">
        {/* If controls locked, show a subtle lock badge */}
        {settings.lockTimerControls && (
          <div className="absolute left-6 bottom-4 sm:bottom-6 flex items-center gap-1 text-slate-400 bg-white/60 px-2.5 py-1 rounded-full text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Lock On</span>
          </div>
        )}

        {/* Play / Pause button */}
        {isPaused ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleResume}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-green-200 flex items-center justify-center border-4 border-white"
          >
            <Play className="w-7 h-7 fill-current ml-0.5" />
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePause}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/80 hover:bg-white text-slate-600 shadow-lg border-2 border-slate-200 flex items-center justify-center"
          >
            <Pause className="w-6 h-6 fill-current" />
          </motion.button>
        )}

        {/* Exit / Stop button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleStop}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/70 hover:bg-white text-slate-400 hover:text-slate-600 shadow-md border border-slate-200 flex items-center justify-center"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </motion.button>
      </div>

      {/* Visual Break Dialog */}
      <VisualBreakModal
        isOpen={isBreakOpen}
        characterId={settings.character}
        onResume={handleResumeBreak}
      />

      {/* Celebration Dialog */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        characterId={settings.character}
        firstActivity={firstActivity}
        thenActivity={thenActivity}
        starsEarned={settings.starsPerCompletedTimer || 1}
        onFinish={handleFinishCelebration}
      />

      {/* Parent Lock Dialog */}
      <ParentLockModal
        isOpen={isParentLockOpen}
        correctPin={settings.parentPin}
        onSuccess={() => {
          setIsParentLockOpen(false);
          if (pendingAction === 'pause') {
            executePause();
          } else if (pendingAction === 'stop') {
            executeStop();
          }
          setPendingAction(null);
        }}
        onClose={() => {
          setIsParentLockOpen(false);
          setPendingAction(null);
        }}
      />
    </div>
  );
};
