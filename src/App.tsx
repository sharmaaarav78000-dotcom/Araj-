import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { FuturisticBackground } from './components/FuturisticBackground';
import { ThreeDBackground } from './components/ThreeDBackground';
import { ParticleBurst } from './components/ParticleBurst';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopCatalog } from './components/ShopCatalog';
import { DryFruitsSection } from './components/DryFruitsSection';
import { SpicesSection } from './components/SpicesSection';
import { GiftingSection } from './components/GiftingSection';
import { BrandStory } from './components/BrandStory';
import { Testimonials } from './components/Testimonials';
import { ChefKitchenExplorer } from './components/ChefKitchenExplorer';
import { QualityProcessSection } from './components/QualityProcessSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Modals & Interactive Overlays
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { HamperBuilderModal } from './components/HamperBuilderModal';
import { PurityScannerModal } from './components/PurityScannerModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AiChatbot } from './components/AiChatbot';
import { PhoneViewModal } from './components/PhoneViewModal';
import { DistributorModal } from './components/DistributorModal';
import { ThreeDAtelierModal } from './components/ThreeDAtelierModal';
import { Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0D0D14] border border-[#D4AF37]/50 shadow-2xl backdrop-blur-xl text-xs font-semibold text-[#FAF7EE] max-w-sm mx-auto sm:mx-0"
        >
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MainStoreView: React.FC = () => {
  const { 
    setActiveCategory, 
    isThreeDAtelierOpen, 
    threeDProduct, 
    closeThreeDAtelier, 
    openThreeDAtelier 
  } = useStore();

  const handleNavigate = (sectionId: string, category?: string) => {
    if (category) {
      setActiveCategory(category as any);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-[#FAF7EE] selection:bg-[#D4AF37]/30 selection:text-[#FAF7EE] relative flex flex-col antialiased">
      {/* 3D WebGL Floating Spice Universe (Three.js real-time simulation) */}
      <ThreeDBackground />

      {/* Ambient Canvas Background with Interactive Golden Star Dust */}
      <FuturisticBackground />

      {/* Physics Particle Burst Overlay & Audio FX Controller */}
      <ParticleBurst />

      {/* PWA Download Banner */}
      <PWAInstallBanner />

      {/* Luxury Navigation Bar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Flow */}
      <main className="flex-grow pb-16 md:pb-0">
        <Hero
          onShopNow={() => handleNavigate('catalog')}
          onExplore={() => handleNavigate('dry-fruits')}
        />
        <ShopCatalog />
        <ChefKitchenExplorer />
        <DryFruitsSection onExploreDryFruits={() => handleNavigate('catalog', 'DRY FRUITS')} />
        <SpicesSection onExploreSpices={() => handleNavigate('catalog', 'SPICES')} />
        <QualityProcessSection />
        <GiftingSection onExploreGifting={() => handleNavigate('catalog', 'GIFT PACKS')} />
        <BrandStory />
        <Testimonials />
      </main>

      {/* Floating 3D Experience Quick HUD Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => openThreeDAtelier()}
        id="floating-3d-atelier-trigger"
        title="Open Interactive 3D Spice Atelier"
        className="fixed bottom-24 right-4 sm:right-6 z-40 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#14141E]/95 via-[#1E1E2E]/95 to-[#14141E]/95 hover:from-[#D4AF37]/30 hover:to-[#E69C36]/30 border border-[#D4AF37]/60 shadow-[0_8px_32px_rgba(212,175,55,0.35)] backdrop-blur-xl text-xs font-bold text-[#FAF7EE] cursor-pointer group hover:scale-105 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C59F2D] flex items-center justify-center text-[#0A0A0E] group-hover:rotate-12 transition-transform shadow-md">
          <Box className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest leading-none">
            3D EXPERIENCE
          </span>
          <span className="text-xs font-bold text-white group-hover:text-[#F5DE88]">
            360° Spice Atelier
          </span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#48BB78] animate-ping" />
      </motion.button>

      {/* Luxury Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onNavigate={handleNavigate} />

      {/* Modals & Slide-out Drawers */}
      <ThreeDAtelierModal
        isOpen={isThreeDAtelierOpen}
        onClose={closeThreeDAtelier}
        initialProduct={threeDProduct || undefined}
      />
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SearchModal />
      <AccountModal />
      <HamperBuilderModal />
      <PurityScannerModal />
      <DistributorModal />
      <AndroidInstallModal />
      <PhoneViewModal />
      <AiChatbot />
      <OfflineIndicator />
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainStoreView />
    </StoreProvider>
  );
}
