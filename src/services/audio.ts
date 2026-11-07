import { SoundMode, AmbientSoundType } from '../types';

let audioCtx: AudioContext | null = null;

// Global reference to active ambient soundscape
interface ActiveAmbient {
  type: AmbientSoundType;
  source: AudioBufferSourceNode;
  masterGain: GainNode;
  nodesToDisconnect: AudioNode[];
}

let activeAmbient: ActiveAmbient | null = null;
let cachedPinkNoiseBuffer: AudioBuffer | null = null;
let activeCustomCompletionAudio: HTMLAudioElement | null = null;
let activeCustomAmbientAudio: HTMLAudioElement | null = null;
let activePreviewAudio: HTMLAudioElement | null = null;

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
 * Gentle celebration melody: peaceful pentatonic major chord progression or parent's custom sound
 */
export function playCompletionChime(soundMode: SoundMode, customSoundDataUrl?: string) {
  if (soundMode === 'silent') return;

  if (customSoundDataUrl) {
    try {
      if (activeCustomCompletionAudio) {
        activeCustomCompletionAudio.pause();
        activeCustomCompletionAudio.currentTime = 0;
      }
      const audio = new Audio(customSoundDataUrl);
      audio.volume = 0.9;
      activeCustomCompletionAudio = audio;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Custom audio playback failed, falling back to chime', err);
          playDefaultCompletionMelody();
        });
      }
      return;
    } catch (e) {
      console.warn('Error initiating custom audio', e);
    }
  }

  playDefaultCompletionMelody();
}

function playDefaultCompletionMelody() {
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
 * Preview / test audio helper for Parent Settings
 */
export function testPlayCustomSound(dataUrl: string, onEnded?: () => void): () => void {
  stopCustomSoundPreview();
  try {
    const audio = new Audio(dataUrl);
    audio.volume = 0.85;
    activePreviewAudio = audio;
    if (onEnded) {
      audio.onended = () => {
        activePreviewAudio = null;
        onEnded();
      };
    }
    audio.play().catch((e) => console.warn('Preview play error', e));
    return () => {
      audio.pause();
      audio.currentTime = 0;
      if (activePreviewAudio === audio) activePreviewAudio = null;
    };
  } catch {
    return () => {};
  }
}

export function stopCustomSoundPreview() {
  if (activePreviewAudio) {
    activePreviewAudio.pause();
    activePreviewAudio.currentTime = 0;
    activePreviewAudio = null;
  }
}

/**
 * Generates a seamless 5-second buffer of pink noise using Paul Kellet's algorithm
 */
function getPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (cachedPinkNoiseBuffer && cachedPinkNoiseBuffer.sampleRate === ctx.sampleRate) {
    return cachedPinkNoiseBuffer;
  }
  const sampleRate = ctx.sampleRate;
  const bufferSize = sampleRate * 5; // 5 seconds
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.09;
    b6 = white * 0.115926;
  }
  cachedPinkNoiseBuffer = buffer;
  return buffer;
}

/**
 * Stops any active ambient sound smoothly
 */
export function stopAmbientSound() {
  if (activeCustomAmbientAudio) {
    try {
      activeCustomAmbientAudio.pause();
      activeCustomAmbientAudio.currentTime = 0;
    } catch {}
    activeCustomAmbientAudio = null;
  }

  if (!activeAmbient) return;
  try {
    const { source, masterGain, nodesToDisconnect } = activeAmbient;
    const ctx = getAudioContext();
    if (ctx && masterGain) {
      // Smooth fade out over 0.4 seconds to prevent clicking
      const now = ctx.currentTime;
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        try {
          source.stop();
          source.disconnect();
          nodesToDisconnect.forEach((node) => node.disconnect());
        } catch {}
      }, 450);
    } else {
      source.stop();
      source.disconnect();
      nodesToDisconnect.forEach((node) => node.disconnect());
    }
  } catch (err) {
    console.warn('Error stopping ambient sound', err);
  } finally {
    activeAmbient = null;
  }
}

/**
 * Starts sensory-friendly nature ambient sound: River, Rain, Sea, or Custom
 */
export function startAmbientSound(type: AmbientSoundType, volume = 0.35, customAudioUrl?: string) {
  // If requested none, stop current sound
  if (type === 'none') {
    stopAmbientSound();
    return;
  }

  // Handle Custom Audio Loop
  if (type === 'custom') {
    if (!customAudioUrl) {
      stopAmbientSound();
      return;
    }
    if (activeCustomAmbientAudio) {
      if (activeCustomAmbientAudio.src === customAudioUrl) {
        activeCustomAmbientAudio.volume = Math.max(0.05, Math.min(1.0, volume));
        return;
      }
      activeCustomAmbientAudio.pause();
      activeCustomAmbientAudio = null;
    }
    stopAmbientSound();
    try {
      const audio = new Audio(customAudioUrl);
      audio.loop = true;
      audio.volume = Math.max(0.05, Math.min(1.0, volume));
      audio.play().catch((e) => console.warn('Custom ambient audio play error', e));
      activeCustomAmbientAudio = audio;
    } catch (e) {
      console.warn('Failed custom ambient audio', e);
    }
    return;
  }

  // If already playing this type, just adjust volume
  if (activeAmbient && activeAmbient.type === type) {
    setAmbientVolume(volume);
    return;
  }

  // Stop any existing ambient sound first
  stopAmbientSound();

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const pinkBuffer = getPinkNoiseBuffer(ctx);
    const source = ctx.createBufferSource();
    source.buffer = pinkBuffer;
    source.loop = true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(volume * 0.8, now + 1.2); // gentle fade in

    const nodesToDisconnect: AudioNode[] = [masterGain, source];

    if (type === 'sea') {
      // SEA / OCEAN: Lowpass filter modulated by slow sine LFO (8-second wave swells)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(1.2, now);

      // Slow LFO for ocean wave swells (0.12 Hz = ~8.3 seconds cycle)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, now);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, now); // modulates filter from 140Hz to 500Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);

      source.connect(filter);
      filter.connect(masterGain);
      nodesToDisconnect.push(filter, lfo, lfoGain);

    } else if (type === 'rain') {
      // RAIN: Soft pink noise with warm lowpass (~850Hz) and gentle highpass
      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(200, now);

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(950, now);
      lowpass.Q.setValueAtTime(0.8, now);

      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(masterGain);
      nodesToDisconnect.push(highpass, lowpass);

    } else if (type === 'river') {
      // RIVER / BROOK: Two resonant bandpasses + gentle wobble to simulate babbling water
      const band1 = ctx.createBiquadFilter();
      band1.type = 'bandpass';
      band1.frequency.setValueAtTime(420, now);
      band1.Q.setValueAtTime(2.2, now);

      const band2 = ctx.createBiquadFilter();
      band2.type = 'bandpass';
      band2.frequency.setValueAtTime(920, now);
      band2.Q.setValueAtTime(3.0, now);

      // Subtle water stream motion LFO (0.7 Hz)
      const streamLfo = ctx.createOscillator();
      streamLfo.frequency.setValueAtTime(0.7, now);
      const streamLfoGain = ctx.createGain();
      streamLfoGain.gain.setValueAtTime(70, now);

      streamLfo.connect(streamLfoGain);
      streamLfoGain.connect(band1.frequency);
      streamLfoGain.connect(band2.frequency);
      streamLfo.start(now);

      source.connect(band1);
      source.connect(band2);
      band1.connect(masterGain);
      band2.connect(masterGain);
      nodesToDisconnect.push(band1, band2, streamLfo, streamLfoGain);
    }

    masterGain.connect(ctx.destination);
    source.start(now);

    activeAmbient = {
      type,
      source,
      masterGain,
      nodesToDisconnect,
    };
  } catch (err) {
    console.warn('Failed to start ambient sound:', err);
  }
}

/**
 * Updates the volume of the ambient soundscape smoothly
 */
export function setAmbientVolume(volume: number) {
  if (!activeAmbient) return;
  const ctx = getAudioContext();
  if (ctx && activeAmbient.masterGain) {
    const now = ctx.currentTime;
    activeAmbient.masterGain.gain.setValueAtTime(activeAmbient.masterGain.gain.value, now);
    activeAmbient.masterGain.gain.linearRampToValueAtTime(Math.max(0.001, volume * 0.8), now + 0.2);
  }
}

/**
 * Get the currently playing ambient sound type
 */
export function getActiveAmbientType(): AmbientSoundType {
  return activeAmbient ? activeAmbient.type : 'none';
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
