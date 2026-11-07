import { openDB, IDBPDatabase } from 'idb';
import { ParentSettings, GardenReward, SessionRecord, TrainingLevel, ActivityItem } from '../types';

const DB_NAME = 'magic_garden_db';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: ParentSettings = {
  defaultDurationSec: 120, // 2 minutes default
  availablePresets: [30, 60, 120, 180, 300, 600, 900, 1200, 1800],
  defaultMode: 'garden',
  direction: 'grow',
  character: 'bunny',
  characterAnimation: true,
  hourglassFill: 'sand-gold',
  soundMode: 'gentle',
  spokenInstructions: false,
  ambientSound: 'river',
  ambientVolume: 0.35,
  customSoundDataUrl: undefined,
  customSoundName: undefined,
  customSoundUsage: 'completion',
  customSounds: [],
  animationSpeed: 'normal',
  visualTheme: 'pastel',
  largeControls: false,
  parentLockEnabled: false,
  parentPin: '1234',
  lockTimerControls: true,
  allowVisualBreak: true,
  celebrationDurationSec: 5,
  wakeLockEnabled: true,
  starsPerCompletedTimer: 1,
};

export const DEFAULT_TRAINING_LEVELS: TrainingLevel[] = [
  { level: 1, durationSec: 30, name: 'Tiny Sprout', unlocked: true, completedTimes: 0 },
  { level: 2, durationSec: 60, name: 'Little Leaf', unlocked: true, completedTimes: 0 },
  { level: 3, durationSec: 120, name: 'Budding Flower', unlocked: false, completedTimes: 0 },
  { level: 4, durationSec: 180, name: 'Gentle Blossom', unlocked: false, completedTimes: 0 },
  { level: 5, durationSec: 300, name: 'Sunny Petals', unlocked: false, completedTimes: 0 },
  { level: 6, durationSec: 420, name: 'Rainbow Garden', unlocked: false, completedTimes: 0 },
  { level: 7, durationSec: 600, name: 'Happy Meadow', unlocked: false, completedTimes: 0 },
  { level: 8, durationSec: 900, name: 'Starry Path', unlocked: false, completedTimes: 0 },
  { level: 9, durationSec: 1200, name: 'Golden Butterfly', unlocked: false, completedTimes: 0 },
  { level: 10, durationSec: 1800, name: 'Master Gardener', unlocked: false, completedTimes: 0 },
];

export const DEFAULT_ACTIVITIES: ActivityItem[] = [
  // First activities
  { id: 'first_sit', title: 'Sitting Calmly', iconName: 'chair', category: 'first' },
  { id: 'first_eat', title: 'Eating Meal', iconName: 'utensils', category: 'first' },
  { id: 'first_learn', title: 'Learning Time', iconName: 'book-open', category: 'first' },
  { id: 'first_wait', title: 'Gentle Waiting', iconName: 'hourglass', category: 'first' },
  { id: 'first_therapy', title: 'Fun Practice', iconName: 'puzzle', category: 'first' },
  { id: 'first_teeth', title: 'Brushing Teeth', iconName: 'sparkles', category: 'first' },
  { id: 'first_shoes', title: 'Putting on Shoes', iconName: 'footprints', category: 'first' },
  { id: 'first_quiet', title: 'Quiet Rest', iconName: 'moon', category: 'first' },
  // Then activities
  { id: 'then_play', title: 'Play Toys', iconName: 'gamepad-2', category: 'then' },
  { id: 'then_cartoon', title: 'Favorite Cartoon', iconName: 'tv', category: 'then' },
  { id: 'then_outside', title: 'Going Outside', iconName: 'sun', category: 'then' },
  { id: 'then_music', title: 'Music & Dance', iconName: 'music', category: 'then' },
  { id: 'then_snack', title: 'Yummy Snack', iconName: 'apple', category: 'then' },
  { id: 'then_bubbles', title: 'Blowing Bubbles', iconName: 'wind', category: 'then' },
  { id: 'then_hug', title: 'Warm Hug & Cuddle', iconName: 'heart', category: 'then' },
  { id: 'then_tablet', title: 'Fun Tablet Game', iconName: 'tablet', category: 'then' },
];

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('rewards')) {
          db.createObjectStore('rewards', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('training')) {
          db.createObjectStore('training', { keyPath: 'level' });
        }
        if (!db.objectStoreNames.contains('activities')) {
          db.createObjectStore('activities', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function loadSettings(): Promise<ParentSettings> {
  try {
    const db = await getDB();
    const stored = await db.get('settings', 'config');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...stored };
    }
  } catch (e) {
    console.warn('Could not read IndexedDB settings, trying localStorage', e);
    const local = localStorage.getItem('mg_settings');
    if (local) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(local) };
      } catch {}
    }
  }
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: ParentSettings): Promise<void> {
  try {
    const db = await getDB();
    await db.put('settings', settings, 'config');
  } catch (e) {
    console.warn('Could not save to IndexedDB', e);
  }
  try {
    localStorage.setItem('mg_settings', JSON.stringify(settings));
  } catch {}
}

export async function loadRewards(): Promise<GardenReward[]> {
  try {
    const db = await getDB();
    const items = await db.getAll('rewards');
    if (items && items.length > 0) return items;
  } catch (e) {
    console.warn('Could not load rewards from IndexedDB', e);
  }
  const local = localStorage.getItem('mg_rewards');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  return [];
}

export async function saveReward(reward: GardenReward): Promise<void> {
  try {
    const db = await getDB();
    await db.put('rewards', reward);
  } catch (e) {
    console.warn('Could not save reward to IndexedDB', e);
  }
  const current = await loadRewards();
  if (!current.some(r => r.id === reward.id)) {
    current.push(reward);
    try {
      localStorage.setItem('mg_rewards', JSON.stringify(current));
    } catch {}
  }
}

export async function loadHistory(): Promise<SessionRecord[]> {
  try {
    const db = await getDB();
    const items = await db.getAll('history');
    if (items) {
      return items.sort((a, b) => b.timestamp - a.timestamp);
    }
  } catch (e) {
    console.warn('Could not load history from IndexedDB', e);
  }
  const local = localStorage.getItem('mg_history');
  if (local) {
    try {
      return JSON.parse(local).sort((a: SessionRecord, b: SessionRecord) => b.timestamp - a.timestamp);
    } catch {}
  }
  return [];
}

export async function saveSessionRecord(record: SessionRecord): Promise<void> {
  try {
    const db = await getDB();
    await db.put('history', record);
  } catch (e) {
    console.warn('Could not save session to IndexedDB', e);
  }
  const current = await loadHistory();
  current.unshift(record);
  try {
    localStorage.setItem('mg_history', JSON.stringify(current.slice(0, 100)));
  } catch {}
}

export async function clearHistory(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('history');
  } catch (e) {
    console.warn('Could not clear IndexedDB history', e);
  }
  try {
    localStorage.removeItem('mg_history');
  } catch {}
}

export async function loadTrainingLevels(): Promise<TrainingLevel[]> {
  try {
    const db = await getDB();
    const items = await db.getAll('training');
    if (items && items.length > 0) {
      return items.sort((a, b) => a.level - b.level);
    }
  } catch (e) {
    console.warn('Could not load training from IndexedDB', e);
  }
  const local = localStorage.getItem('mg_training');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  return DEFAULT_TRAINING_LEVELS;
}

export async function saveTrainingLevels(levels: TrainingLevel[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('training', 'readwrite');
    for (const lvl of levels) {
      await tx.store.put(lvl);
    }
    await tx.done;
  } catch (e) {
    console.warn('Could not save training to IndexedDB', e);
  }
  try {
    localStorage.setItem('mg_training', JSON.stringify(levels));
  } catch {}
}

export async function loadActivities(): Promise<ActivityItem[]> {
  try {
    const db = await getDB();
    const items = await db.getAll('activities');
    if (items && items.length > 0) return items;
  } catch (e) {
    console.warn('Could not load activities from IndexedDB', e);
  }
  const local = localStorage.getItem('mg_activities');
  if (local) {
    try {
      return JSON.parse(local);
    } catch {}
  }
  return DEFAULT_ACTIVITIES;
}

export async function saveActivities(activities: ActivityItem[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction('activities', 'readwrite');
    await tx.store.clear();
    for (const act of activities) {
      await tx.store.put(act);
    }
    await tx.done;
  } catch (e) {
    console.warn('Could not save activities to IndexedDB', e);
  }
  try {
    localStorage.setItem('mg_activities', JSON.stringify(activities));
  } catch {}
}
