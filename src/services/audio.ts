import { SoundMode } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a single warm, gentle sine/triangle bell tone with smooth attack and decay
 */
function playGentleTone(freq: number, duration: number = 0.8, volume: number = 0.12, type: OscillatorType = 'sine') {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Gentle low-pass filter to remove harsh upper frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Smooth envelope: very soft attack to prevent clicking, smooth decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  } catch (err) {
    console.warn('Audio tone play error', err);
  }
}

/**
 * Soft interactive bubble/tap sound
 */
export function playSoftTap(soundMode: SoundMode) {
  if (soundMode !== 'gentle') return;
  // High sweet melodic chime (F5 - 698Hz)
  playGentleTone(698.46, 0.35, 0.08, 'sine');
}

/**
 * Checkpoint chime (approaching halfway or 75%)
 */
export function playCheckpointChime(soundMode: SoundMode) {
  if (soundMode !== 'gentle') return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Gentle two-tone harp arpeggio (C5 -> G5)
  playGentleTone(523.25, 0.6, 0.09, 'sine');
  setTimeout(() => {
    playGentleTone(783.99, 0.7, 0.09, 'sine');
  }, 180);
}

/**
 * Gentle celebration melody: peaceful pentatonic major chord progression (C - E - G - A - C6)
 * Like a gentle wind chime or lullaby box.
 */
export function playCompletionChime(soundMode: SoundMode) {
  if (soundMode === 'silent') return;

  const notes = [
    { freq: 523.25, delay: 0 },    // C5
    { freq: 659.25, delay: 180 },  // E5
    { freq: 783.99, delay: 360 },  // G5
    { freq: 880.00, delay: 540 },  // A5
    { freq: 1046.50, delay: 720 }, // C6
  ];

  notes.forEach(({ freq, delay }) => {
    setTimeout(() => {
      playGentleTone(freq, 1.4, 0.12, 'sine');
    }, delay);
  });
}

/**
 * Spoken encouragement using Web Speech API (optional and parent-controlled)
 */
export function speakGentlePhrase(phrase: string, spokenEnabled: boolean) {
  if (!spokenEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.rate = 0.85; // slightly slower, calming pace
    utterance.pitch = 1.15; // slightly friendly, warm pitch
    utterance.volume = 0.7; // gentle volume
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}
