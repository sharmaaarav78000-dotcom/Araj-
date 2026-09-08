import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, HeartHandshake, History, CheckCircle2, Cpu, FileCheck } from 'lucide-react';
import { BRAND_INFO, TIMELINE_MILESTONES, ACHIEVEMENTS } from '../data/brand';
import { useStore } from '../context/StoreContext';

export const BrandStory: React.FC = () => {
  const { openScanner } = useStore();

  return (
    <section id="story" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-radial from-[#D4AF37]/10 to-transparent blur-[160px] pointer-events-none" />

      {/* Main Story Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="space-y-1">
          <span className="font-script-luxury text-3xl sm:text-4xl text-[#D4AF37] block">
            Crafted with Purity & Care
          </span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-[#D4AF37]/35 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase">
            <History className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Four Decades of Agra Tradition • Est. 1985</span>
          </div>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7EE] leading-tight">
          The Story of <span className="gold-gradient-text font-serif italic">Pure Spices & Dry Fruits</span>
        </h2>
        
        <p className="font-editorial italic text-lg sm:text-xl text-[#DFDACD] max-w-2xl mx-auto">
          "Purity is not a shortcut; it is our family's promise to your kitchen for over forty years in Agra."
        </p>
      </div>

      {/* Dual Story Column: Founder Legacy + Core Values */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
        
        {/* Left: Atmospheric Heritage Card with Logo */}
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl p-8 sm:p-10 glass-card-futuristic border border-[#D4AF37]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center space-y-6">
            {/* Ambient gold glow */}
            <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FFF6D6] to-[#C59F2D] shadow-[0_0_35px_rgba(212,175,55,0.4)] flex items-center justify-center bg-[#12121A]">
              <img
                src="/images/logo.png"
                alt="Araj Logo 1985"
                className="w-28 h-28 object-contain p-2 rounded-full"
              />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
                Official Royal Seal of Authenticity
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                {BRAND_INFO.name}
              </h3>
              <p className="text-xs text-[#A6A295] tracking-widest uppercase font-mono">
                {BRAND_INFO.motto}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs sm:text-sm text-[#DFDACD] leading-relaxed font-editorial italic">
              "When you prepare meals for your family, purity is not a preference—it is a sacred trust. Since 1985, every spice grain and hand-graded nut bearing the Araj seal has honored that royal truth."
            </div>

            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-[#D4AF37] font-mono">
              <span>Agra</span> • <span>Rawatpara Heritage Mill</span> • <span>India</span>
            </div>

            {/* Direct Laboratory Verification CTA */}
            <button
              onClick={() => openScanner()}
              className="w-full py-3 rounded-2xl bg-white/[0.05] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono text-[#F5DE88] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#D4AF37]" />
              <span>Verify Batch Spectrometry</span>
            </button>
          </div>
        </div>

        {/* Right: Narrative Details */}
        <div className="lg:col-span-7 space-y-6 text-[#DFDACD]">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" /> Three Generations of Agra Heritage
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#FAF7EE] leading-snug">
            Preserving India’s Most Aromatic Terroir Against Industrial Dilution
          </h3>

          <p className="text-sm sm:text-base leading-relaxed text-[#B8B4A8] font-light">
            Founded in the shadows of the timeless architectural monuments of Agra in 1985, Araj began with a singular obsession: to rescue the sublime majesty of North Indian masalas and dry fruits from high-heat industrial grinders and synthetic colorants.
          </p>

          <p className="text-sm sm:text-base leading-relaxed text-[#B8B4A8] font-light">
            Rather than relying on modern high-friction mills that boil away fragile volatile terpenes, Araj championed traditional cold stone-ground milling. Every batch of our celebrated <strong className="text-[#FAF7EE]">Chana Masala</strong>, <strong className="text-[#FAF7EE]">Chatpata Chat Masala</strong>, and <strong className="text-[#FAF7EE]">Golden Haldi</strong> preserves the high-curcumin oils and rich pungent ethers revered by culinary royal masters.
          </p>

          {/* 3 Pillar Micro Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl glass-card-futuristic space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-sm text-[#FAF7EE]">100% Pure</h4>
              <p className="text-[11px] text-[#A6A295]">Zero starches, chalk, or artificial colors.</p>
            </div>

            <div className="p-4 rounded-2xl glass-card-futuristic space-y-1">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-sm text-[#FAF7EE]">Cryo-Stone Milled</h4>
              <p className="text-[11px] text-[#A6A295]">Natural essential oils locked below 32°C.</p>
            </div>

            <div className="p-4 rounded-2xl glass-card-futuristic space-y-1">
              <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-serif font-bold text-sm text-[#FAF7EE]">Selected Harvest</h4>
              <p className="text-[11px] text-[#A6A295]">Only hand-graded kernel integrity.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Glass Timeline */}
      <div className="mb-24">
        <div className="text-center mb-12 space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-mono block">
            Four Decades of Chronological Excellence
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
            Milestones of Royal Trust
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIMELINE_MILESTONES.map((m, index) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="rounded-3xl p-6 glass-card-futuristic hover:border-[#D4AF37]/60 transition-all duration-300 relative space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-bold gold-gradient-text">
                  {m.year}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#D4AF37] text-[10px] font-mono tracking-wider uppercase border border-[#D4AF37]/20">
                  {m.badge}
                </span>
              </div>
              <h4 className="font-serif text-lg font-bold text-[#FAF7EE] group-hover:text-[#F5DE88] transition-colors">
                {m.title}
              </h4>
              <p className="text-xs text-[#B8B4A8] leading-relaxed">
                {m.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metric Achievements Section with Ultra Glass Finish */}
      <div className="rounded-3xl glass-card-futuristic p-8 sm:p-12 border border-[#D4AF37]/30 shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {ACHIEVEMENTS.map((item, idx) => (
            <div key={item.label} className={`space-y-1 ${idx > 0 ? 'pt-6 sm:pt-0 sm:pl-6' : ''}`}>
              <div className="font-serif text-3xl sm:text-5xl font-extrabold gold-gradient-text">
                {item.value}
              </div>
              <div className="font-serif text-base sm:text-lg font-bold text-[#FAF7EE]">
                {item.label}
              </div>
              <div className="text-xs text-[#A6A295] max-w-[180px] mx-auto font-mono">
                {item.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
