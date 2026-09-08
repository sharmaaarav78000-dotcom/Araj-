import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Heart, User, ShoppingBag, Menu, X, Sparkles, Cpu, Gift, Volume2, VolumeX, Bot } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { toggleAudioMute, getIsAudioMuted } from '../utils/sound';

interface NavbarProps {
  onNavigate: (sectionId: string, category?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(getIsAudioMuted());
  const { 
    cartCount, 
    wishlist, 
    openCart, 
    openWishlist, 
    openSearch, 
    openAccount,
    setActiveCategory,
    openScanner,
    openHamper,
    openAiChat
  } = useStore();

  const handleAudioToggle = () => {
    const muted = toggleAudioMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', action: () => onNavigate('hero') },
    { label: 'Shop', action: () => { setActiveCategory('ALL'); onNavigate('catalog'); } },
    { label: 'Dry Fruits', action: () => { setActiveCategory('DRY FRUITS'); onNavigate('dry-fruits'); } },
    { label: 'Spices', action: () => { setActiveCategory('SPICES'); onNavigate('spices'); } },
    { label: 'Nuts', action: () => { setActiveCategory('NUTS'); onNavigate('catalog'); } },
    { label: 'Seeds', action: () => { setActiveCategory('SEEDS'); onNavigate('catalog'); } },
    { label: 'Gift Packs', action: () => { setActiveCategory('GIFT PACKS'); onNavigate('gifting'); } },
    { label: 'About', action: () => onNavigate('story') },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex justify-center ${
          isScrolled ? 'py-2 px-3 sm:px-6' : 'py-5 px-4 sm:px-8'
        }`}
      >
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-7xl mx-auto rounded-2xl flex items-center justify-between transition-all duration-500 border ${
            isScrolled
              ? 'bg-[#0E0E14]/85 backdrop-blur-2xl border-[#D4AF37]/25 py-2.5 px-4 sm:px-6 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
              : 'bg-[#101017]/60 backdrop-blur-xl border-white/10 py-3.5 px-5 sm:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
          }`}
        >
          {/* Brand Logo & Tagline */}
          <div
            id="navbar-brand-logo"
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37]/60 via-[#F3EFE6]/20 to-[#D4AF37]/80 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_22px_rgba(212,175,55,0.5)] transition-all duration-300 overflow-hidden flex items-center justify-center bg-[#15151F]">
              <img
                src="/images/logo.png"
                alt="ARAJ Dry Fruits & Spices Logo"
                className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display tracking-[0.22em] text-lg sm:text-xl font-bold gold-gradient-text uppercase leading-none">
                ARAJ
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37]/80 font-medium mt-0.5">
                Est. 1985 • Agra
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={item.action}
                className="relative px-3 py-1.5 text-xs xl:text-sm font-medium tracking-wide text-[#DFDACD] hover:text-[#FFF5DC] transition-colors rounded-full hover:bg-white/[0.04] group"
              >
                <span>{item.label}</span>
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent group-hover:w-3/5 transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2.5">
            
            {/* Working Futuristic Purity Scanner Trigger */}
            <button
              onClick={() => openScanner()}
              id="navbar-scanner-btn"
              title="Open Laboratory Purity & Molecular Scanner"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 border border-[#D4AF37]/40 text-[#FAF7EE] hover:text-[#FFF] text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)] hover:shadow-[0_0_18px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Purity Scanner</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] animate-ping" />
            </button>

            {/* Bespoke Hamper Atelier Trigger */}
            <button
              onClick={openHamper}
              id="navbar-hamper-btn"
              title="Architect Custom Royal Gift Hamper"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-pill text-xs font-medium text-[#DFDACD] hover:text-[#FAF7EE] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Bespoke Coffret</span>
            </button>

            {/* AI Spicer & Sommelier Chatbot Trigger */}
            <button
              onClick={openAiChat}
              id="navbar-ai-spicer-btn"
              title="Consult Araj Royal AI Spicer & Sommelier"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#FAF7EE]/10 hover:from-[#D4AF37]/35 hover:to-[#FAF7EE]/25 border border-[#D4AF37]/50 text-[#FAF7EE] text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline">AI Spicer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] animate-ping" />
            </button>

            {/* Audio Synthesis Chime Mute Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute luxury sound chimes' : 'Mute luxury sound chimes'}
              aria-label="Toggle sound effects"
              className="p-2 sm:p-2.5 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-[#88847A]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              )}
            </button>

            {/* Search Icon */}
            <button
              id="navbar-search-btn"
              onClick={openSearch}
              aria-label="Search products"
              className="p-2 sm:p-2.5 rounded-full text-[#DFDACD] hover:text-[#FFF] hover:bg-[#D4AF37]/15 border border-transparent hover:border-[#D4AF37]/30 transition-all duration-200"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Wishlist Icon with Counter */}
            <button
              id="navbar-wishlist-btn"
              onClick={openWishlist}
              aria-label="Wishlist"
              className="relative p-2 sm:p-2.5 rounded-full text-[#DFDACD] hover:text-[#FFF] hover:bg-[#D4AF37]/15 border border-transparent hover:border-[#D4AF37]/30 transition-all duration-200"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C59F2D] text-[#070709] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              id="navbar-account-btn"
              onClick={openAccount}
              aria-label="Account"
              className="p-2 sm:p-2.5 rounded-full text-[#DFDACD] hover:text-[#FFF] hover:bg-[#D4AF37]/15 border border-transparent hover:border-[#D4AF37]/30 transition-all duration-200 hidden sm:flex"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Shopping Bag Button with Counter */}
            <button
              id="navbar-cart-btn"
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/25 via-[#E6CA65]/20 to-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#FFF] hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 group cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F5DE88] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F3D375] text-[#070709] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#FFF] hidden md:inline">
                Cart
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="navbar-mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-full text-[#DFDACD] hover:text-[#FFF] hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-4 top-20 z-30 lg:hidden rounded-2xl glass-panel-gold p-6 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
                  Navigation
                </span>
                <span className="text-xs text-[#FAF7EE]/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Since 1985
                </span>
              </div>

              {/* Special Futuristic Triggers for Mobile */}
              <div className="grid grid-cols-3 gap-2 pb-2">
                <button
                  onClick={() => {
                    openAiChat();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-b from-[#D4AF37]/25 to-[#FAF7EE]/10 border border-[#D4AF37]/50 text-[11px] text-[#FAF7EE] font-semibold"
                >
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                  <span>AI Spicer</span>
                </button>
                <button
                  onClick={() => {
                    openScanner();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[11px] text-[#FAF7EE] font-medium"
                >
                  <Cpu className="w-4 h-4 text-[#D4AF37]" />
                  <span>Lab Scanner</span>
                </button>
                <button
                  onClick={() => {
                    openHamper();
                    setMobileMenuOpen(false);
                  }}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl glass-pill text-[11px] text-[#FAF7EE] font-medium"
                >
                  <Gift className="w-4 h-4 text-[#D4AF37]" />
                  <span>Hamper</span>
                </button>
              </div>

              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg text-[#F3EFE6] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 text-base font-medium tracking-wide transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-3 border-t border-white/10 flex items-center justify-around">
                <button
                  onClick={() => {
                    openAccount();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs text-[#DFDACD] hover:text-[#D4AF37]"
                >
                  <User className="w-4 h-4" /> Account
                </button>
                <button
                  onClick={() => {
                    openWishlist();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-xs text-[#DFDACD] hover:text-[#D4AF37]"
                >
                  <Heart className="w-4 h-4" /> Wishlist ({wishlist.length})
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
