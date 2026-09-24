import React from 'react';
import { motion } from 'motion/react';
import { Gift, Sparkles, ArrowRight, Crown, Wand2, ShieldCheck, Box } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const GiftingSection: React.FC<{ onExploreGifting: () => void }> = ({ onExploreGifting }) => {
  const { products, openHamper } = useStore();

  const giftPacks = products.filter(
    (p) => p.category === 'gifting'
  ).slice(0, 8);

  return (
    <section id="gifting" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient royal illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#D4AF37]/10 via-transparent to-transparent blur-[160px] pointer-events-none" />

      {/* Header with Script calligraphy */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-script-luxury text-2xl sm:text-3xl text-[#D4AF37]">
              L’Art du Coffret Impérial
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-[#D4AF37]/35 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Royal Festivities & Executive Hampers</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE]">
            Perfect For <span className="gold-gradient-text font-serif italic">Gifting</span>
          </h2>
          
          <p className="font-editorial italic text-base sm:text-lg text-[#DFDACD]">
            "An enduring gesture of honor, prosperity, and celebratory warmth."
          </p>
          
          <p className="text-sm text-[#A6A295] font-light leading-relaxed">
            Crafted for royal weddings, auspicious Diwali rituals, and corporate appreciation. Encased in velvet-lined boxes with metallic foil crests and airtight nitrogen compartments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Working Bespoke Hamper Builder Trigger */}
          <button
            onClick={openHamper}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full glass-btn-secondary text-[#FAF7EE] text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-[#D4AF37]" />
            <span>CUSTOM HAMPER ATELIER</span>
          </button>

          <button
            id="explore-gift-collection-btn"
            onClick={onExploreGifting}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider group cursor-pointer"
          >
            <span>ALL GIFT BOXES</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Interactive Bespoke Atelier Showcase Feature Card */}
      <div className="mb-12 p-6 sm:p-8 rounded-3xl glass-card-futuristic relative overflow-hidden border border-[#D4AF37]/40 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#F5DE88] text-[11px] font-mono tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Bespoke Concierge Service
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
            Architect Your Own Royal Keepsake
          </h3>
          <p className="text-xs sm:text-sm text-[#DFDACD]/85 leading-relaxed">
            Select an heirloom wooden lacquer or velvet box, curate 4 to 6 compartments with hand-graded W240 cashews, Mamra badam, Kashmiri saffron, and custom wax-sealed monogram message.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs font-mono text-[#D4AF37]">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed Fresh</span>
            <span className="flex items-center gap-1"><Box className="w-3.5 h-3.5" /> Gold Embossed Inscription</span>
          </div>
        </div>

        <button
          onClick={openHamper}
          className="relative z-10 px-8 py-4 rounded-full glass-btn-gold text-[#0A0A0E] font-black text-xs sm:text-sm uppercase tracking-widest cursor-pointer whitespace-nowrap"
        >
          LAUNCH HAMPER ATELIER
        </button>
      </div>

      {/* Grid of Gifting Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
        {giftPacks.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
};
