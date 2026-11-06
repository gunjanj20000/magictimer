import React, { useState } from 'react';
import { ParentSettings, SessionRecord, HourglassFillType } from '../../types';
import { TimerModePreview } from './TimerModePreview';
import { SessionHistoryView } from './SessionHistoryView';
import { CHARACTER_META } from '../characters/CharacterAvatar';
import { HOURGLASS_FILL_CONFIGS } from '../timers/HourglassTimer';
import { ChevronLeft, Sliders, User, ShieldCheck, History, Check, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ParentDashboardProps {
  settings: ParentSettings;
  history: SessionRecord[];
  onSaveSettings: (settings: ParentSettings) => void;
  onClearHistory: () => void;
  onBack: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  settings: initialSettings,
  history,
  onSaveSettings,
  onClearHistory,
  onBack,
}) => {
  const [settings, setSettings] = useState<ParentSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'timer' | 'character' | 'security' | 'history'>('timer');
  const [savedToast, setSavedToast] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleUpdateCode = async () => {
    setIsUpdating(true);
    setUpdateMessage('Checking for latest code...');

    try {
      // 1. Check Service Worker registrations and trigger update
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
          if (reg.waiting) {
            reg.waiting.postMessage({ action: 'SKIP_WAITING' });
          }
        }
      }

      // 2. Clear old cached assets so browser fetches freshest code
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      setUpdateMessage('Updated! Reloading latest code...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.warn('Code update check error:', err);
      setUpdateMessage('Reloading application...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const updateSetting = <K extends keyof ParentSettings>(key: K, value: ParentSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    onSaveSettings(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1500);
  };

  const allAvailablePresets = [30, 60, 120, 180, 300, 420, 600, 900, 1200, 1800];

  const togglePreset = (sec: number) => {
    let list = [...settings.availablePresets];
    if (list.includes(sec)) {
      if (list.length > 1) {
        list = list.filter((s) => s !== sec);
      }
    } else {
      list.push(sec);
      list.sort((a, b) => a - b);
    }
    updateSetting('availablePresets', list);
  };

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
          Parent Settings 🌻
        </h1>

        {/* Right Header: Update Code & Auto-save notification badge */}
        <div className="flex items-center gap-2">
          {savedToast && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}

          <button
            onClick={handleUpdateCode}
            disabled={isUpdating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs shadow-sm border border-amber-300 transition-colors disabled:opacity-60"
            title="Check and update application code"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-700 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isUpdating ? 'Updating...' : 'Update Code'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="w-full max-w-2xl flex p-1.5 bg-slate-100/90 rounded-2xl mb-6 shadow-inner gap-1">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'timer'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Timer & Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('character')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'character'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Character & Sensory</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'security'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Safeguards</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'history'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Main Tab Content Card */}
      <div className="w-full max-w-2xl bg-white rounded-4xl p-5 sm:p-7 shadow-xl border-2 border-slate-100 flex flex-col">
        {/* TAB 1: TIMER & MODE */}
        {activeTab === 'timer' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">
                Visual Countdown Mode
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Choose the visualization your child finds most comforting and intuitive:
              </p>
              <TimerModePreview
                currentMode={settings.defaultMode}
                characterId={settings.character}
                direction={settings.direction}
                hourglassFill={settings.hourglassFill}
                onSelectMode={(mode) => updateSetting('defaultMode', mode)}
              />
            </div>

            {/* Hourglass Sand / Water Liquid Item Selector */}
            {settings.defaultMode === 'hourglass' && (
              <div className="pt-3 border-t border-slate-100 flex flex-col">
                <label className="block text-sm font-black text-slate-800 mb-1">
                  Hourglass Flow Liquid or Sand Item
                </label>
                <p className="text-xs text-slate-500 mb-2">
                  Choose from golden sand, pink kinetic sand, ocean water, or rainbow stardust:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
                  {(Object.keys(HOURGLASS_FILL_CONFIGS) as HourglassFillType[]).map((key) => {
                    const item = HOURGLASS_FILL_CONFIGS[key];
                    const isSelected = settings.hourglassFill === key;
                    return (
                      <button
                        key={key}
                        onClick={() => updateSetting('hourglassFill', key)}
                        className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 transition-all ${
                          isSelected
                            ? `${item.badgeColor} font-black shadow-sm ring-2 ring-amber-300`
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Direction toggle: Grow vs. Disappear */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Animation Direction
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Should the visual element grow until full, or gradually count down/empty?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting('direction', 'grow')}
                  className={`py-3 px-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 ${
                    settings.direction === 'grow'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>🌱 Grow & Bloom Up</span>
                </button>
                <button
                  onClick={() => updateSetting('direction', 'disappear')}
                  className={`py-3 px-4 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 ${
                    settings.direction === 'disappear'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>⏳ Count Down / Disappear</span>
                </button>
              </div>
            </div>

            {/* Available Presets Checklist */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Quick Preset Cards Available on Home Screen
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Tap to enable or hide specific durations for your child:
              </p>
              <div className="flex flex-wrap gap-2">
                {allAvailablePresets.map((sec) => {
                  const isEnabled = settings.availablePresets.includes(sec);
                  return (
                    <button
                      key={sec}
                      onClick={() => togglePreset(sec)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-colors ${
                        isEnabled
                          ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-sm'
                          : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}
                    >
                      {sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}m`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHARACTER & SENSORY */}
        {activeTab === 'character' && (
          <div className="flex flex-col gap-6">
            {/* Child's Favorite Character */}
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-1">
                Child's Favorite Character
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Select the friendly garden buddy your child loves best:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CHARACTER_META.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => updateSetting('character', c.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                      settings.character === c.id
                        ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:border-amber-200'
                    }`}
                  >
                    <span className="text-3xl">{c.label.split(' ')[0]}</span>
                    <span className="font-extrabold text-xs sm:text-sm text-slate-800">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Mode */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Sensory Sound Settings
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Gentle warm tones only. Never sudden beeps or alarms.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'gentle', label: 'Gentle Chimes', desc: 'Soft bells & completion' },
                  { id: 'chime-only', label: 'Completion Only', desc: 'Silent until finished' },
                  { id: 'silent', label: 'Silent Mode', desc: '100% quiet visual timer' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateSetting('soundMode', s.id as any)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all ${
                      settings.soundMode === s.id
                        ? 'bg-amber-50 border-amber-400 font-black text-amber-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="block font-bold text-xs sm:text-sm">{s.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Calming Nature Ambient Music (River, Rain, Sea) */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Calming Nature Ambient Music 🌊
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Continuous relaxing background soundscapes to help your child sit peacefully:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                {[
                  { id: 'river', icon: '🏞️', label: 'Forest River', desc: 'Babbling brook' },
                  { id: 'rain', icon: '🌧️', label: 'Gentle Rain', desc: 'Soft rainfall' },
                  { id: 'sea', icon: '🌊', label: 'Ocean Waves', desc: 'Rhythmic swells' },
                  { id: 'none', icon: '🔇', label: 'No Music', desc: 'Muted ambient' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => updateSetting('ambientSound', s.id as any)}
                    className={`p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center ${
                      settings.ambientSound === s.id
                        ? 'bg-sky-50 border-sky-400 font-black text-sky-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-2xl mb-1">{s.icon}</span>
                    <span className="font-bold text-xs sm:text-sm">{s.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{s.desc}</span>
                  </button>
                ))}
              </div>

              {settings.ambientSound !== 'none' && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-slate-600">Music Volume:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={settings.ambientVolume || 0.35}
                    onChange={(e) => updateSetting('ambientVolume', Number(e.target.value))}
                    className="flex-1 h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <span className="text-xs font-extrabold text-slate-700 w-9 text-right">
                    {Math.round((settings.ambientVolume || 0.35) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* Spoken instructions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-800 text-sm block">
                  Spoken Encouragement ("All done!")
                </span>
                <span className="text-xs text-slate-500">
                  Speaks gentle calming celebration words when timer finishes
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.spokenInstructions}
                onChange={(e) => updateSetting('spokenInstructions', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Animation Speed & Motion Sensitivity */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Animation Speed & Motion
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'slow', label: 'Slow & Calming' },
                  { id: 'reduced', label: 'Reduced Motion' },
                ].map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => updateSetting('animationSpeed', sp.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      settings.animationSpeed === sp.id
                        ? 'bg-amber-400 border-amber-500 text-amber-950 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Contrast Theme */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Visual Palette
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'pastel', label: 'Pastel Garden' },
                  { id: 'bright', label: 'Bright Sunshine' },
                  { id: 'high-contrast', label: 'High Contrast' },
                ].map((thm) => (
                  <button
                    key={thm.id}
                    onClick={() => updateSetting('visualTheme', thm.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                      settings.visualTheme === thm.id
                        ? 'bg-amber-400 border-amber-500 text-amber-950 font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {thm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAFEGUARDS & PARENT LOCK */}
        {activeTab === 'security' && (
          <div className="flex flex-col gap-6">
            {/* Lock timer controls */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-800 text-sm block">
                  Lock Countdown Controls
                </span>
                <span className="text-xs text-slate-500">
                  Prevents accidental child taps pausing or stopping the timer
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.lockTimerControls}
                onChange={(e) => updateSetting('lockTimerControls', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Parent PIN */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-black text-slate-800 mb-1">
                Parent Lock 4-Digit PIN
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Required to access Parent Settings or cancel active locked timers:
              </p>
              <input
                type="password"
                maxLength={4}
                value={settings.parentPin}
                onChange={(e) => updateSetting('parentPin', e.target.value)}
                className="w-32 tracking-widest text-center text-2xl font-black text-slate-800 p-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-400 focus:outline-none"
              />
            </div>

            {/* Visual Break Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-800 text-sm block">
                  Enable Visual Break Button
                </span>
                <span className="text-xs text-slate-500">
                  Shows a gentle "Need Break" coffee/flower button to pause with calming scene
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.allowVisualBreak}
                onChange={(e) => updateSetting('allowVisualBreak', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Wake Lock Screen On */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-800 text-sm block">
                  Keep Screen Awake (Wake Lock)
                </span>
                <span className="text-xs text-slate-500">
                  Prevents screen from sleeping while sitting countdown is running
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.wakeLockEnabled}
                onChange={(e) => updateSetting('wakeLockEnabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* App Code & Version Updates */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-800 text-sm block">
                    App Code & Updates (PWA v1.2.0)
                  </span>
                  <span className="text-xs text-slate-500">
                    Fetch latest code changes, clear cached bundle, and reload app
                  </span>
                </div>
              </div>

              {updateMessage && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>{updateMessage}</span>
                </div>
              )}

              <button
                onClick={handleUpdateCode}
                disabled={isUpdating}
                className="mt-1 w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-black text-sm shadow-md border-2 border-white flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{isUpdating ? 'Checking & Updating Code...' : 'Update Application Code Now'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: SESSION HISTORY */}
        {activeTab === 'history' && (
          <SessionHistoryView history={history} onClearHistory={onClearHistory} />
        )}
      </div>
    </div>
  );
};
