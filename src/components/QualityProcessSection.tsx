import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Leaf, 
  Award, 
  Factory, 
  CheckCircle2, 
  Layers,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { BRAND_INFO } from '../data/brand';
import { useStore } from '../context/StoreContext';

export const QualityProcessSection: React.FC = () => {
  const { openDistributorModal, openScanner } = useStore();

  const PILLARS = [
    {
      num: '01',
      title: 'Direct Origin Whole Crops',
      hindi: 'उत्कृष्ट साबुत फसलों का चयन',
      desc: 'No third-party powdered fillers. We inspect whole stems and pods directly from dedicated agrarian belts—Guntur chillies, Saurashtra coriander seeds, and Malabar peppercorns.',
      icon: Leaf,
      badge: 'Zero Adulteration'
    },
    {
      num: '02',
      title: 'Slow Cold-Stone Milled',
      hindi: 'पारंपरिक धीमी व शीतल पिसाई',
      desc: 'High-speed industrial crushers generate extreme heat that destroys natural volatile oils. Our slow, temperature-controlled stone grinding seals in delicate terpenes and vivid color.',
      icon: Flame,
      badge: 'Preserved Terpenes'
    },
    {
      num: '03',
      title: 'AGMARK & FSSAI Certified',
      hindi: 'कड़े प्रयोगशाला गुणवत्ता मानक',
      desc: 'Batch-tested for zero synthetic coloring agents (no Metanil Yellow, Sudan I-IV), zero starch bulking, and zero artificial moisture. Pure, honest spice as nature intended.',
      icon: Award,
      badge: 'Govt. Grade A'
    },
    {
      num: '04',
      title: 'Aroma-Lock Nitrogen Seal',
      hindi: 'ऑटोमैटिक एरोमा-लॉक पैकिंग',
      desc: 'Untouched by human hands from grinding to sealing. Packaged in multi-layer moisture and UV-barrier pouches flushed with food-grade nitrogen to preserve farm freshness.',
      icon: Factory,
      badge: '100% Freshness Lock'
    }
  ];

  return (
    <section id="quality-process" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[150px] pointer-events-none" />

      {/* Header matching Munshi Panna Masale reference */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{BRAND_INFO.qualityPromise}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE] leading-tight">
          शुद्धता और स्वाद की 4 कसौटियाँ <br />
          <span className="gold-gradient-text font-serif italic">The 4 Pillars of Agra Spice Craft</span>
        </h2>

        <p className="text-sm sm:text-base text-[#DFDACD] max-w-2xl mx-auto leading-relaxed">
          From Agra’s historic spice mills to thousands of homes across the nation, we honor the sacred pact of purity. Discover why master chefs, halwais, and families trust ARAJ daily.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.num}
              className="rounded-3xl p-6 sm:p-7 bg-[#12121B]/90 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 relative group overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-bl-full pointer-events-none group-hover:bg-[#D4AF37]/15 transition-colors" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-mono text-2xl font-bold text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors">
                    {pillar.num}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#F5DE88]">
                    {pillar.badge}
                  </span>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-lg font-bold text-[#FAF7EE] mb-1">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-[#D4AF37] font-hindi mb-3">
                  {pillar.hindi}
                </p>

                <p className="text-xs sm:text-sm text-[#B8B4A8] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-[#A6A295] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#48BB78]" />
                <span>Zero Starch • Zero Dyes</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* B2B / Distributorship Banner inside Quality Section */}
      <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-[#171724] via-[#1F1D2C] to-[#171724] border border-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
            <HeartHandshake className="w-4 h-4" />
            <span>Join Our Growing Pan-India Network</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Looking for Bulk Supplies or Dealership in Your District?
          </h3>
          <p className="text-xs sm:text-sm text-[#DFDACD] max-w-xl">
            We provide wholesale supply to retail stores, supermarkets, wedding caterers, and regional distributors with direct factory margins and marketing support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={openDistributorModal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E69C36] hover:from-[#E69C36] hover:to-[#D4AF37] text-[#0E0E14] text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Apply for Dealership</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => openScanner()}
            className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 text-white text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Verify Batch Purity</span>
          </button>
        </div>
      </div>
    </section>
  );
};
