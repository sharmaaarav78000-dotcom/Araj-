// Elegant, subtle luxury synthesizer chimes using Web Audio API

let audioCtx: AudioContext | null = null;
let isMuted = false;

export const toggleAudioMute = (): boolean => {
  isMuted = !isMuted;
  return isMuted;
};

export const getIsAudioMuted = (): boolean => isMuted;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Subtle warm metallic bell chime for luxury micro-actions
export const playLuxuryChime = (type: 'add' | 'scan' | 'click' | 'success' = 'click') => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';

    if (type === 'add') {
      // Golden bell dual tone
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    } else if (type === 'scan') {
      // Futuristic resonance
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    } else if (type === 'success') {
      // Royal celebratory chord tone
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    } else {
      // Subtle haptic touch click
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (type === 'success' ? 0.75 : 0.5));
  } catch {
    // Graceful silent fallback
  }
};
