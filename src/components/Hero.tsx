import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Star, 
  ShoppingBag, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Flame,
  ChefHat,
  Building2,
  Pause,
  Play,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { MagneticButton } from './MagneticButton';
import { triggerParticleBurst } from '../utils/effects';
import { playLuxuryChime } from '../utils/sound';
import { FloatingBadam, FloatingCashew, FloatingPista, FloatingKishmish } from './FloatingDryFruits';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExplore }) => {
  const { products, addToCart, openProductDetail, openDistributorModal, setActiveCategory } = useStore();

  // Curated product lookups
  const haldiProduct = products.find((p) => p.id === 'SPC-4' || p.name.toLowerCase().includes('haldi')) || products[0];
  const mirchProduct = products.find((p) => p.id === 'SPC-48' || p.name.toLowerCase().includes('lal mirch')) || products[1];
  const dhaniyaProduct = products.find((p) => p.id === 'SPC-2' || p.name.toLowerCase().includes('dhaniya')) || products[2];
  const kashmiriProduct = products.find((p) => p.id === 'SPC-12' || p.name.toLowerCase().includes('kashmiri')) || mirchProduct;
  const chanaProduct = products.find((p) => p.id === 'SPC-3' || p.name.toLowerCase().includes('chana')) || products[3];
  const garamProduct = products.find((p) => p.id === 'SPC-6' || p.name.toLowerCase().includes('garam')) || products[4];

  // Dry Fruit Product Lookups
  const badamProduct = products.find((p) => p.id === 'DF-42' || p.name.toLowerCase().includes('badam') || p.name.toLowerCase().includes('almond')) || products[0];
  const cashewProduct = products.find((p) => p.id === 'DF-40' || p.name.toLowerCase().includes('cashew') || p.name.toLowerCase().includes('kaju')) || products[1];
  const pistaProduct = products.find((p) => p.id === 'DF-41' || p.name.toLowerCase().includes('pista') || p.name.toLowerCase().includes('pistachio')) || products[2];
  const kishmishProduct = products.find((p) => p.id === 'DF-46' || p.name.toLowerCase().includes('kishmish') || p.name.toLowerCase().includes('raisin')) || products[3];
  const giftBoxProduct = products.find((p) => p.id === 'GIFT-19' || p.name.toLowerCase().includes('gifting') || p.category === 'gifting') || badamProduct;

  const [selectedDryFruitId, setSelectedDryFruitId] = useState<string>(badamProduct?.id || 'DF-42');
  const selectedDryFruitProduct = products.find((p) => p.id === selectedDryFruitId) || badamProduct;

  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 6000; // 6 seconds per slide
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: 'royal-dry-fruits',
      badge: '100% ROYAL SELECTION • AGRA SHAHI MEWE',
      headingLine1: 'Royal Dry Fruits,',
      headingLine2: 'Rich & Handpicked',
      isItalicHighlight: true,
      hindiTagline: 'शाही मेवों की अनूठी मिठास — शुद्धता, स्वाद और सेहत का शाही वरदान',
      description: 'Hand-selected AAA Jumbo California Almonds, Mangalorean Cashews, Afghani Kishmish & Persian Pistachios. Triple-sorted and vacuum nitrogen-sealed to retain signature crunch, essential omega fatty acids, and orchard-fresh vitality.',
      ctaCategory: 'DRY FRUITS',
      features: [
        { label: 'AAA+ Jumbo Size Handpicked', icon: 'check' },
        { label: '100% Natural Crunch', icon: 'check' },
        { label: 'Vacuum Sealed Crisp Freshness', icon: 'award' },
      ],
      type: 'dryfruits',
    },
    {
      id: 'ground-spices-trio',
      badge: '100% PURE AGRA HERITAGE • ESTD. 1985',
      headingLine1: 'Spice Manufacturers,',
      headingLine2: 'in India',
      isItalicHighlight: false,
      hindiTagline: 'शुद्धता और स्वाद का अटूट विश्वास — Zero Compromise on Quality',
      description: 'Slow low-temperature stone grinding that locks in precious natural volatile essential oils, therapeutic curcumin, and regal culinary aromas. 100% AGMARK certified with zero starch and zero artificial colors.',
      ctaCategory: 'GROUND SPICES',
      features: [
        { label: 'No Artificial Colours', icon: 'check' },
        { label: 'No Preservatives', icon: 'check' },
        { label: '100% AGMARK Pure', icon: 'award' },
      ],
      type: 'trio',
    },
    {
      id: 'kashmiri-mirch-special',
      badge: 'GREAT TASTE • KASHMIRI SPECIAL',
      headingLine1: 'Har pakwan ko',
      headingLine2: 'jo banaye khaas',
      isItalicHighlight: true,
      hindiTagline: 'हर पकवान को जो बनाये ख़ास — गहरा लाल रंग और शाही खुशबू',
      description: 'Hand-picked stemless sun-dried Kashmiri chillies ground with traditional Agra precision. Imparts an irresistible royal crimson glow and gentle aromatic warmth to every curry, dal, and samosa platter.',
      ctaCategory: 'SPICES',
      features: [
        { label: 'Rich Natural Crimson Colour', icon: 'check' },
        { label: 'Low Pungency & High Aroma', icon: 'check' },
        { label: 'Stemless Dried Kashmiri Chillies', icon: 'award' },
      ],
      type: 'kashmiri',
    },
    {
      id: 'chef-blends-heritage',
      badge: 'APNE ANDAR KE CHEF KO JAGAO!',
      headingLine1: 'Apne Andar Ke',
      headingLine2: 'Chef Ko Jagao!',
      isItalicHighlight: true,
      hindiTagline: 'मुंशी पन्ना के शाही मसालों के साथ हर घर में रेस्टोरेंट जैसा ज़ायका',
      description: 'Authentic Chana Masala, Garam Masala & Kitchen King, hand-roasted with 24 whole spices in small batches. Paired with jumbo Californian almonds and Kashmiri cashews for royal Shahi gravies.',
      ctaCategory: 'BLENDED SPICES',
      features: [
        { label: '24 Hand-Selected Spices', icon: 'check' },
        { label: 'Retains Volatile Oils', icon: 'check' },
        { label: 'Direct Agra Mill Quality', icon: 'award' },
      ],
      type: 'chef',
    },
  ];

  const totalSlides = slides.length;

  const goToSlide = useCallback((newIdx: number, newDir: number = 1, isUserAction: boolean = false) => {
    setDirection(newDir);
    setCurrentSlide((newIdx + totalSlides) % totalSlides);
    setProgress(0);
    if (isUserAction) {
      playLuxuryChime('sparkle');
    }
  }, [totalSlides]);

  const handleNext = useCallback((isUserAction: boolean = false) => {
    goToSlide(currentSlide + 1, 1, isUserAction);
  }, [currentSlide, goToSlide]);

  const handlePrev = useCallback((isUserAction: boolean = false) => {
    goToSlide(currentSlide - 1, -1, isUserAction);
  }, [currentSlide, goToSlide]);

  // Autoplay and Progress Timer
  useEffect(() => {
    if (isPaused) return;

    const intervalStep = 50;
    const progressIncrement = (intervalStep / SLIDE_DURATION) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + progressIncrement;
        if (next >= 100) {
          return 100;
        }
        return next;
      });
    }, intervalStep);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPaused]);

  // Trigger slide transition when progress reaches 100% in an effect
  useEffect(() => {
    if (progress >= 100) {
      handleNext(false);
    }
  }, [progress, handleNext]);

  // Touch Swipe Support
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      handleNext(true);
    } else if (diff < -50) {
      handlePrev(true);
    }
    touchStartXRef.current = null;
    setIsPaused(false);
  };

  const currentData = slides[currentSlide];

  const handleShopAction = (category: string) => {
    setActiveCategory(category);
    onShopNow();
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>, prod: Product) => {
    e.stopPropagation();
    triggerParticleBurst(e, { type: 'cart', targetCart: true });
    addToCart(prod, 1);
  };

  const scrollToChefKitchen = () => {
    const el = document.getElementById('chef-kitchen');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onExplore();
    }
  };

  // Slide Animation Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section 
      id="hero"
      aria-label="Munshi Panna Heritage Hero Carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden flex flex-col select-none"
    >
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-radial from-[#D4AF37]/20 via-transparent to-transparent blur-[110px] sm:blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-radial from-[#E69C36]/15 via-transparent to-transparent blur-[90px] sm:blur-[130px] pointer-events-none" />

      {/* Main Slider Content Container */}
      <div className="relative min-h-[580px] sm:min-h-[550px] lg:min-h-[560px] flex items-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10"
          >
            {/* Left Column: Headline, Brand Pillars & CTAs */}
            <div className="lg:col-span-6 xl:col-span-7 space-y-5 sm:space-y-6 text-left">
              
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#F5DE88] text-[10px] sm:text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.15)]"
              >
                {currentData.type === 'chef' ? (
                  <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" />
                ) : (
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                )}
                <span>{currentData.badge}</span>
              </motion.div>

              {/* Main Dynamic Headline */}
              <div className="space-y-2 sm:space-y-3">
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="font-serif text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF7EE] leading-[1.1] sm:leading-[1.08]"
                >
                  {currentData.headingLine1} <br />
                  <span className={currentData.isItalicHighlight ? 'gold-gradient-text font-serif italic' : 'text-white/95'}>
                    {currentData.headingLine2}
                  </span>
                </motion.h1>

                {/* Authentic Hindi Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-hindi text-sm sm:text-lg text-[#F5DE88] font-semibold"
                >
                  {currentData.hindiTagline}
                </motion.p>
              </div>

              {/* Description Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-xs sm:text-base text-[#DFDACD] max-w-xl font-light leading-relaxed"
              >
                {currentData.description}
              </motion.p>

              {/* Actions Row with Distinctive Munshi Panna "SHOP NOW" Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 pt-1"
              >
                {/* SHOP NOW Button */}
                <MagneticButton
                  id="hero-slider-shop-btn"
                  onClick={() => handleShopAction(currentData.ctaCategory)}
                  className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E6CA65] to-[#C59F2D] text-[#0A0A0E] font-extrabold text-xs uppercase tracking-widest shadow-[0_8px_30px_rgba(212,175,55,0.45)] hover:shadow-[0_10px_35px_rgba(212,175,55,0.65)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer w-full xs:w-auto"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight className="w-4 h-4 text-[#0A0A0E]" />
                </MagneticButton>

                {/* Secondary Action */}
                <div className="flex items-center gap-2 w-full xs:w-auto">
                  <MagneticButton
                    onClick={scrollToChefKitchen}
                    className="flex-1 xs:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3.5 rounded-full bg-[#161622] hover:bg-[#1E1E2E] border border-[#D4AF37]/50 text-[#FAF7EE] text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  >
                    <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>CHEF RECIPES</span>
                  </MagneticButton>

                  <MagneticButton
                    onClick={openDistributorModal}
                    className="flex-1 xs:flex-initial flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#E69C36]/20 hover:from-[#D4AF37]/35 hover:to-[#E69C36]/35 border border-[#D4AF37]/50 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>B2B DEALERSHIP</span>
                  </MagneticButton>
                </div>
              </motion.div>

              {/* Bullet Points with Checkmarks directly beneath button (Video Style) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-[#FAF7EE] font-medium"
              >
                {currentData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#48BB78]/20 border border-[#48BB78]/60 flex items-center justify-center text-[#48BB78] shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feat.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Dynamic Visual Stage for Each Slide */}
            <div className="lg:col-span-6 xl:col-span-5 flex justify-center items-center relative">
              
              {/* SLIDE 0: Royal Dry Fruits & Nuts with Saffron Kheer, Daily Vitality Bowl & Floating Dry Fruits */}
              {currentData.type === 'dryfruits' && (
                <div className="relative w-full max-w-lg flex flex-col items-center">
                  
                  {/* Radiant Warm Amber & Saffron Sunburst Glow Backdrop */}
                  <div className="absolute -inset-10 bg-radial from-[#D4AF37]/35 via-[#DD6B20]/20 to-transparent rounded-full blur-2xl animate-pulse pointer-events-none" />

                  {/* Floating Realistic Dry Fruit Accents around the showcase */}
                  <FloatingBadam className="-top-6 left-2 w-12 sm:w-16 h-16 sm:h-20 opacity-90 hidden sm:block" rotate={-18} scale={1.05} delay={0.2} duration={5.5} />
                  <FloatingCashew className="-top-8 right-4 w-14 sm:w-18 h-14 sm:h-18 opacity-95 hidden sm:block" rotate={22} scale={1.1} delay={1.0} duration={6.2} />
                  <FloatingPista className="bottom-2 -left-4 w-11 sm:w-14 h-13 sm:h-16 opacity-85 hidden sm:block" rotate={15} scale={1.0} delay={1.8} duration={5.8} />
                  <FloatingKishmish className="bottom-0 -right-2 w-10 sm:w-12 h-10 sm:h-12 opacity-90 hidden sm:block" rotate={-25} scale={1.05} delay={0.6} duration={6.5} />

                  <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
                    
                    {/* Left Pairing Dish: Shahi Kheer & Badam Halwa (Garnished with slivered almonds & pistachios) */}
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="absolute -left-2 sm:left-0 bottom-4 w-32 sm:w-40 h-32 sm:h-40 rounded-full border-2 border-[#D4AF37]/60 overflow-hidden shadow-2xl z-20 group cursor-pointer"
                      onClick={() => openProductDetail(badamProduct)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80"
                        alt="Shahi Kheer & Halwa"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col items-center justify-end p-2">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F5DE88]">Shahi Kheer</span>
                        <span className="text-[9px] text-[#CBD5E0]">Badam &amp; Pista</span>
                      </div>
                    </motion.div>

                    {/* Centerpiece: Royal Dry Fruit Pack (Interactive with Badam / Cashew / Pista / Gift Box) */}
                    <motion.div
                      key={selectedDryFruitProduct.id}
                      initial={{ opacity: 0, y: 25, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      onClick={() => openProductDetail(selectedDryFruitProduct)}
                      className="relative z-30 w-44 sm:w-56 h-64 sm:h-80 rounded-3xl bg-[#14141E] border-2 border-[#D4AF37] p-2.5 shadow-[0_25px_60px_rgba(212,175,55,0.4)] cursor-pointer group"
                    >
                      {/* AAA Royal Crunch Seal Badge */}
                      <div className="absolute -top-3 -right-3 z-40 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border border-white/40">
                        <Sparkles className="w-3 h-3 fill-[#0A0A0E]" />
                        <span>AAA Royal Crunch</span>
                      </div>

                      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white via-[#FFFDF7] to-[#FEFCBF]/60 p-2 overflow-hidden flex items-center justify-center relative">
                        <img
                          src={selectedDryFruitProduct.image}
                          alt={selectedDryFruitProduct.name}
                          className="max-h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Right Pairing Dish: Daily Energy Bowl / Fresh Dry Fruit Platter */}
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="absolute -right-2 sm:right-0 bottom-4 w-32 sm:w-40 h-32 sm:h-40 rounded-full border-2 border-[#D4AF37]/60 overflow-hidden shadow-2xl z-20 group cursor-pointer"
                      onClick={() => openProductDetail(cashewProduct)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400&q=80"
                        alt="Daily Energy Bowl"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col items-center justify-end p-2">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F5DE88]">Daily Vitality</span>
                        <span className="text-[9px] text-[#CBD5E0]">Kaju &amp; Kishmish</span>
                      </div>
                    </motion.div>

                  </div>

                  {/* Interactive Quick-Select Variety Tabs for Dry Fruits */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 z-30">
                    {[
                      { label: 'California Badam', prod: badamProduct },
                      { label: 'Jumbo Kaju', prod: cashewProduct },
                      { label: 'Royal Pista', prod: pistaProduct },
                      { label: 'Shahi Gift Box', prod: giftBoxProduct },
                    ].map((tab) => (
                      <button
                        key={tab.label}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDryFruitId(tab.prod.id);
                          playLuxuryChime('click');
                        }}
                        className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                          selectedDryFruitProduct.id === tab.prod.id
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                            : 'bg-white/10 hover:bg-white/20 text-[#FAF7EE] border border-white/10'
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-[#FAF7EE] font-medium text-center mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block animate-ping" />
                    <span>आगरा के शाही मेवे • 100% प्राकृतिक और क्रंची</span>
                  </p>
                </div>
              )}

              {/* SLIDE 1: Trio of Indian Ground Spices (Haldi, Mirch center, Dhaniya) */}
              {currentData.type === 'trio' && (
                <div className="relative w-full max-w-lg flex flex-col items-center">
                  {/* Glowing warm halo backdrop */}
                  <div className="absolute inset-0 bg-radial from-[#D4AF37]/25 via-transparent to-transparent blur-3xl -z-10" />

                  {/* 3 Spices Packets Showcase Stand */}
                  <div className="relative w-full h-80 sm:h-96 flex items-end justify-center px-2">
                    
                    {/* Left: Haldi Turmeric Packet */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      onClick={() => openProductDetail(haldiProduct)}
                      className="w-1/3 -mr-3 z-10 flex flex-col items-center cursor-pointer group"
                    >
                      <div className="relative w-28 sm:w-36 h-48 sm:h-60 rounded-2xl bg-[#121218]/80 border border-[#ECC94B]/40 p-2 shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-[#ECC94B] transition-transform duration-300">
                        <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#FEFCBF] p-1.5 overflow-hidden flex items-center justify-center">
                          <img
                            src={haldiProduct.image}
                            alt="Haldi Powder"
                            className="max-h-full object-contain filter drop-shadow-md"
                          />
                        </div>
                        <span className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded bg-[#ECC94B] text-[#1A202C] text-[9px] font-black uppercase">
                          Haldi
                        </span>
                      </div>
                      {/* Turmeric Powder Mound & Raw Roots Indicator */}
                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-bold text-[#F6E05E] block">हल्दी पाउडर</span>
                        <span className="text-[9px] text-[#A0AEC0]">Golden Curcumin</span>
                      </div>
                    </motion.div>

                    {/* Center: Mirch Red Chilli Powder (Elevated in front, exact video centerpiece) */}
                    <motion.div
                      initial={{ y: 40, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      onClick={() => openProductDetail(mirchProduct)}
                      className="w-2/5 z-30 -mb-2 flex flex-col items-center cursor-pointer group"
                    >
                      <div className="relative w-36 sm:w-44 h-56 sm:h-72 rounded-2xl bg-[#14141E] border-2 border-[#E53E3E]/60 p-2 shadow-[0_20px_50px_rgba(229,62,62,0.35)] backdrop-blur-md group-hover:scale-105 group-hover:border-[#E53E3E] transition-all duration-300">
                        {/* Red Aura Glow */}
                        <div className="absolute inset-0 bg-radial from-[#E53E3E]/20 via-transparent to-transparent blur-xl pointer-events-none" />
                        <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#FED7D7] p-2 overflow-hidden flex items-center justify-center relative">
                          <img
                            src={mirchProduct.image}
                            alt="Lal Mirch Powder"
                            className="max-h-full object-contain filter drop-shadow-xl"
                          />
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#E53E3E] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                          ★ Mirch
                        </span>
                      </div>
                      {/* Red Chilli Powder Mound & Whole Chillies Indicator */}
                      <div className="mt-2 text-center">
                        <span className="text-xs font-bold text-[#FC8181] block">लाल मिर्च पाउडर</span>
                        <span className="text-[10px] text-[#CBD5E0]">Vibrant Pure Red</span>
                      </div>
                    </motion.div>

                    {/* Right: Dhaniya Coriander Packet */}
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      onClick={() => openProductDetail(dhaniyaProduct)}
                      className="w-1/3 -ml-3 z-10 flex flex-col items-center cursor-pointer group"
                    >
                      <div className="relative w-28 sm:w-36 h-48 sm:h-60 rounded-2xl bg-[#121218]/80 border border-[#38A169]/40 p-2 shadow-2xl backdrop-blur-md group-hover:scale-105 group-hover:border-[#38A169] transition-transform duration-300">
                        <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#C6F6D5] p-1.5 overflow-hidden flex items-center justify-center">
                          <img
                            src={dhaniyaProduct.image}
                            alt="Dhaniya Powder"
                            className="max-h-full object-contain filter drop-shadow-md"
                          />
                        </div>
                        <span className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded bg-[#38A169] text-white text-[9px] font-black uppercase">
                          Dhaniya
                        </span>
                      </div>
                      {/* Coriander Powder Mound Indicator */}
                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-bold text-[#68D391] block">धनिया पाउडर</span>
                        <span className="text-[9px] text-[#A0AEC0]">Fresh Roasted Seeds</span>
                      </div>
                    </motion.div>

                  </div>

                  {/* Podium Base Reflection Line with Spices Mounds */}
                  <div className="w-full max-w-sm h-1.5 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent rounded-full mt-2 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                </div>
              )}

              {/* SLIDE 2: Kashmiri Mirch Special with Samosas, Curry & Sunburst Glow */}
              {currentData.type === 'kashmiri' && (
                <div className="relative w-full max-w-lg flex flex-col items-center">
                  
                  {/* Radiant Sunburst Background Glow (Exact video scene) */}
                  <div className="absolute -inset-10 bg-radial from-[#DD6B20]/35 via-[#C53030]/20 to-transparent rounded-full blur-2xl animate-pulse pointer-events-none" />

                  <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
                    
                    {/* Left Dish: Crispy Punjabi Samosas with Chutneys */}
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="absolute -left-2 sm:left-0 bottom-4 w-32 sm:w-40 h-32 sm:h-40 rounded-full border-2 border-[#D4AF37]/50 overflow-hidden shadow-2xl z-20 group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"
                        alt="Crispy Samosas"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-1.5">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F5DE88]">Crispy Samosas</span>
                      </div>
                    </motion.div>

                    {/* Centerpiece: Munshi Panna Kashmiri Mirch Pack with "Great Taste" seal */}
                    <motion.div
                      initial={{ opacity: 0, y: 25, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      onClick={() => openProductDetail(kashmiriProduct)}
                      className="relative z-30 w-44 sm:w-56 h-64 sm:h-80 rounded-3xl bg-[#14141E] border-2 border-[#E53E3E] p-2.5 shadow-[0_25px_60px_rgba(229,62,62,0.4)] cursor-pointer group"
                    >
                      {/* Great Taste Seal Badge */}
                      <div className="absolute -top-3 -right-3 z-40 px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border border-white/40">
                        <Star className="w-3 h-3 fill-[#0A0A0E]" />
                        <span>Great Taste</span>
                      </div>

                      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white via-white to-[#FED7D7] p-2 overflow-hidden flex items-center justify-center">
                        <img
                          src={kashmiriProduct.image}
                          alt="Kashmiri Lal Mirch"
                          className="max-h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </motion.div>

                    {/* Right Dish: Rich Aromatic Indian Curry / Dal Makhani Bowl */}
                    <motion.div
                      initial={{ opacity: 0, x: 30, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      className="absolute -right-2 sm:right-0 bottom-4 w-32 sm:w-40 h-32 sm:h-40 rounded-full border-2 border-[#D4AF37]/50 overflow-hidden shadow-2xl z-20 group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80"
                        alt="Royal Curry"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-1.5">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F5DE88]">Shahi Dal &amp; Curry</span>
                      </div>
                    </motion.div>

                  </div>

                  {/* Caption */}
                  <p className="text-xs text-[#FAF7EE] font-medium text-center mt-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#E53E3E] inline-block animate-ping" />
                    <span>गहरा प्राकृतिक रंग • 100% साबुत कश्मीरी मिर्च</span>
                  </p>
                </div>
              )}

              {/* SLIDE 3: Chef's Kitchen & Blended Masale (Chana Masala, Garam Masala) */}
              {currentData.type === 'chef' && (
                <div className="relative w-full max-w-lg flex flex-col items-center">
                  
                  {/* Golden kitchen aura */}
                  <div className="absolute inset-0 bg-radial from-[#D4AF37]/25 via-[#975A16]/20 to-transparent blur-3xl pointer-events-none" />

                  <div className="relative w-full h-80 sm:h-96 flex items-center justify-center">
                    
                    {/* Left: Authentic Punjabi Chole dish */}
                    <motion.div
                      initial={{ opacity: 0, x: -25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 }}
                      className="absolute -left-3 sm:left-2 bottom-6 w-32 sm:w-40 h-32 sm:h-40 rounded-3xl border-2 border-[#D4AF37]/60 overflow-hidden shadow-2xl z-20 group"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80"
                        alt="Amritsari Chole"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                        <span className="text-[10px] sm:text-xs font-bold text-[#F5DE88]">Amritsari Chole</span>
                      </div>
                    </motion.div>

                    {/* Center: Chana Masala Blend Pack */}
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      onClick={() => openProductDetail(chanaProduct)}
                      className="relative z-30 w-40 sm:w-48 h-60 sm:h-72 rounded-3xl bg-[#14141E] border-2 border-[#D4AF37] p-2 shadow-[0_20px_50px_rgba(212,175,55,0.35)] cursor-pointer group"
                    >
                      <div className="w-full h-full rounded-2xl bg-gradient-to-b from-white to-[#FEFCBF] p-2 overflow-hidden flex items-center justify-center">
                        <img
                          src={chanaProduct.image}
                          alt="Chana Masala"
                          className="max-h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#D4AF37] text-[#0A0A0E] text-[10px] font-black uppercase tracking-wider">
                        Chana Masala
                      </span>
                    </motion.div>

                    {/* Right: Garam Masala Blend Pack */}
                    <motion.div
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.25 }}
                      onClick={() => openProductDetail(garamProduct)}
                      className="absolute -right-3 sm:right-2 bottom-6 w-32 sm:w-38 h-48 sm:h-56 rounded-2xl bg-[#14141E] border border-[#D4AF37]/50 p-1.5 shadow-2xl z-20 cursor-pointer group"
                    >
                      <div className="w-full h-full rounded-xl bg-gradient-to-b from-white to-[#FEFCBF] p-1.5 overflow-hidden flex items-center justify-center">
                        <img
                          src={garamProduct.image}
                          alt="Garam Masala"
                          className="max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-[#E69C36] text-[#0A0A0E] text-[9px] font-black uppercase">
                        Garam Masala
                      </span>
                    </motion.div>

                  </div>

                  <p className="text-xs text-[#FAF7EE] font-medium text-center mt-2 flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>24 मसालों का शाही मिश्रण • हर बाइट में अनोखा स्वाद</span>
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Slide Navigation Arrow Button */}
        <button
          onClick={() => handlePrev(true)}
          aria-label="Previous Slide"
          className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#12121A]/85 hover:bg-[#D4AF37] text-[#DFDACD] hover:text-[#0A0A0E] border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Slide Navigation Arrow Button */}
        <button
          onClick={() => handleNext(true)}
          aria-label="Next Slide"
          className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#12121A]/85 hover:bg-[#D4AF37] text-[#DFDACD] hover:text-[#0A0A0E] border border-[#D4AF37]/40 flex items-center justify-center backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Interactive Bottom Carousel Controls Bar (Pills & Autoplay Progress) */}
      <div className="mt-4 sm:mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-20">
        
        {/* Slide Indicator Pills */}
        <div className="flex items-center gap-2 sm:gap-3">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx, idx > currentSlide ? 1 : -1, true)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${
                currentSlide === idx
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-[#B8B4A8] hover:text-[#FAF7EE] border border-white/5'
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="hidden xs:inline">
                {idx === 0
                  ? 'Royal Dry Fruits'
                  : idx === 1
                  ? 'Ground Spices Trio'
                  : idx === 2
                  ? 'Kashmiri Mirch Special'
                  : "Chef's Blends"}
              </span>
            </button>
          ))}
        </div>

        {/* Slide Progress Bar & Pause Control */}
        <div className="flex items-center gap-3 text-xs text-[#B8B4A8]">
          {/* Progress Track */}
          <div className="w-24 sm:w-36 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E69C36] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
            className="p-1 rounded-full hover:bg-white/10 text-[#FAF7EE] transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-[#F5DE88]" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Heritage Achievement Stats Plaque */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 sm:mt-8 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl glass-panel-gold border border-[#D4AF37]/25 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center shadow-lg relative z-10"
      >
        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-serif text-xl sm:text-3xl font-bold gold-gradient-text">1985</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#A6A295] font-medium">Founded in Agra</div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-serif text-xl sm:text-3xl font-bold gold-gradient-text">100%</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#A6A295] font-medium">Purity &amp; No Starch</div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-serif text-xl sm:text-3xl font-bold gold-gradient-text">50,000+</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#A6A295] font-medium">Royal Homes Served</div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="font-serif text-xl sm:text-3xl font-bold gold-gradient-text">4.9 / 5</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#A6A295] font-medium">Verified Rating</div>
        </div>
      </motion.div>
    </section>
  );
};
