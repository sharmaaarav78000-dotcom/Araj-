import React from 'react';
import { motion } from 'motion/react';

// Realistic Floating California/Mamra Badam (Almond) Component with warm toasted luster
export const FloatingBadam: React.FC<{
  className?: string;
  rotate?: number;
  scale?: number;
  delay?: number;
  duration?: number;
}> = ({ className = '', rotate = 0, scale = 1, delay = 0, duration = 6 }) => (
  <motion.div
    animate={{
      y: [0, -14, 3, 0],
      rotate: [rotate, rotate + 8, rotate - 5, rotate],
      scale: [scale, scale * 1.03, scale * 0.98, scale],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    className={`absolute pointer-events-none filter drop-shadow-[0_12px_24px_rgba(130,55,15,0.45)] z-20 ${className}`}
  >
    <svg viewBox="0 0 80 110" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="badamGrad" cx="42%" cy="46%" r="58%">
          <stop offset="0%" stopColor="#A85827" />
          <stop offset="45%" stopColor="#873F17" />
          <stop offset="80%" stopColor="#6C2E0E" />
          <stop offset="100%" stopColor="#4A1E08" />
        </radialGradient>
        <linearGradient id="badamRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5C07A" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#D48A3C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#5A230A" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path
        d="M 40 10 C 52 28, 68 55, 68 76 C 68 94, 55 104, 40 104 C 25 104, 12 94, 12 76 C 12 55, 28 28, 40 10 Z"
        fill="url(#badamGrad)"
      />
      <path
        d="M 40 10 C 52 28, 68 55, 68 76 C 68 94, 55 104, 40 104"
        stroke="url(#badamRim)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M 38 22 C 48 42, 58 66, 56 86" stroke="#5A240A" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
      <path d="M 32 30 C 26 48, 22 68, 26 88" stroke="#5A240A" strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M 40 28 C 42 48, 44 72, 42 92" stroke="#DCA25D" strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
    </svg>
  </motion.div>
);

// Realistic Floating Royal Jumbo Cashew (Kaju) Component with creamy ivory & golden butter blush
export const FloatingCashew: React.FC<{
  className?: string;
  rotate?: number;
  scale?: number;
  delay?: number;
  duration?: number;
}> = ({ className = '', rotate = 0, scale = 1, delay = 0, duration = 6.5 }) => (
  <motion.div
    animate={{
      y: [0, -15, 4, 0],
      rotate: [rotate, rotate - 9, rotate + 6, rotate],
      scale: [scale, scale * 1.04, scale * 0.98, scale],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    className={`absolute pointer-events-none filter drop-shadow-[0_12px_24px_rgba(215,165,85,0.4)] z-20 ${className}`}
  >
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="cashewGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="45%" stopColor="#F9EED9" />
          <stop offset="80%" stopColor="#EAD3AB" />
          <stop offset="100%" stopColor="#D2AE74" />
        </radialGradient>
        <linearGradient id="cashewToasted" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#E6C488" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B38038" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M 30 20 C 48 10, 78 18, 85 40 C 92 62, 75 88, 52 90 C 35 91, 26 78, 32 66 C 36 58, 48 58, 52 50 C 56 42, 50 32, 38 32 C 30 32, 24 35, 18 32 C 12 28, 18 22, 30 20 Z"
        fill="url(#cashewGrad)"
      />
      <path
        d="M 30 20 C 48 10, 78 18, 85 40 C 92 62, 75 88, 52 90"
        stroke="url(#cashewToasted)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 46 36 C 54 44, 52 58, 42 66"
        stroke="#C49B5B"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse cx="68" cy="38" rx="7" ry="12" transform="rotate(25 68 38)" fill="#FFF" opacity="0.6" />
    </svg>
  </motion.div>
);

// Floating Pistachio (Pista) Component with radiant emerald kernel
export const FloatingPista: React.FC<{
  className?: string;
  rotate?: number;
  scale?: number;
  delay?: number;
  duration?: number;
}> = ({ className = '', rotate = 0, scale = 1, delay = 0, duration = 5.8 }) => (
  <motion.div
    animate={{
      y: [0, -13, 3, 0],
      rotate: [rotate, rotate + 7, rotate - 6, rotate],
      scale: [scale, scale * 1.03, scale * 0.97, scale],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    className={`absolute pointer-events-none filter drop-shadow-[0_10px_20px_rgba(72,187,120,0.35)] z-20 ${className}`}
  >
    <svg viewBox="0 0 90 90" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="pistaShell" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FEFCBF" />
          <stop offset="60%" stopColor="#ECC94B" />
          <stop offset="100%" stopColor="#B7791F" />
        </radialGradient>
        <radialGradient id="pistaKernel" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#9AE6B4" />
          <stop offset="50%" stopColor="#48BB78" />
          <stop offset="100%" stopColor="#22543D" />
        </radialGradient>
      </defs>
      <ellipse cx="45" cy="45" rx="36" ry="24" transform="rotate(-30 45 45)" fill="url(#pistaShell)" />
      <ellipse cx="46" cy="45" rx="28" ry="14" transform="rotate(-30 46 45)" fill="url(#pistaKernel)" />
      <path d="M 32 40 Q 46 36 60 48" stroke="#E6FFFA" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
    </svg>
  </motion.div>
);

// Floating Golden Afghan Kishmish (Raisin)
export const FloatingKishmish: React.FC<{
  className?: string;
  rotate?: number;
  scale?: number;
  delay?: number;
  duration?: number;
}> = ({ className = '', rotate = 0, scale = 1, delay = 0, duration = 6.2 }) => (
  <motion.div
    animate={{
      y: [0, -12, 4, 0],
      rotate: [rotate, rotate - 8, rotate + 6, rotate],
      scale: [scale, scale * 1.04, scale * 0.98, scale],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
    className={`absolute pointer-events-none filter drop-shadow-[0_8px_16px_rgba(214,158,46,0.35)] z-20 ${className}`}
  >
    <svg viewBox="0 0 70 90" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="kishmishGrad" cx="40%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#ECC94B" />
          <stop offset="45%" stopColor="#D69E2E" />
          <stop offset="85%" stopColor="#975A16" />
          <stop offset="100%" stopColor="#744210" />
        </radialGradient>
      </defs>
      <path
        d="M 35 15 C 48 18, 54 35, 52 55 C 50 72, 40 82, 32 80 C 22 78, 16 65, 18 45 C 20 28, 25 12, 35 15 Z"
        fill="url(#kishmishGrad)"
      />
      <path d="M 30 25 Q 36 45 32 68" stroke="#FEFCBF" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M 24 35 Q 28 50 25 65" stroke="#744210" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
    </svg>
  </motion.div>
);
