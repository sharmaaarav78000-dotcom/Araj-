import React, { useState } from 'react';
import { 
  ShieldCheck, Phone, Mail, MapPin, Sparkles, Send, 
  ArrowUp, Award, Leaf, Heart 
} from 'lucide-react';
import { BRAND_INFO } from '../data/brand';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveCategory, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to the Araj Royal Gazette!');
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#08080C] border-t border-[#D4AF37]/25 text-[#A6A295] pt-16 pb-12 overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Brand Highlights Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-white/10">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Since 1985</h4>
              <p className="text-[11px] text-[#A6A295]">Four decades of heritage spice excellence</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">100% Pure</h4>
              <p className="text-[11px] text-[#A6A295]">Zero artificial colors, fillers or additives</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">Stone Ground</h4>
              <p className="text-[11px] text-[#A6A295]">Low-temperature milled to preserve aroma</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">FSSAI Certified</h4>
              <p className="text-[11px] text-[#A6A295]">Rigorous quality audits and purity tests</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D1F] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center">
                  <span className="font-cinzel text-lg font-bold text-[#D4AF37]">A</span>
                </div>
              </div>
              <div>
                <span className="font-cinzel text-xl font-bold tracking-widest text-[#FAF7EE] block">
                  ARAJ
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]">
                  Dry Fruits & Spices
                </span>
              </div>
            </div>

            <p className="text-xs text-[#B8B4A8] leading-relaxed max-w-sm">
              Established in 1985 in the historic mercantile district of Rawatpara, Agra. 
              We curate the purest grade of Indian culinary spices and hand-picked international dry fruits 
              crafted for connoisseurs of authentic gastronomy.
            </p>

            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-center gap-2.5 text-[#DFDACD]">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{BRAND_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#DFDACD]">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{BRAND_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#DFDACD]">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-[11px]">{BRAND_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#FAF7EE] tracking-wider uppercase">
              Collections
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('ALL');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  All Grand Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('SPICES');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Authentic Spices
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('DRY FRUITS');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Gourmet Dry Fruits
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveCategory('GIFT PACKS');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Festive Gift Boxes
                </button>
              </li>
              <li>
                <a
                  href="#heritage"
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Our 1985 Heritage
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#FAF7EE] tracking-wider uppercase">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Shipping & Express Transit
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Replacement & Purity Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Corporate & Wedding Gifting
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Lab Certification & FSSAI
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">
                  Bulk & Culinary Wholesale
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif text-sm font-bold text-[#FAF7EE] tracking-wider uppercase">
              The Araj Royal Gazette
            </h3>
            <p className="text-xs text-[#B8B4A8]">
              Receive private notifications for seasonal harvest arrivals, single-origin saffron releases, and festive gifting curations.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-[#151520] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-[#FAF7EE] placeholder-[#88847A] focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#0A0A0E] hover:brightness-110 transition-all shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[10px] text-[#88847A] block">
                Zero spam. Pure culinary heritage and royal festive offers only.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom Credits & Up button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-[#88847A]">
            <span>© {new Date().getFullYear()} ARAJ Dry Fruits & Spices. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
            <span>for authentic Indian gastronomy.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#88847A] text-[11px]">Official Reference: arajpure.com</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/40 text-[#DFDACD] hover:text-[#D4AF37] transition-all flex items-center gap-1.5 text-xs"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
