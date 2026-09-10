import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Flame, Sparkles, Droplets, CheckCircle, Activity, Play } from 'lucide-react';
import { playLuxuryChime } from '../utils/sound';
import { triggerParticleBurst } from '../utils/effects';

interface SpiceProfile {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  oilRetention: number; // percentage
  pungencyIndex: number; // 1-100
  curcuminOrPiperine: string;
  primaryTerpenes: string[];
  notes: string;
  colorAccent: string;
  bgGradient: string;
}

const SPICE_PROFILES: SpiceProfile[] = [
  {
    id: 'chana',
    name: 'Agra Chana Masala',
    hindiName: 'चना मसाला',
    category: 'Whole Herb Blend',
    oilRetention: 97.4,
    pungencyIndex: 78,
    curcuminOrPiperine: 'Anardana & Coriander Seeds',
    primaryTerpenes: ['Linalool', 'Cineole', 'Phellandrene'],
    notes: 'Tangy roasted pomegranate seeds blended with stone-milled coriander and royal cumin.',
    colorAccent: '#E69C36',
    bgGradient: 'from-[#E69C36]/20 to-[#D4AF37]/10',
  },
  {
    id: 'haldi',
    name: 'Salem Kasturi Haldi',
    hindiName: 'कस्तूरी हल्दी',
    category: 'Golden Curcumin Root',
    oilRetention: 98.8,
    pungencyIndex: 45,
    curcuminOrPiperine: 'Curcumin 5.2% High Bio-Active',
    primaryTerpenes: ['ar-Turmerone', 'Curlone', 'Zingiberene'],
    notes: 'Intense golden-amber hue with earthy, woody fragrance from slow-cured Salem rhizomes.',
    colorAccent: '#FFB800',
    bgGradient: 'from-[#FFB800]/20 to-[#E69C36]/10',
  },
  {
    id: 'mirch',
    name: 'Kashmiri Degi Mirch',
    hindiName: 'कश्मीरी मिर्च',
    category: 'Sun-Dried Chili Pods',
    oilRetention: 96.2,
    pungencyIndex: 68,
    curcuminOrPiperine: 'Capsanthin 140 ASTA Color',
    primaryTerpenes: ['Capsaicin', 'Hexenal', 'Carotenoids'],
    notes: 'Vibrant natural ruby tint with mild smokiness, devoid of any added synthetic food colors.',
    colorAccent: '#FF4D4D',
    bgGradient: 'from-[#FF4D4D]/20 to-[#D4AF37]/10',
  },
  {
    id: 'pepper',
    name: 'Malabar Black Tellicherry',
    hindiName: 'काली मिर्च',
    category: 'Extra Bold Peppercorn',
    oilRetention: 99.1,
    pungencyIndex: 94,
    curcuminOrPiperine: 'Piperine 6.8% Sharp Heat',
    primaryTerpenes: ['beta-Caryophyllene', 'Pinene', 'Limonene'],
    notes: 'Sun-ripened 4.2mm bold berries from Kerala foothills with pungent pine and citrus finish.',
    colorAccent: '#D4AF37',
    bgGradient: 'from-[#D4AF37]/20 to-[#2A261D]/40',
  },
];

export const AromaTerpeneSimulator: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDispersing, setIsDispersing] = useState(false);
  const activeSpice = SPICE_PROFILES[activeIdx];

  const handleTestAroma = (e: React.MouseEvent) => {
    setIsDispersing(true);
    playLuxuryChime('aroma');
    triggerParticleBurst(e, { type: 'spice' });

    setTimeout(() => {
      setIsDispersing(false);
    }, 2400);
  };

  const handleSelectSpice = (idx: number) => {
    setActiveIdx(idx);
    playLuxuryChime('click');
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl glass-panel-gold p-5 sm:p-8 border border-[#D4AF37]/35 relative overflow-hidden mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Background radial glow matching selected spice */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-30"
        style={{ backgroundColor: activeSpice.colorAccent }}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Wind className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                Sensory Matrix & Terpene Lab
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#48BB78]/20 text-[#48BB78] border border-[#48BB78]/30 uppercase">
                Active Lab Demo
              </span>
            </div>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#FAF7EE]">
              Cryogenic Volatile Oil & Aroma Simulator
            </h3>
          </div>
        </div>

        {/* Spice Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto max-w-full">
          {SPICE_PROFILES.map((spice, idx) => (
            <button
              key={spice.id}
              onClick={() => handleSelectSpice(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeIdx === idx
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] shadow-md font-bold'
                  : 'text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5'
              }`}
            >
              {spice.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">
        
        {/* Left Interactive Aroma Crucible & Dispersion Ring Effect */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center relative py-6 overflow-hidden">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            
            {/* Billowing fragrant ripple waves when dispersing */}
            <AnimatePresence>
              {isDispersing && (
                <>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-2 border-[#D4AF37] pointer-events-none"
                    style={{ borderColor: activeSpice.colorAccent }}
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 1.8, delay: 0.45, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-[#FAF7EE] pointer-events-none"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 3.0, opacity: 0 }}
                    transition={{ duration: 1.8, delay: 0.9, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/50 pointer-events-none"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Central Crucible Disc */}
            <motion.div
              animate={{
                scale: isDispersing ? [1, 1.06, 1] : 1,
                rotate: isDispersing ? [0, 4, -4, 0] : 0,
              }}
              transition={{ duration: 1.5, repeat: isDispersing ? Infinity : 0 }}
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-full glass-card-futuristic border-2 flex flex-col items-center justify-center p-4 relative z-10 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              style={{ borderColor: activeSpice.colorAccent }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-inner"
                style={{ backgroundColor: `${activeSpice.colorAccent}25` }}
              >
                <Wind className="w-6 h-6" style={{ color: activeSpice.colorAccent }} />
              </div>
              <span className="font-serif text-sm font-bold text-[#FAF7EE] leading-tight line-clamp-1">
                {activeSpice.name}
              </span>
              <span className="text-[10px] text-[#A6A295] font-serif italic mt-0.5">
                {activeSpice.hindiName}
              </span>
              <span className="text-[9px] font-mono text-[#D4AF37] mt-1 uppercase tracking-wider">
                {activeSpice.category}
              </span>
            </motion.div>
          </div>

          {/* Test Aroma Emission Button */}
          <button
            onClick={handleTestAroma}
            className="mt-6 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E6CA65] to-[#C59F2D] text-[#0A0A0E] font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer max-w-full"
          >
            <Play className={`w-3.5 h-3.5 fill-current shrink-0 ${isDispersing ? 'animate-spin' : ''}`} />
            <span className="truncate">{isDispersing ? 'DISPERSING AROMAS...' : 'TEST AROMA EMISSION'}</span>
          </button>
          <span className="text-[10px] text-[#88847A] mt-2">
            Click to simulate cryogenic terpene release
          </span>
        </div>

        {/* Right Live Terpene & Chromatography Meters */}
        <div className="lg:col-span-7 space-y-5">
          <p className="text-sm text-[#DFDACD] leading-relaxed font-light">
            {activeSpice.notes}
          </p>

          {/* Meter 1: Volatile Oil Retention */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#FAF7EE]">
                <Droplets className="w-4 h-4 text-[#D4AF37]" />
                <span>Volatile Essential Oil Retention (Cryo-Milled)</span>
              </span>
              <span className="font-mono text-[#F5DE88] text-sm">
                {activeSpice.oilRetention}%
              </span>
            </div>
            {/* Animated Gauge Bar */}
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeSpice.oilRetention}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5DE88] to-[#48BB78] shadow-[0_0_10px_rgba(212,175,55,0.8)]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#88847A] font-mono">
              <span>Standard Market: ~62%</span>
              <span className="text-[#48BB78] font-bold">+35% Higher Potency</span>
            </div>
          </div>

          {/* Meter 2: Pungency & Active Bio-Chemical Index */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-[#FAF7EE]">
                <Flame className="w-4 h-4 text-[#E69C36]" />
                <span>Active Biochemical Pungency Index</span>
              </span>
              <span className="font-mono text-[#E69C36] text-sm">
                {activeSpice.pungencyIndex} / 100
              </span>
            </div>
            {/* Animated Gauge Bar */}
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activeSpice.pungencyIndex}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-[#E69C36] to-[#FF4D4D] shadow-[0_0_10px_rgba(230,156,54,0.8)]"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#88847A] font-mono">
              <span>Biochemical Compound:</span>
              <span className="text-[#FAF7EE] font-medium">{activeSpice.curcuminOrPiperine}</span>
            </div>
          </div>

          {/* Terpene Profile Badges */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A6A295] block mb-2">
              Identified Pure Terpene Spectrum:
            </span>
            <div className="flex flex-wrap gap-2">
              {activeSpice.primaryTerpenes.map((terpene) => (
                <div
                  key={terpene}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-xs text-[#F5DE88] font-mono"
                >
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>{terpene}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#48BB78]/15 border border-[#48BB78]/35 text-xs text-[#48BB78] font-mono">
                <CheckCircle className="w-3 h-3" />
                <span>Zero Starch Fillers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
