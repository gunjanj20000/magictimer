import { useState, useEffect } from 'react';
import {
  ParentSettings,
  GardenReward,
  SessionRecord,
  TrainingLevel,
  ActivityItem,
  CharacterId,
  TimerMode,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadRewards,
  loadHistory,
  clearHistory,
  loadTrainingLevels,
  saveTrainingLevels,
  loadActivities,
  saveActivities,
} from './services/storage';
import { GardenBackground } from './components/garden/GardenBackground';
import { HomeScreen } from './components/home/HomeScreen';
import { PresetPicker } from './components/ui/PresetPicker';
import { TimerContainer } from './components/timers/TimerContainer';
import { FirstThenScreen } from './components/firstThen/FirstThenScreen';
import { GradualTrainingScreen } from './components/training/GradualTrainingScreen';
import { RewardGardenScreen } from './components/rewards/RewardGardenScreen';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { ParentLockModal } from './components/ui/ParentLockModal';
import { ChevronLeft } from 'lucide-react';

export function App() {
  // Application Data States
  const [settings, setSettings] = useState<ParentSettings | null>(null);
  const [rewards, setRewards] = useState<GardenReward[]>([]);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [trainingLevels, setTrainingLevels] = useState<TrainingLevel[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Navigation State
  const [currentView, setCurrentView] = useState<
    'home' | 'presets' | 'timer' | 'firstThen' | 'training' | 'rewards' | 'settings'
  >('home');

  // Active Timer Configuration
  const [activeDurationSec, setActiveDurationSec] = useState<number>(120);
  const [activeTimerMode, setActiveTimerMode] = useState<TimerMode>('garden');
  const [activeFirstActivity, setActiveFirstActivity] = useState<ActivityItem | undefined>(undefined);
  const [activeThenActivity, setActiveThenActivity] = useState<ActivityItem | undefined>(undefined);
  const [activeTrainingLevel, setActiveTrainingLevel] = useState<number | undefined>(undefined);

  // Parent Lock Modal State
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [postLockAction, setPostLockAction] = useState<(() => void) | null>(null);

  // Initialize Data from IndexedDB
  useEffect(() => {
    async function initData() {
      const s = await loadSettings();
      const r = await loadRewards();
      const h = await loadHistory();
      const t = await loadTrainingLevels();
      const a = await loadActivities();

      setSettings(s);
      setRewards(r);
      setHistory(h);
      setTrainingLevels(t);
      setActivities(a);
      setActiveDurationSec(s.defaultDurationSec);
      setActiveTimerMode(s.defaultMode);
    }
    initData();

    // Register Service Worker for Offline PWA Support
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration error:', err);
        });
      });
    }
  }, []);

  if (!settings) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#E0F2FE]">
        <div className="animate-bounce-gentle text-5xl">🌸</div>
      </div>
    );
  }

  // Calculate total stars
  const totalStars = history.reduce((sum, rec) => sum + (rec.starsEarned || 0), 0);

  // Character selection
  const handleSelectCharacter = async (charId: CharacterId) => {
    const updated = { ...settings, character: charId };
    setSettings(updated);
    await saveSettings(updated);
  };

  // Launch Timer helper
  const launchTimer = (
    durationSec: number,
    mode?: TimerMode,
    first?: ActivityItem,
    then?: ActivityItem,
    trainingLevel?: number
  ) => {
    const resolvedMode = mode || activeTimerMode || settings.defaultMode;
    setActiveDurationSec(durationSec);
    setActiveTimerMode(resolvedMode);
    setActiveFirstActivity(first);
    setActiveThenActivity(then);
    setActiveTrainingLevel(trainingLevel);
    setCurrentView('timer');
  };

  // Open Settings with Parent Protection Check
  const handleOpenSettingsProtected = () => {
    if (settings.parentLockEnabled) {
      setPostLockAction(() => () => setCurrentView('settings'));
      setIsLockModalOpen(true);
    } else {
      setCurrentView('settings');
    }
  };

  // Handle Save Settings from Parent Dashboard
  const handleSaveSettings = async (newSettings: ParentSettings) => {
    setSettings(newSettings);
    setActiveTimerMode(newSettings.defaultMode);
    await saveSettings(newSettings);
  };

  // Handle Clear History
  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  // Handle Update Training Levels
  const handleUpdateLevels = async (updated: TrainingLevel[]) => {
    setTrainingLevels(updated);
    await saveTrainingLevels(updated);
  };

  // Handle Add Activity
  const handleSaveNewActivity = async (newAct: ActivityItem) => {
    const updated = [...activities, newAct];
    setActivities(updated);
    await saveActivities(updated);
  };

  // Completion callback from timer
  const handleTimerCompleteRecord = async (record: SessionRecord) => {
    setHistory((prev) => [record, ...prev]);
    const r = await loadRewards();
    setRewards(r);

    // If training level was completed, update training completed times and unlock next level
    if (record.trainingLevel !== undefined) {
      const currentLvl = record.trainingLevel;
      const updatedLevels = trainingLevels.map((lvl) => {
        if (lvl.level === currentLvl) {
          return { ...lvl, completedTimes: lvl.completedTimes + 1 };
        }
        if (lvl.level === currentLvl + 1) {
          return { ...lvl, unlocked: true };
        }
        return lvl;
      });
      setTrainingLevels(updatedLevels);
      await saveTrainingLevels(updatedLevels);
    }

    setCurrentView('rewards');
  };

  return (
    <GardenBackground theme={settings.visualTheme}>
      {/* 1. HOME SCREEN */}
      {currentView === 'home' && (
        <HomeScreen
          settings={settings}
          currentMode={activeTimerMode}
          totalStars={totalStars}
          onSelectCharacter={handleSelectCharacter}
          onStartSitting={() => setCurrentView('presets')}
          onOpenFirstThen={() => setCurrentView('firstThen')}
          onOpenRewards={() => setCurrentView('rewards')}
          onOpenSettings={handleOpenSettingsProtected}
        />
      )}

      {/* 2. DURATION PRESET PICKER & ANIMATION CHOOSER */}
      {currentView === 'presets' && (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col items-center animate-fade-in">
          <div className="w-full flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/80 hover:bg-white text-slate-700 font-bold text-sm shadow-sm border border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Garden Home</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight text-center">
              Start Sitting 🌸
            </h1>
            <div className="w-20" />
          </div>

          {/* Quick link to Gradual Training Mode */}
          <div className="mb-4">
            <button
              onClick={() => setCurrentView('training')}
              className="px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs sm:text-sm border border-amber-300 shadow-sm flex items-center gap-2"
            >
              <span>🌿 Try Gentle Gradual Sitting Training Levels</span>
            </button>
          </div>

          <PresetPicker
            availablePresets={settings.availablePresets}
            selectedSec={activeDurationSec}
            selectedMode={activeTimerMode}
            characterId={settings.character}
            hourglassFill={settings.hourglassFill}
            onSelectSec={(sec) => setActiveDurationSec(sec)}
            onSelectMode={(mode) => {
              setActiveTimerMode(mode);
              const updated = { ...settings, defaultMode: mode };
              setSettings(updated);
              saveSettings(updated);
            }}
            onSelectHourglassFill={(fill) => {
              const updated = { ...settings, hourglassFill: fill };
              setSettings(updated);
              saveSettings(updated);
            }}
            onStart={(sec, mode) => {
              setActiveTimerMode(mode);
              launchTimer(sec, mode);
            }}
          />
        </div>
      )}

      {/* 3. ACTIVE FULLSCREEN TIMER */}
      {currentView === 'timer' && (
        <TimerContainer
          durationSec={activeDurationSec}
          mode={activeTimerMode}
          settings={settings}
          firstActivity={activeFirstActivity}
          thenActivity={activeThenActivity}
          trainingLevel={activeTrainingLevel}
          onExit={() => setCurrentView('home')}
          onComplete={handleTimerCompleteRecord}
        />
      )}

      {/* 4. FIRST-THEN VISUAL SCHEDULE */}
      {currentView === 'firstThen' && (
        <FirstThenScreen
          activities={activities}
          defaultDurationSec={settings.defaultDurationSec}
          currentMode={activeTimerMode}
          onSaveNewActivity={handleSaveNewActivity}
          onStartTimer={(first, then, durationSec, mode) => {
            setActiveTimerMode(mode);
            launchTimer(durationSec, mode, first, then);
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 5. GRADUAL TRAINING JOURNEY */}
      {currentView === 'training' && (
        <GradualTrainingScreen
          levels={trainingLevels}
          characterId={settings.character}
          currentMode={activeTimerMode}
          onUpdateLevels={handleUpdateLevels}
          onStartLevel={(lvl, mode) => {
            setActiveTimerMode(mode);
            launchTimer(lvl.durationSec, mode, undefined, undefined, lvl.level);
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 6. MY STARS / MAGIC GARDEN REWARD MEADOW */}
      {currentView === 'rewards' && (
        <RewardGardenScreen
          rewards={rewards}
          characterId={settings.character}
          soundMode={settings.soundMode}
          totalStars={totalStars}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 7. PARENT SETTINGS DASHBOARD */}
      {currentView === 'settings' && (
        <ParentDashboard
          settings={settings}
          history={history}
          onSaveSettings={handleSaveSettings}
          onClearHistory={handleClearHistory}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* Parent Lock Gate */}
      <ParentLockModal
        isOpen={isLockModalOpen}
        correctPin={settings.parentPin}
        onSuccess={() => {
          setIsLockModalOpen(false);
          if (postLockAction) {
            postLockAction();
            setPostLockAction(null);
          }
        }}
        onClose={() => {
          setIsLockModalOpen(false);
          setPostLockAction(null);
        }}
      />
    </GardenBackground>
  );
}
