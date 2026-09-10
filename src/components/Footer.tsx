import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Award, 
  ArrowUp, 
  Cpu, 
  Gift, 
  Bot, 
  Smartphone, 
  Heart,
  Truck,
  RotateCcw,
  CheckCircle2,
  Building2,
  ChefHat
} from 'lucide-react';
import { BRAND_INFO } from '../data/brand';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { 
    openScanner, 
    openHamper, 
    openAiChat, 
    openInstallModal, 
    openPhonePreview, 
    openDistributorModal,
    setActiveCategory 
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (sectionId: string, category?: string) => {
    if (category) {
      setActiveCategory(category as any);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-[#050508] border-t border-[#D4AF37]/25 text-[#FAF7EE] pt-16 pb-12 overflow-hidden">
      {/* Ambient background gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial from-[#D4AF37]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl glass-panel-subtle border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FAF7EE]">100% Pure &amp; Natural</p>
              <p className="text-[10px] text-[#A6A295]">Zero starch, fillers or colors</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl glass-panel-subtle border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FAF7EE]">Since 1985 Legacy</p>
              <p className="text-[10px] text-[#A6A295]">Agra stone-grinding tradition</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl glass-panel-subtle border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FAF7EE]">Pan-India Express</p>
              <p className="text-[10px] text-[#A6A295]">Nitrogen-sealed freshness</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl glass-panel-subtle border border-white/5">
            <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FAF7EE]">FSSAI Certified</p>
              <p className="text-[10px] text-[#A6A295]">Lic. 12723001000845</p>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
              <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] to-[#F5DE88] shadow-md overflow-hidden flex items-center justify-center bg-[#15151F]">
                <img
                  src="/images/logo.png"
                  alt="ARAJ Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-display tracking-[0.2em] text-xl font-bold gold-gradient-text uppercase block leading-tight">
                  ARAJ
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/90 font-medium">
                  Dry Fruits &amp; Spices • Est. 1985
                </span>
              </div>
            </div>

            <p className="text-xs text-[#B8B4A8] leading-relaxed font-light">
              {BRAND_INFO.description}
            </p>

            {/* Android App Quick Badge */}
            <div className="pt-2">
              <button
                onClick={openInstallModal}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/25 to-[#FAF7EE]/10 border border-[#D4AF37]/40 text-[#FAF7EE] text-xs font-bold hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                <div className="text-left">
                  <div className="text-[10px] text-[#D4AF37] leading-none uppercase tracking-wider">Download</div>
                  <div className="text-xs font-bold text-[#FAF7EE]">ARAJ Android App</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Categories Col */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-[#B8B4A8]">
              <li>
                <button
                  onClick={() => navigateTo('catalog', 'GROUND SPICES')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Ground Spices (पिसे मसाले)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', 'BLENDED SPICES')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Blended Masale (मिक्स मसाले)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', 'DRY FRUITS')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Royal Dry Fruits (काजू-बादाम)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('chef-kitchen')}
                  className="hover:text-[#FAF7EE] transition-colors flex items-center gap-1 text-[#F5DE88]"
                >
                  <ChefHat className="w-3 h-3 text-[#D4AF37]" />
                  <span>Chef Recipes &amp; Pairings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', 'GIFT PACKS')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Festive Gift Packs &amp; Boxes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog', 'SEEDS')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Organic Super Seeds
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Royal Atelier Col */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Heritage &amp; B2B
            </h3>
            <ul className="space-y-2.5 text-xs text-[#B8B4A8]">
              <li>
                <button
                  onClick={openDistributorModal}
                  className="flex items-center gap-2 text-[#F5DE88] hover:text-[#FFF] font-semibold transition-colors text-left"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>B2B Dealership &amp; Wholesale</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('quality-promise')}
                  className="flex items-center gap-2 hover:text-[#FAF7EE] transition-colors text-left"
                >
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Quality Assurance &amp; AGMARK</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openScanner()}
                  className="flex items-center gap-2 hover:text-[#FAF7EE] transition-colors text-left"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Laboratory Purity Scanner</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openHamper}
                  className="flex items-center gap-2 hover:text-[#FAF7EE] transition-colors text-left"
                >
                  <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bespoke Hamper Atelier</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openAiChat}
                  className="flex items-center gap-2 hover:text-[#FAF7EE] transition-colors text-left"
                >
                  <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>AI Royal Spicer &amp; Sommelier</span>
                </button>
              </li>
              <li>
                <button
                  onClick={openPhonePreview}
                  className="flex items-center gap-2 text-[#D4AF37] hover:text-[#FFF] transition-colors text-left font-medium"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Phone View Simulator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('story')}
                  className="hover:text-[#FAF7EE] transition-colors"
                >
                  Our 1985 Agra Mill Story
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Store Location Col */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
              Heritage Mill &amp; Dispatch
            </h3>
            <div className="space-y-2.5 text-xs text-[#B8B4A8]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{BRAND_INFO.address}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${BRAND_INFO.phone.split('/')[0].trim()}`} className="hover:text-[#FAF7EE]">
                  {BRAND_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${BRAND_INFO.whatsappNumber}?text=Hello%20Araj%20Dry%20Fruits%20%26%20Spices%2C%20I%20would%20like%20to%20inquire%20about%20your%20products.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FAF7EE]"
                >
                  WhatsApp: {BRAND_INFO.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-[#FAF7EE] truncate">
                  {BRAND_INFO.email}
                </a>
              </div>
            </div>

            {/* Newsletter Input */}
            <div className="pt-2">
              <p className="text-[11px] text-[#A6A295] mb-2 font-medium">Join our Royal Privilege Club for harvest updates:</p>
              <form onSubmit={handleSubscribe} className="flex gap-1.5">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#FAF7EE] placeholder:text-[#88847A] focus:outline-none focus:border-[#D4AF37] flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#050508] font-bold text-xs hover:bg-[#F5DE88] transition-colors shrink-0 cursor-pointer"
                >
                  Join
                </button>
              </form>
              {subscribed && (
                <p className="text-[10px] text-[#48BB78] mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Welcome to the ARAJ Connoisseur circle!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#88847A]">
          <div className="flex items-center gap-2">
            <span>© 1985 – {new Date().getFullYear()} {BRAND_INFO.name}. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-devanagari text-xs text-[#D4AF37]/90 font-medium">
              शुद्धता ही हमारी पहचान है
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 px-3 py-1 rounded-full glass-panel-subtle hover:text-[#FAF7EE] hover:border-[#D4AF37]/40 transition-all cursor-pointer"
              title="Back to Top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
