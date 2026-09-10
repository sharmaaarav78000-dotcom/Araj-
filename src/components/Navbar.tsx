import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles, 
  Cpu, 
  Gift, 
  Volume2, 
  VolumeX, 
  Bot, 
  Smartphone,
  Building2,
  ChefHat,
  PhoneCall
} from 'lucide-react';
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
    user,
    userProfile,
    openCart, 
    openWishlist, 
    openSearch, 
    openAccount,
    setActiveCategory,
    openScanner,
    openHamper,
    openAiChat,
    openInstallModal,
    openDistributorModal
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
    { label: 'Spices (मसाले)', action: () => { setActiveCategory('SPICES'); onNavigate('spices'); } },
    { label: 'Ground Spices (पिसे)', action: () => { setActiveCategory('GROUND SPICES'); onNavigate('catalog'); } },
    { label: 'Blended Masale (मिक्स)', action: () => { setActiveCategory('BLENDED SPICES'); onNavigate('catalog'); } },
    { label: 'Chef Recipes', action: () => onNavigate('chef-kitchen') },
    { label: 'Dry Fruits', action: () => { setActiveCategory('DRY FRUITS'); onNavigate('dry-fruits'); } },
    { label: 'Gift Packs', action: () => { setActiveCategory('GIFT PACKS'); onNavigate('gifting'); } },
    { label: 'Our Story', action: () => onNavigate('story') },
  ];

  return (
    <>
      {/* Munshi Panna Masale Reference Top Bar: Purity, Agra Heritage, AGMARK & B2B Dealership Hotline */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090E] border-b border-[#D4AF37]/30 text-[#DFDACD] py-1 px-3 sm:px-6 text-[10px] sm:text-[11px] font-mono tracking-wider flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] animate-ping shrink-0" />
          <span className="text-[#F5DE88] font-bold">Zero Compromise on Quality &amp; Taste</span>
          <span className="text-white/30 hidden md:inline">•</span>
          <span className="hidden md:inline text-white/80">Authentic Agra Masale &amp; Pure Dry Fruits Since 1985</span>
          <span className="text-white/30 hidden lg:inline">•</span>
          <span className="hidden lg:inline text-[#D4AF37]">AGMARK Grade Certified</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openDistributorModal}
            className="text-[#F5DE88] hover:text-white font-semibold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <Building2 className="w-3 h-3 text-[#D4AF37]" />
            <span>B2B / Dealership</span>
          </button>
          <span className="text-white/30">•</span>
          <a
            href="tel:+918979221409"
            className="hover:text-[#F5DE88] transition-colors flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
            <span className="hidden sm:inline">+91 89792 21409</span>
            <span className="sm:hidden">Agra Mill</span>
          </a>
        </div>
      </div>

      <header
        className={`fixed top-6 sm:top-7 left-0 right-0 z-40 transition-all duration-500 flex justify-center ${
          isScrolled ? 'py-1 sm:py-1.5 px-2.5 sm:px-6' : 'py-2 sm:py-4 px-2.5 sm:px-8'
        }`}
      >
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-7xl mx-auto rounded-2xl flex items-center justify-between transition-all duration-500 border ${
            isScrolled
              ? 'bg-[#0E0E14]/90 backdrop-blur-2xl border-[#D4AF37]/25 py-2 sm:py-2.5 px-3.5 sm:px-6 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
              : 'bg-[#101017]/85 backdrop-blur-xl border-white/10 py-2.5 sm:py-3 px-3.5 sm:px-8 shadow-[0_10px_30px_rgba(0,0,0,0.4)]'
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
          <div className="flex items-center gap-1 sm:gap-2">
            {/* B2B / Dealership Button */}
            <button
              onClick={openDistributorModal}
              id="navbar-dealership-btn"
              title="Apply for B2B Dealership & Wholesale"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/25 to-[#E69C36]/25 hover:from-[#D4AF37]/40 hover:to-[#E69C36]/40 border border-[#D4AF37]/50 text-[#F5DE88] text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-bold">B2B / Dealership</span>
            </button>

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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#FAF7EE]/10 hover:from-[#D4AF37]/35 hover:to-[#FAF7EE]/25 border border-[#D4AF37]/50 text-[#FAF7EE] text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-mono text-[11px] uppercase tracking-wider">AI Spicer</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] animate-ping" />
            </button>

            {/* Android App Download Trigger */}
            <button
              onClick={openInstallModal}
              id="navbar-android-app-btn"
              title="Download ARAJ App for Android"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/25 to-[#F5DE88]/20 hover:from-[#D4AF37]/40 hover:to-[#F5DE88]/35 border border-[#D4AF37]/55 text-[#FAF7EE] text-xs font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(212,175,55,0.25)] cursor-pointer active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] font-bold">Android App</span>
            </button>

            {/* Audio Synthesis Chime Mute Toggle */}
            <button
              onClick={handleAudioToggle}
              title={isMuted ? 'Unmute luxury sound chimes' : 'Mute luxury sound chimes'}
              aria-label="Toggle sound effects"
              className="hidden sm:flex p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
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

            {/* Wishlist Icon */}
            <button
              id="navbar-wishlist-btn"
              onClick={openWishlist}
              aria-label="Wishlist"
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-full text-[#DFDACD] hover:text-[#FFF] hover:bg-[#D4AF37]/15 border border-transparent hover:border-[#D4AF37]/30 transition-all duration-200"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#C59F2D] text-[#070709] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Icon / Patron Sanctuary Trigger */}
            <button
              id="navbar-account-btn"
              onClick={openAccount}
              aria-label={user ? `Signed in as ${user.displayName || user.email}` : "Sign In & Register"}
              title={user ? `Patron Sanctuary: ${user.displayName || user.email}` : "Sign In with Gmail / Register"}
              className={`relative p-1.5 sm:p-2 rounded-full transition-all duration-200 hidden sm:flex items-center gap-1.5 cursor-pointer ${
                user 
                  ? 'bg-[#D4AF37]/15 border border-[#D4AF37]/60 text-[#FAF7EE] hover:border-[#D4AF37] hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]' 
                  : 'text-[#DFDACD] hover:text-[#FFF] hover:bg-[#D4AF37]/15 border border-transparent hover:border-[#D4AF37]/30'
              }`}
            >
              {user ? (
                <>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Patron'} 
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#D4AF37]"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] text-[#0A0A0E] font-bold text-[10px] flex items-center justify-center">
                      {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-[11px] font-medium max-w-[80px] truncate hidden md:inline text-[#FAF7EE]">
                    {(user.displayName || user.email?.split('@')[0] || 'Patron')}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#48BB78] shrink-0" />
                </>
              ) : (
                <>
                  <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  <span className="text-[11px] font-semibold text-[#D4AF37] hidden md:inline">
                    Sign In
                  </span>
                </>
              )}
            </button>

            {/* Shopping Bag Button with Counter */}
            <button
              id="navbar-cart-btn"
              onClick={openCart}
              aria-label="Shopping Bag"
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/25 via-[#E6CA65]/20 to-[#D4AF37]/15 border border-[#D4AF37]/45 text-[#FFF] hover:border-[#D4AF37] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)] transition-all duration-300 group cursor-pointer"
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
          <>
            {/* Backdrop for click-outside dismissal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-3 sm:inset-x-4 top-16 sm:top-20 z-50 lg:hidden rounded-2xl glass-panel-gold p-5 sm:p-6 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-2xl max-h-[calc(100vh-5rem)] overflow-y-auto"
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
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-b from-[#D4AF37]/25 to-[#FAF7EE]/10 border border-[#D4AF37]/50 text-[11px] text-[#FAF7EE] font-semibold active:scale-95 transition-all"
                  >
                    <Bot className="w-4 h-4 text-[#D4AF37]" />
                    <span>AI Spicer</span>
                  </button>
                  <button
                    onClick={() => {
                      openScanner();
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[11px] text-[#FAF7EE] font-medium active:scale-95 transition-all"
                  >
                    <Cpu className="w-4 h-4 text-[#D4AF37]" />
                    <span>Scanner</span>
                  </button>
                  <button
                    onClick={() => {
                      openHamper();
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl glass-pill text-[11px] text-[#FAF7EE] font-medium active:scale-95 transition-all"
                  >
                    <Gift className="w-4 h-4 text-[#D4AF37]" />
                    <span>Hamper</span>
                  </button>
                </div>

                {/* Dealership / B2B Wholesale Quick Action for Mobile Drawer */}
                <button
                  onClick={() => {
                    openDistributorModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37]/30 via-[#E69C36]/20 to-[#D4AF37]/30 border border-[#D4AF37]/60 text-[#FAF7EE] active:scale-98 transition-all shadow-md cursor-pointer my-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/25 flex items-center justify-center text-[#F5DE88] shrink-0">
                      <Building2 className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#FAF7EE] leading-none">B2B Dealership &amp; Wholesale</p>
                      <p className="text-[10px] text-[#D4AF37] font-medium mt-0.5">Direct Agra factory pricing</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-[10px] font-extrabold uppercase tracking-wider">
                    Apply
                  </span>
                </button>

                {/* Android App Quick Action for Mobile Drawer */}
                <button
                  onClick={() => {
                    openInstallModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#D4AF37]/25 via-[#FAF7EE]/10 to-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#FAF7EE] active:scale-98 transition-all shadow-md cursor-pointer my-1"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/25 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <Smartphone className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#FAF7EE] leading-none">Download Android App</p>
                      <p className="text-[10px] text-[#D4AF37] font-medium mt-0.5">Instant launch &amp; offline mode</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-[10px] font-extrabold uppercase tracking-wider">
                    Install
                  </span>
                </button>

                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      item.action();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left px-3 py-2 rounded-lg text-[#F3EFE6] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 text-base font-medium tracking-wide transition-all active:bg-[#D4AF37]/20"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      openAccount();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#FAF7EE] hover:border-[#D4AF37]/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-[10px]">
                          {user ? (user.displayName || user.email || 'A').charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                        </div>
                      )}
                      <div className="text-left">
                        <span className="block font-semibold">
                          {user ? (user.displayName || user.email) : 'Sign In with Gmail / Register'}
                        </span>
                        <span className="text-[10px] text-[#A6A295]">
                          {user ? 'View Patron Sanctuary & Orders' : 'Access order history & privileges'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase">
                      {user ? 'Sanctuary' : 'Sign In'}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      openWishlist();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-[#DFDACD] hover:text-[#D4AF37] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#D4AF37]" />
                      <span>Wishlist Items</span>
                    </div>
                    <span className="text-xs font-bold text-[#D4AF37]">{wishlist.length}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
