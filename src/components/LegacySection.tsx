import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, History, Award, ShieldCheck, HeartHandshake, Compass, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LegacySection: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleExplore = (cat: string) => {
    setActiveCategory(cat as any);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="legacy" 
      className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#D4AF37]/12 to-transparent blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-radial from-[#B8860B]/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Main Section Header */}
      <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel-gold border border-[#D4AF37]/40 text-[#F5DE88] text-xs font-semibold tracking-widest uppercase shadow-sm"
        >
          <History className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>ESTABLISHED 1985 • FOUR DECADES OF HERITAGE</span>
        </motion.div>

        {/* # OUR LEGACY SINCE 1985 */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7EE] leading-tight"
        >
          OUR LEGACY <span className="gold-gradient-text font-serif italic">SINCE 1985</span>
        </motion.h2>

        {/* ### A Heritage of Distinction. A Pursuit of Exceptional Taste. */}
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-editorial italic text-xl sm:text-2xl lg:text-3xl text-[#D4AF37] max-w-3xl mx-auto"
        >
          A Heritage of Distinction. A Pursuit of Exceptional Taste.
        </motion.h3>

        {/* Decorative Golden Line Divider */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch mb-16">
        
        {/* Left Column: Founder & Seal Commemorative Plaque */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 flex flex-col"
        >
          <div className="h-full rounded-3xl p-8 sm:p-10 glass-card-futuristic border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between space-y-8">
            
            {/* Top Emblem */}
            <div className="text-center space-y-5">
              <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FFF6D6] to-[#C59F2D] shadow-[0_0_40px_rgba(212,175,55,0.45)] flex items-center justify-center bg-[#12121A]">
                <img
                  src="/images/logo.png"
                  alt="ARAJ Dry Fruits & Spices Logo"
                  className="w-28 h-28 object-contain p-2 rounded-full"
                />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block mb-1">
                  Founder &amp; Visionary
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                  M.D. Ankur Sharma
                </h4>
                <p className="text-xs text-[#A6A295] tracking-widest uppercase font-mono mt-1">
                  Founder • ARAJ Dry Fruits &amp; Spices
                </p>
              </div>
            </div>

            {/* Founder Vision Block */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/25 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#F5DE88] uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>The Founding Vision</span>
              </div>
              <p className="text-xs sm:text-sm text-[#DFDACD] leading-relaxed">
                Founded by <strong className="text-[#FAF7EE] font-semibold">M.D. Ankur Sharma</strong>, ARAJ was established with a vision to bring the finest dry fruits and spices to discerning households — products distinguished not merely by their richness, but by their <strong className="text-[#F5DE88]">provenance, authenticity, and exceptional quality</strong>.
              </p>
            </div>

            {/* Seal & Heritage Motto */}
            <div className="pt-4 border-t border-white/10 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#D4AF37] font-mono">
                <span>Agra</span> • <span>Four Decades</span> • <span>Since 1985</span>
              </div>
              <p className="text-[11px] text-[#A6A295] font-light">
                Registered Trade Mark &amp; AGMARK Standard Guaranteed
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: The Four Decades Chronicle & Pillars */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col justify-between space-y-6 text-[#DFDACD]"
        >
          {/* Paragraph 1 */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-[#D4AF37]/30 transition-all">
            <p className="text-base sm:text-lg leading-relaxed text-[#FAF7EE]">
              Since 1985, our family has carried forward a philosophy rooted in a simple yet profound belief: <strong className="text-[#F5DE88] font-semibold">true excellence begins with uncompromising purity and discerning selection.</strong>
            </p>
          </div>

          {/* 4 Pillars Grid (careful sourcing, meticulous selection, uncompromising standards, profound respect) */}
          <div className="space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-[#DFDACD]">
              For more than four decades, we have remained devoted to the principles upon which our legacy was built:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#D4AF37]/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Careful Sourcing</h5>
                  <p className="text-xs text-[#A6A295] mt-0.5">Handpicked at origin for authentic terroir</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#D4AF37]/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Meticulous Selection</h5>
                  <p className="text-xs text-[#A6A295] mt-0.5">Triple-graded for bold calibre and perfection</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#D4AF37]/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Uncompromising Standards</h5>
                  <p className="text-xs text-[#A6A295] mt-0.5">Zero additives, artificial starch or colorants</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-[#D4AF37]/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Respect for Nature</h5>
                  <p className="text-xs text-[#A6A295] mt-0.5">Protecting natural essential oils &amp; vitality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Paragraph 4: Ingredients Showcase */}
          <div className="p-5 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/25 space-y-3">
            <p className="text-sm sm:text-base leading-relaxed text-[#DFDACD]">
              From premium almonds and cashews to exquisite pistachios, raisins, foxnuts, and an evocative collection of aromatic spices, every ARAJ product is chosen with an exacting eye for <strong className="text-[#FAF7EE]">quality, freshness, character, and purity</strong>.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button 
                onClick={() => handleExplore('DRY FRUITS')}
                className="px-3 py-1 rounded-lg bg-black/40 border border-[#D4AF37]/30 text-xs font-mono text-[#F5DE88] hover:border-[#F5DE88] transition-all cursor-pointer"
              >
                Explore Dry Fruits →
              </button>
              <button 
                onClick={() => handleExplore('SPICES')}
                className="px-3 py-1 rounded-lg bg-black/40 border border-[#D4AF37]/30 text-xs font-mono text-[#F5DE88] hover:border-[#F5DE88] transition-all cursor-pointer"
              >
                Explore Pure Spices →
              </button>
            </div>
          </div>

          {/* Callout Quote: We do not believe that excellence should be hurried */}
          <div className="p-6 rounded-2xl glass-card-futuristic border-l-4 border-l-[#D4AF37] border-y border-r border-white/10 shadow-lg">
            <p className="font-editorial italic text-lg sm:text-xl text-[#FAF7EE] leading-relaxed">
              "We do not believe that excellence should be hurried. <br />
              We believe it should be <span className="text-[#F5DE88] font-serif font-bold">cultivated, protected, and perfected over time.</span>"
            </p>
          </div>

          {/* Across generations... */}
          <p className="text-sm sm:text-base leading-relaxed text-[#B8B4A8]">
            Across generations, our commitment has remained unwavering — to preserve the authentic character of every ingredient and deliver nothing less than an experience worthy of the ARĀJ name.
          </p>

          {/* What began in 1985 as a family vision... */}
          <p className="text-sm sm:text-base leading-relaxed text-[#DFDACD]">
            What began in 1985 as a family vision has grown into a legacy built upon <strong className="text-[#FAF7EE]">trust, refinement, and an enduring devotion to exceptional food.</strong>
          </p>
        </motion.div>
      </div>

      {/* Grand Bottom Emblem Banner: ARAJ Dry Fruits & Spices • Four Decades of Heritage */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-12 glass-panel-gold border border-[#D4AF37]/45 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-[#FAF7EE]/5 to-[#D4AF37]/10 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>The Gold Standard</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FAF7EE] tracking-tight">
            ARAJ Dry Fruits &amp; Spices
          </h3>

          <p className="font-editorial italic text-lg sm:text-xl text-[#F5DE88] font-semibold pt-1">
            Four Decades of Heritage. A Standard of Excellence.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono text-[#DFDACD]">
            <span>Est. 1985</span>
            <span>•</span>
            <span>Agra, India</span>
            <span>•</span>
            <span>Uncompromising Purity</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
