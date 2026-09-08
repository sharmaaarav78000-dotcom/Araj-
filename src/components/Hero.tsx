import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Award, Leaf, Star, Flame, Cpu, Gift, Bot } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

const HERO_PRODUCTS = [
  {
    id: 'SPC-3',
    name: 'Chana Masala',
    tagline: 'Stone Ground • Royal Punjabi Blend',
    weight: '100g',
    price: 80,
    originalPrice: 160,
    image: '/images/products-spices/chana-masala.png',
    accentColor: '#E69C36',
    notes: 'Authentic stone-ground whole spices with zero artificial preservatives',
  },
  {
    id: 'SPC-4',
    name: 'Haldi (Turmeric Powder)',
    tagline: 'High Curcumin • Pure Golden Harvest',
    weight: '500g',
    price: 130,
    originalPrice: 260,
    image: '/images/products-spices/turmeric-powder.jpg',
    accentColor: '#FFB800',
    notes: 'Pure vibrant turmeric for healing nutrition and royal golden color',
  },
  {
    id: 'DF-3',
    name: 'Badam Migi (Selected Almonds)',
    tagline: 'Jumbo Size • Rich in Vitamin E',
    weight: '250g',
    price: 249,
    originalPrice: 499,
    image: '/images/products-df/almonds-badam.png',
    accentColor: '#D4AF37',
    notes: '100% natural, crisp California almonds hand-selected in Agra',
  },
  {
    id: 'DF-1',
    name: 'Premium Cashews (Kaju)',
    tagline: 'W240 Jumbo • Creamy & Sweet',
    weight: '250g',
    price: 299,
    originalPrice: 599,
    image: '/images/products-df/cashews-kaju.png',
    accentColor: '#EAD7B0',
    notes: 'Naturally whole, uniform cashew kernels with velvety crunch',
  },
  {
    id: 'GIFT-1',
    name: 'Premium Gifting Dryfruits Box',
    tagline: 'Royal Indian Festive Collection',
    weight: '1kg',
    price: 825,
    originalPrice: 1650,
    image: '/images/products-gifting/premium-gifting-dryfruits-box.png',
    accentColor: '#D4AF37',
    notes: 'Curated 4-compartment luxury keepsake box with gold foiling',
  }
];

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExplore }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { addToCart, openProductDetail, products, openScanner, openHamper, openAiChat } = useStore();

  const currentHero = HERO_PRODUCTS[selectedIdx];

  // Subtle mouse tracking for cinematic parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  // Auto rotate hero product every 8 seconds if idle
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedIdx((prev) => (prev + 1) % HERO_PRODUCTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroAddToCart = () => {
    const prod = products.find((p) => p.name.toLowerCase().includes(currentHero.name.toLowerCase())) || products[0];
    addToCart(prod, 1);
  };

  const handleHeroQuickView = () => {
    const prod = products.find((p) => p.name.toLowerCase().includes(currentHero.name.toLowerCase())) || products[0];
    openProductDetail(prod);
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden bg-[#070709]"
    >
      {/* Ambient background light gradients */}
      <div 
        className="absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[140px] pointer-events-none opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.35) 0%, rgba(184,139,42,0.15) 50%, transparent 80%)',
          transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      />
      <div 
        className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(229,193,88,0.3) 0%, rgba(20,18,14,0.1) 70%, transparent 100%)'
        }}
      />

      {/* Floating dust particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 19) % 95}%`,
              left: `${(i * 29) % 95}%`,
              opacity: 0.2 + (i % 5) * 0.15,
              filter: 'blur(0.5px)',
              animation: `pulse ${(i % 4) + 3}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand Statement & Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Heritage Script Emblem */}
            <div className="space-y-1">
              <span className="font-script-luxury text-2xl sm:text-3xl text-[#D4AF37] block">
                Pure Tradition from Agra
              </span>
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-panel-gold border border-[#D4AF37]/35 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Pure & Authentic • Trusted Since 1985</span>
              </div>
            </div>

            {/* Main Regal Heading */}
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-[#FAF7EE] leading-[1.08]">
                Araj Pure <span className="gold-gradient-text font-serif italic">Spices</span> & Dry Fruits
              </h1>
              <p className="font-editorial italic text-lg sm:text-2xl font-light text-[#DFDACD] max-w-xl tracking-wide pt-1">
                "Pure taste, natural aroma, and four decades of trusted quality."
              </p>
            </div>

            {/* Editorial Luxury Description */}
            <p className="text-sm sm:text-base text-[#B8B4A8] leading-relaxed max-w-lg font-normal">
              Fresh from our traditional stone mills in Agra straight to your kitchen. We bring you hand-picked crunchy dry fruits, 100% pure stone-ground spices with no artificial colors or preservatives, and custom gift hampers for every celebration.
            </p>

            {/* CTAs with Futuristic Working Triggers */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-shop-now-cta"
                onClick={onShopNow}
                className="group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8CD6D] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 overflow-hidden cursor-pointer"
              >
                <span className="relative z-10">SHOP PURE COLLECTION</span>
                <ArrowRight className="w-4 h-4 text-[#0A0A0E] group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button
                id="hero-scanner-cta"
                onClick={() => openScanner()}
                className="px-5 py-3.5 rounded-full glass-panel border border-[#D4AF37]/40 text-[#FAF7EE] hover:text-[#FFF] hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]"
              >
                <Cpu className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span>Purity Scanner</span>
              </button>

              <button
                id="hero-hamper-cta"
                onClick={openHamper}
                className="px-5 py-3.5 rounded-full glass-pill text-xs sm:text-sm font-medium text-[#DFDACD] hover:text-[#FAF7EE] hover:border-[#D4AF37]/50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-[#D4AF37]" />
                <span>Build Gift Hamper</span>
              </button>

              <button
                id="hero-ai-chat-cta"
                onClick={openAiChat}
                className="px-5 py-3.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/50 text-xs sm:text-sm font-medium text-[#FAF7EE] hover:text-[#FFF] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              >
                <Bot className="w-4 h-4 text-[#D4AF37]" />
                <span>Ask AI Spicer</span>
              </button>
            </div>

            {/* Three Floating Highlights as Requested */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/10 w-full max-w-lg">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Since 1985
                </span>
                <span className="text-sm sm:text-base font-serif font-bold text-[#FAF7EE] mt-0.5">
                  Four Decades
                </span>
                <span className="text-[11px] text-[#A6A295]">Rawatpara, Agra</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Certified
                </span>
                <span className="text-sm sm:text-base font-serif font-bold text-[#FAF7EE] mt-0.5">
                  Zero Adulteration
                </span>
                <span className="text-[11px] text-[#A6A295]">No Artificial Colors</span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> Stone Ground
                </span>
                <span className="text-sm sm:text-base font-serif font-bold text-[#FAF7EE] mt-0.5">
                  Natural Aroma
                </span>
                <span className="text-[11px] text-[#A6A295]">Essential Oils Intact</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Showcase Card with Real Packaging */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Product Switcher Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full glass-panel border border-[#D4AF37]/25 mb-4 z-20 overflow-x-auto max-w-full">
              {HERO_PRODUCTS.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedIdx === idx
                      ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow-md'
                      : 'text-[#DFDACD] hover:text-[#FFF] hover:bg-white/5'
                  }`}
                >
                  {prod.name.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Cinematic Glass Showcase Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transform: `perspective(1000px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
                  transition: 'transform 0.2s ease-out'
                }}
                className="relative w-full max-w-[420px] rounded-3xl p-6 sm:p-8 glass-panel-gold border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden group"
              >
                {/* Metallic light sheen sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                {/* Floating Discount Pill */}
                <div className="absolute top-5 left-5 z-20 px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#0A0A0E] fill-current" />
                  50% OFF
                </div>

                {/* Pack Size Badge */}
                <div className="absolute top-5 right-5 z-20 px-3 py-1 rounded-full glass-panel border border-white/20 text-[#FAF7EE] text-xs font-medium tracking-wide">
                  Pack: {currentHero.weight}
                </div>

                {/* Hero Product Packaging (Rendered large and pristine) */}
                <div className="relative w-full h-72 sm:h-80 flex items-center justify-center my-2">
                  {/* Circular halo glow */}
                  <div
                    className="absolute w-56 h-56 rounded-full blur-2xl opacity-40 transition-colors duration-500"
                    style={{ backgroundColor: currentHero.accentColor }}
                  />
                  
                  {/* Authentic Product Image */}
                  <img
                    src={currentHero.image}
                    alt={currentHero.name}
                    className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Information */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                      {currentHero.tagline}
                    </span>
                    <div className="flex items-center gap-1 text-[#F5DE88] text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#F5DE88] text-[#F5DE88]" />
                      4.9 (Verified)
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#FAF7EE] tracking-tight">
                    {currentHero.name}
                  </h3>

                  <p className="text-xs text-[#A6A295] line-clamp-1">
                    {currentHero.notes}
                  </p>

                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                      ₹{currentHero.price}
                    </span>
                    <span className="text-sm sm:text-base text-[#88847A] line-through">
                      MRP ₹{currentHero.originalPrice}
                    </span>
                    <span className="text-xs font-semibold text-[#68D391]">
                      Save ₹{currentHero.originalPrice - currentHero.price}
                    </span>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <button
                      onClick={handleHeroAddToCart}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md transition-all duration-200"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={handleHeroQuickView}
                      className="w-full py-2.5 rounded-xl glass-panel border border-[#D4AF37]/35 text-[#FAF7EE] hover:text-[#FFF] hover:bg-white/5 font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                    >
                      DETAILS
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
