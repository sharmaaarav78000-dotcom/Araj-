import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { FloatingBadam, FloatingCashew, FloatingPista, FloatingKishmish } from './FloatingDryFruits';

export const DryFruitsSection: React.FC<{ onExploreDryFruits: () => void }> = ({ onExploreDryFruits }) => {
  const { products } = useStore();

  const dryFruits = products.filter(
    (p) => p.category === 'dry fruits'
  ).slice(0, 8);

  return (
    <section id="dry-fruits" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Ambient background gold glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-gradient-to-bl from-[#D4AF37]/15 to-transparent blur-[140px] pointer-events-none" />

      {/* Floating Dry Fruits Accents in Section Atmosphere */}
      <FloatingBadam className="top-12 -left-6 w-16 sm:w-20 h-20 sm:h-24 opacity-40 hidden md:block" rotate={-15} scale={1.1} delay={0.3} duration={7} />
      <FloatingCashew className="top-24 right-4 w-18 sm:w-22 h-18 sm:h-22 opacity-40 hidden md:block" rotate={28} scale={1.15} delay={1.2} duration={7.5} />
      <FloatingPista className="bottom-20 left-8 w-14 sm:w-16 h-16 sm:h-18 opacity-35 hidden md:block" rotate={-20} scale={1.05} delay={2.1} duration={6.8} />
      <FloatingKishmish className="bottom-28 right-12 w-12 sm:w-14 h-14 sm:h-16 opacity-35 hidden md:block" rotate={18} scale={1.05} delay={0.9} duration={7.2} />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Royal Orchard Selections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE]">
            Premium <span className="gold-gradient-text font-serif italic">Dry Fruits</span>
          </h2>
          <p className="text-sm sm:text-base text-[#D4AF37]/90 font-medium tracking-wide">
            Premium Selection • Freshness • Quality • Traditional Taste
          </p>
          <p className="text-sm text-[#A6A295] font-light leading-relaxed">
            Every almond kernel, jumbo cashew, and tender pistachio is rigorously graded for size, moisture balance, and natural sweetness. Hand-packed in nitrogen-flushed sealable pouches.
          </p>
        </div>

        <button
          onClick={onExploreDryFruits}
          className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-[#D4AF37]/35 text-[#F5DE88] hover:text-[#FFF] hover:bg-[#D4AF37]/15 text-xs font-semibold tracking-wider uppercase transition-all duration-300 group"
        >
          <span>VIEW ALL DRY FRUITS</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Quality Pillars Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {[
          { label: 'Jumbo Graded', desc: 'Uniform kernel size & fullness' },
          { label: 'Unprocessed & Raw', desc: 'No artificial glaze or salt' },
          { label: 'Nitrogen Barrier', desc: 'Locks in crispness & nutrients' },
          { label: 'Doctor Recommended', desc: 'Heart-healthy fats & protein' }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl glass-panel p-3.5 border border-white/10 flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-[#FAF7EE] block">
                {item.label}
              </span>
              <span className="text-[11px] text-[#88847A] block">
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {dryFruits.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
};
