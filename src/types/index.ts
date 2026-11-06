export type CharacterId = 'bunny' | 'panda' | 'elephant' | 'dinosaur' | 'cat' | 'bear';

export type TimerMode = 
  | 'garden'     // Mode A: Magic Garden Flower Growth
  | 'rainbow'    // Mode B: Rainbow Timer
  | 'journey'    // Mode C: Character Journey to Home
  | 'balloon'    // Mode D: Floating Hot Air Balloon
  | 'butterfly'  // Mode E: Butterfly Flower Hop
  | 'sunset';    // Mode F: Sunset to Moon & Stars

export type TimerDirection = 'grow' | 'disappear'; // Grow up to completion vs. count down

export type AnimationSpeed = 'normal' | 'slow' | 'reduced' | 'static';

export type SoundMode = 'gentle' | 'chime-only' | 'silent';

export type VisualTheme = 'pastel' | 'bright' | 'high-contrast';

export type AmbientSoundType = 'none' | 'river' | 'rain' | 'sea';

export interface ParentSettings {
  defaultDurationSec: number;
  availablePresets: number[]; // e.g. [30, 60, 120, 180, 300, 600, 900, 1200, 1800]
  defaultMode: TimerMode;
  direction: TimerDirection;
  character: CharacterId;
  characterAnimation: boolean;
  soundMode: SoundMode;
  spokenInstructions: boolean;
  ambientSound: AmbientSoundType;
  ambientVolume: number;
  animationSpeed: AnimationSpeed;
  visualTheme: VisualTheme;
  largeControls: boolean;
  parentLockEnabled: boolean;
  parentPin: string; // default "1234" or empty for hold-to-unlock
  lockTimerControls: boolean;
  allowVisualBreak: boolean;
  celebrationDurationSec: number;
  wakeLockEnabled: boolean;
  starsPerCompletedTimer: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  iconName: string;
  category: 'first' | 'then';
  customImageDataUrl?: string;
  isCustom?: boolean;
}

export interface FirstThenState {
  firstActivity: ActivityItem;
  thenActivity: ActivityItem;
  durationSec: number;
}

export interface TrainingLevel {
  level: number;
  durationSec: number;
  name: string;
  unlocked: boolean;
  completedTimes: number;
}

export interface GardenReward {
  id: string;
  type: 'flower' | 'butterfly' | 'rainbow' | 'tree' | 'bunny-friend' | 'sparkle' | 'star-badge';
  title: string;
  earnedAt: number;
  posX: number; // percentage 0-100
  posY: number; // percentage 0-100
  variant: number;
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  durationSelectedSec: number;
  durationCompletedSec: number;
  completed: boolean;
  starsEarned: number;
  mode: TimerMode;
  activityTitle?: string;
  trainingLevel?: number;
}
