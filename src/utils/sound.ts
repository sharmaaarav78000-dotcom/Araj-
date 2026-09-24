// Ultra-Premium Royal Synthesizer Sound Engine using Web Audio API
// Custom crafted for ARAJ Luxury Dry Fruits & Spices

export type SoundEffectType = 
  | 'add' 
  | 'scan' 
  | 'click' 
  | 'success' 
  | 'heart' 
  | 'sparkle' 
  | 'hover' 
  | 'aroma'
  | 'slide'
  | 'slide-next'
  | 'slide-prev'
  | 'whoosh';

export type SlideSoundStyle = 'royal-gold' | 'crystal-shimmer' | 'velvet-whoosh' | 'zen-chime';

export interface SlideSoundOption {
  id: SlideSoundStyle;
  label: string;
  description: string;
  icon: string;
}

export const SLIDE_SOUND_STYLES: SlideSoundOption[] = [
  {
    id: 'royal-gold',
    label: 'Royal Gold & Silk',
    description: 'Bespoke multi-layered golden chimes with silk air whoosh and stereo panning',
    icon: '✨',
  },
  {
    id: 'crystal-shimmer',
    label: 'Crystal Glass Harp',
    description: 'Crystalline harmonic twinkle with celestial high-frequency resonance',
    icon: '💎',
  },
  {
    id: 'velvet-whoosh',
    label: 'Velvet Aeroglide',
    description: 'Modern tactile aerodynamic sweep with deep resonant sub-warmth',
    icon: '🕊️',
  },
  {
    id: 'zen-chime',
    label: 'Agra Heritage Bell',
    description: 'Warm acoustic singing bell and brass overtone bloom',
    icon: '🔔',
  },
];

let audioCtx: AudioContext | null = null;
let isMuted = false;
let currentSlideSoundStyle: SlideSoundStyle = 'royal-gold';

export const setSlideSoundStyle = (style: SlideSoundStyle) => {
  currentSlideSoundStyle = style;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('araj_slide_sound_style', style);
    } catch {
      // Ignore storage errors
    }
  }
};

export const getSlideSoundStyle = (): SlideSoundStyle => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('araj_slide_sound_style') as SlideSoundStyle;
      if (saved && SLIDE_SOUND_STYLES.some((s) => s.id === saved)) {
        currentSlideSoundStyle = saved;
      }
    } catch {
      // Ignore storage errors
    }
  }
  return currentSlideSoundStyle;
};

export const toggleAudioMute = (): boolean => {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('araj:mute-change', { detail: { isMuted } }));
    }, 0);
  }
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

// Helper: Generate procedural pink/silk noise buffer for warm, tactile whooshes
function getNoiseBuffer(ctx: AudioContext, duration: number = 0.4): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bufferSize = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Pink noise filter approximation for smoother velvet texture
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    const pink = b0 + b1 + b2 + white * 0.5362;
    data[i] = pink * 0.11;
  }
  return buffer;
}

/**
 * High-End Direction-Aware Slide Transition Sound Engine
 * Synthesizes a bespoke luxury acoustic sensation with spatial panning,
 * silky aerodynamic air swept noise, celesta crystal transients, and royal harmonic bloom.
 */
export const playSlideSound = (direction: 1 | -1 = 1, style?: SlideSoundStyle) => {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const activeStyle = style || getSlideSoundStyle();

    // Dispatch pulse event for UI visualizer
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('araj:sound-played', { detail: { type: 'slide', direction, style: activeStyle } }));
      }, 0);
    }

    const now = ctx.currentTime;
    const isForward = direction >= 0;

    // Master Dynamics Compressor for silky warmth & preventing harsh peaks
    const masterCompressor = ctx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-16, now);
    masterCompressor.knee.setValueAtTime(10, now);
    masterCompressor.ratio.setValueAtTime(3.5, now);
    masterCompressor.attack.setValueAtTime(0.004, now);
    masterCompressor.release.setValueAtTime(0.25, now);

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1.0, now);

    // Optional Master Panner for Spatial Motion (Left to Right / Right to Left)
    let outputNode: AudioNode = masterGain;
    if ('createStereoPanner' in ctx) {
      try {
        const panner = ctx.createStereoPanner();
        const startPan = isForward ? -0.45 : 0.45;
        const endPan = isForward ? 0.45 : -0.45;
        panner.pan.setValueAtTime(startPan, now);
        panner.pan.linearRampToValueAtTime(endPan, now + 0.38);
        panner.connect(masterCompressor);
        outputNode = panner;
      } catch {
        masterGain.connect(masterCompressor);
        outputNode = masterGain;
      }
    } else {
      masterGain.connect(masterCompressor);
      outputNode = masterGain;
    }

    masterCompressor.connect(ctx.destination);

    if (activeStyle === 'royal-gold') {
      // --- LAYER 1: Specular Glass / Celesta Transient Impulse (Initial Crisp Contact) ---
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(isForward ? 2793.83 : 2349.32, now); // F7 or D7
      clickGain.gain.setValueAtTime(0.024, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      clickOsc.connect(clickGain);
      clickGain.connect(outputNode);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

      // --- LAYER 2: Velvet Silk Air Glide (Dual-Filter Smooth Whoosh) ---
      const noiseBuffer = getNoiseBuffer(ctx, 0.45);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const bandFilter = ctx.createBiquadFilter();
      bandFilter.type = 'bandpass';
      bandFilter.Q.setValueAtTime(2.4, now);

      const startFreq = isForward ? 480 : 2800;
      const targetFreq = isForward ? 2800 : 480;
      bandFilter.frequency.setValueAtTime(startFreq, now);
      bandFilter.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.32);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.042, now + 0.06);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      noiseSource.connect(bandFilter);
      bandFilter.connect(noiseGain);
      noiseGain.connect(outputNode);
      noiseSource.start(now);
      noiseSource.stop(now + 0.45);

      // --- LAYER 3: Royal Pentatonic Chime Bloom (D-Major 9th Celestial Harmonic Cascade) ---
      // Notes: D5, F#5, A5, C#6, E6, A6 (Lush regal overtone cluster)
      const royalNotes = isForward
        ? [587.33, 739.99, 880.00, 1108.73, 1318.51, 1760.00]
        : [1760.00, 1318.51, 1108.73, 880.00, 739.99, 587.33];

      royalNotes.forEach((freq, idx) => {
        const noteDelay = idx * 0.024;
        const noteStart = now + noteDelay;

        // Primary Pure Tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, noteStart);
        osc1.frequency.exponentialRampToValueAtTime(freq * (isForward ? 1.025 : 0.975), noteStart + 0.32);

        gain1.gain.setValueAtTime(0.001, noteStart);
        gain1.gain.exponentialRampToValueAtTime(0.032 - idx * 0.003, noteStart + 0.018);
        gain1.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.42);

        osc1.connect(gain1);
        gain1.connect(outputNode);
        osc1.start(noteStart);
        osc1.stop(noteStart + 0.45);

        // Secondary Celesta Brass Overtone (2.76x Golden Ratio Bell Shimmer)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2.0, noteStart);
        gain2.gain.setValueAtTime(0.001, noteStart);
        gain2.gain.exponentialRampToValueAtTime(0.008, noteStart + 0.012);
        gain2.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.25);

        osc2.connect(gain2);
        gain2.connect(outputNode);
        osc2.start(noteStart);
        osc2.stop(noteStart + 0.28);
      });

      // --- LAYER 4: Sub-Acoustic Haptic Weight (Physical Displacement Warmth) ---
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      const subStart = isForward ? 110 : 210;
      const subEnd = isForward ? 210 : 110;
      subOsc.frequency.setValueAtTime(subStart, now);
      subOsc.frequency.exponentialRampToValueAtTime(subEnd, now + 0.26);

      subGain.gain.setValueAtTime(0.028, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      subOsc.connect(subGain);
      subGain.connect(outputNode);
      subOsc.start(now);
      subOsc.stop(now + 0.32);

    } else if (activeStyle === 'crystal-shimmer') {
      // --- CRYSTAL GLASS HARP & DIAMOND TWINKLE ---
      const crystalNotes = isForward
        ? [659.25, 830.61, 987.77, 1318.51, 1661.22, 1975.53, 2637.02] // E5 -> E7
        : [2637.02, 1975.53, 1661.22, 1318.51, 987.77, 830.61, 659.25];

      crystalNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.022;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);
        osc.frequency.exponentialRampToValueAtTime(freq * (isForward ? 1.02 : 0.98), noteStart + 0.35);

        gain.gain.setValueAtTime(0.001, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.034, noteStart + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.4);

        osc.connect(gain);
        gain.connect(outputNode);
        osc.start(noteStart);
        osc.stop(noteStart + 0.42);
      });

      // Ethereal High Sparkle Ceiling
      const shimmer = ctx.createOscillator();
      const sGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(3520.0, now); // A7
      sGain.gain.setValueAtTime(0.016, now);
      sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      shimmer.connect(sGain);
      sGain.connect(outputNode);
      shimmer.start(now);
      shimmer.stop(now + 0.3);

    } else if (activeStyle === 'velvet-whoosh') {
      // --- VELVET AEROGLIDE (Smooth Modern Tactile Sweep) ---
      const noiseBuffer = getNoiseBuffer(ctx, 0.38);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.Q.setValueAtTime(3.6, now);
      const fStart = isForward ? 350 : 2200;
      const fEnd = isForward ? 2200 : 350;
      lowFilter.frequency.setValueAtTime(fStart, now);
      lowFilter.frequency.exponentialRampToValueAtTime(fEnd, now + 0.28);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.055, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

      noiseSource.connect(lowFilter);
      lowFilter.connect(gain);
      gain.connect(outputNode);
      noiseSource.start(now);
      noiseSource.stop(now + 0.38);

      // Deep tactile tactile thud
      const sub = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(isForward ? 120 : 180, now);
      sub.frequency.exponentialRampToValueAtTime(isForward ? 70 : 110, now + 0.2);
      subG.gain.setValueAtTime(0.038, now);
      subG.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      sub.connect(subG);
      subG.connect(outputNode);
      sub.start(now);
      sub.stop(now + 0.24);

    } else {
      // --- AGRA HERITAGE BELL & SINGING BOWL (Bronze & Brass Resonance) ---
      const baseFreq = isForward ? 480 : 432; // Regal tuning
      const harmonics = [
        { mult: 1.0, gain: 0.05, decay: 0.65 },
        { mult: 2.76, gain: 0.022, decay: 0.5 }, // Singing bowl harmonic
        { mult: 5.4, gain: 0.008, decay: 0.35 },
      ];

      harmonics.forEach(({ mult, gain: peakGain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        const noteFreq = baseFreq * mult;
        osc.frequency.setValueAtTime(noteFreq, now);
        osc.frequency.exponentialRampToValueAtTime(noteFreq * (isForward ? 1.02 : 0.98), now + decay);

        g.gain.setValueAtTime(peakGain, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(g);
        g.connect(outputNode);
        osc.start(now);
        osc.stop(now + decay + 0.05);
      });
    }
  } catch {
    // Graceful silent fallback
  }
};

// General Luxury Micro-Action Synthesizer
export const playLuxuryChime = (type: SoundEffectType = 'click') => {
  if (isMuted) return;

  // Route slide sounds directly to the dedicated slide engine
  if (type === 'slide' || type === 'slide-next' || type === 'whoosh') {
    playSlideSound(1);
    return;
  }
  if (type === 'slide-prev') {
    playSlideSound(-1);
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Dispatch pulse event for UI visualizer asynchronously
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('araj:sound-played', { detail: { type } }));
      }, 0);
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (type === 'add') {
      // Golden bell dual tone with harmonic sparkle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      // Second harmonic chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now); // D6
      gain2.gain.setValueAtTime(0.02, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.35);
    } else if (type === 'sparkle') {
      // Shimmering harp twinkle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    } else if (type === 'heart') {
      // Warm marimba heart tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.1); // C#5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    } else if (type === 'scan') {
      // Futuristic spectrometry sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.18); // G5
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    } else if (type === 'aroma') {
      // Warm ethereal ambient breath
      osc.type = 'sine';
      osc.frequency.setValueAtTime(329.63, now); // E4
      osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.25); // B4
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    } else if (type === 'success') {
      // Royal celebratory chord tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
    } else if (type === 'hover') {
      // Subtle micro-tick for tactile feel
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    } else {
      // Subtle haptic touch click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + (type === 'success' || type === 'aroma' ? 0.75 : 0.55));
  } catch {
    // Graceful silent fallback
  }
};
