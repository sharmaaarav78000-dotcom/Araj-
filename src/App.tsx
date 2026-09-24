import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { FuturisticBackground } from './components/FuturisticBackground';
import { ParticleBurst } from './components/ParticleBurst';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopCatalog } from './components/ShopCatalog';
import { DryFruitsSection } from './components/DryFruitsSection';
import { SpicesSection } from './components/SpicesSection';
import { GiftingSection } from './components/GiftingSection';
import { BrandStory } from './components/BrandStory';
import { LegacySection } from './components/LegacySection';
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
import { OfflineIndicator } from './components/OfflineIndicator';
import { AiChatbot } from './components/AiChatbot';
import { DistributorModal } from './components/DistributorModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { CinematicBrandIntro } from './components/CinematicBrandIntro';
import { Sparkles, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ToastNotification: React.FC = () => {
  const { toastMessage } = useStore();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          key="global-toast-notification"
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
    setActiveCategory 
  } = useStore();

  const [isDraggingOver, setIsDraggingOver] = React.useState(false);
  const [globalUploadOpen, setGlobalUploadOpen] = React.useState(false);
  const [globalFile, setGlobalFile] = React.useState<File | null>(null);
  const [showIntro, setShowIntro] = React.useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('araj_pure_intro_seen') !== 'true';
      }
    } catch {
      // Fallback
    }
    return false;
  });
  const [forceIntro, setForceIntro] = React.useState(false);

  React.useEffect(() => {
    const handleReplayIntro = () => {
      setForceIntro(true);
      setShowIntro(true);
    };
    window.addEventListener('play-araj-intro', handleReplayIntro);
    return () => {
      window.removeEventListener('play-araj-intro', handleReplayIntro);
    };
  }, []);

  React.useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
        setIsDraggingOver(true);
      }
    };
    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsDraggingOver(false);
      }
    };
    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          setGlobalFile(file);
          setGlobalUploadOpen(true);
        }
      }
    };
    const handleWindowPaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          setGlobalFile(file);
          setGlobalUploadOpen(true);
        }
      }
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('paste', handleWindowPaste);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('paste', handleWindowPaste);
    };
  }, []);

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
    <div className="min-h-screen bg-[#07070A] text-[#FAF7EE] selection:bg-[#D4AF37]/30 selection:text-[#FAF7EE] relative flex flex-col antialiased w-full max-w-full overflow-x-hidden">
      {/* 4–5 Second Ultra-Premium Cinematic Brand Opening Animation */}
      {showIntro && (
        <CinematicBrandIntro
          forcePlay={forceIntro}
          onComplete={() => {
            setShowIntro(false);
            setForceIntro(false);
          }}
        />
      )}

      {/* Ambient Canvas Background with Interactive Golden Star Dust */}
      <FuturisticBackground />

      {/* Physics Particle Burst Overlay & Audio FX Controller */}
      <ParticleBurst />

      {/* Drag & Drop Visual Overlay */}
      {isDraggingOver && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-[#D4AF37] pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#F5DE88] mb-4 animate-bounce">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-serif text-[#FAF7EE] mb-2 font-bold">
            Drop Exact Packaging Image
          </h3>
          <p className="text-sm font-mono text-[#D4AF37]">
            Update Peri Peri Masala (peri-peri-masala.png)
          </p>
        </div>
      )}

      {/* Luxury Navigation Bar */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Flow */}
      <main className="flex-grow pb-16 md:pb-0 w-full max-w-full overflow-x-hidden">
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
        <LegacySection />
        <BrandStory />
        <Testimonials />
      </main>

      {/* Luxury Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav onNavigate={handleNavigate} />

      {/* Modals & Slide-out Drawers */}
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
      <AiChatbot />
      <OfflineIndicator />
      <ToastNotification />

      {/* Global Image Upload Modal for Peri Peri Masala */}
      <ImageUploadModal
        isOpen={globalUploadOpen}
        onClose={() => {
          setGlobalUploadOpen(false);
          setGlobalFile(null);
        }}
        productId="SPC-7"
        defaultProductName="Peri Peri Masala"
        initialFile={globalFile}
      />
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
