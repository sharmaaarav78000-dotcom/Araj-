import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, ShieldAlert, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const SpicesSection: React.FC<{ onExploreSpices: () => void }> = ({ onExploreSpices }) => {
  const { products } = useStore();

  // Specifically select verified spices first + top blends
  const verifiedSpices = products.filter((p) =>
    p.category === 'spices' &&
    (p.name.includes('Chana Masala') ||
     p.name.includes('Haldi') ||
     p.name.includes('Turmeric') ||
     p.name.includes('Chatpata Chat Masala') ||
     p.name.includes('Chunky Chinese Masala') ||
     p.name.includes('Black Pepper') ||
     p.name.includes('Kashmiri') ||
     p.name.includes('Garam Masala'))
  ).slice(0, 8);

  return (
    <section id="spices" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient warm fire glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-gradient-to-tr from-[#E69C36]/15 to-transparent blur-[120px] pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 text-[#E69C36]" />
            <span>Stone Ground Heritage</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE]">
            Authentic <span className="gold-gradient-text font-serif italic">Indian Spices</span>
          </h2>
          <p className="text-sm sm:text-base text-[#B8B4A8] font-light leading-relaxed">
            Pure, aromatic, stone-milled whole masalas formulated without fillers, starch, or artificial coloring. Experience the true soul of traditional North Indian culinary heritage.
          </p>
        </div>

        <button
          onClick={onExploreSpices}
          className="self-start md:self-end flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-[#D4AF37]/35 text-[#F5DE88] hover:text-[#FFF] hover:bg-[#D4AF37]/15 text-xs font-semibold tracking-wider uppercase transition-all duration-300 group"
        >
          <span>VIEW ALL SPICES</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Verified Products Showcase Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        {[
          { name: 'Chana Masala', weight: '100g', price: '₹80', mrp: '₹160', tag: '50% OFF' },
          { name: 'Haldi (Turmeric)', weight: '500g', price: '₹130', mrp: '₹260', tag: '50% OFF' },
          { name: 'Chatpata Chat', weight: '100g', price: '₹80', mrp: '₹159', tag: '50% OFF' },
          { name: 'Chunky Chinese', weight: '100g', price: '₹65', mrp: '₹130', tag: '50% OFF' }
        ].map((item) => (
          <div
            key={item.name}
            className="rounded-xl glass-panel-gold p-3 border border-[#D4AF37]/25 flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold block">
                {item.weight} Pack
              </span>
              <span className="font-serif font-bold text-xs sm:text-sm text-[#FAF7EE]">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-bold text-[#FAF7EE] block">
                {item.price}
              </span>
              <span className="text-[10px] text-[#88847A] line-through">
                {item.mrp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid of Spice Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {verifiedSpices.map((spice) => (
          <ProductCard key={spice.id} product={spice} />
        ))}
      </div>
    </section>
  );
};
