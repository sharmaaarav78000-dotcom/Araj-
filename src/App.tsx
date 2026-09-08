import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopCatalog } from './components/ShopCatalog';
import { SpicesSection } from './components/SpicesSection';
import { DryFruitsSection } from './components/DryFruitsSection';
import { GiftingSection } from './components/GiftingSection';
import { BrandStory } from './components/BrandStory';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { AccountModal } from './components/AccountModal';
import { AiChatbot } from './components/AiChatbot';
import { Check, Sparkles } from 'lucide-react';
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
          className="fixed bottom-24 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#141420] border border-[#D4AF37]/50 shadow-2xl backdrop-blur-xl text-xs font-semibold text-[#FAF7EE]"
        >
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MainStoreView: React.FC = () => {
  const { setActiveCategory } = useStore();

  const handleNavigate = (sectionId: string, category?: string) => {
    if (category) {
      setActiveCategory(category);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = (category?: string) => {
    if (category) {
      setActiveCategory(category);
    }
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F3EFE6] selection:bg-[#D4AF37]/30 selection:text-[#FAF7EE] flex flex-col antialiased">
      {/* Navigation */}
      <Navbar onNavigate={handleNavigate} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero
          onShopNow={() => scrollToCatalog('ALL')}
          onExplore={() => scrollToCatalog('ALL')}
        />
        <ShopCatalog />
        <SpicesSection onExploreSpices={() => scrollToCatalog('SPICES')} />
        <DryFruitsSection onExploreDryFruits={() => scrollToCatalog('DRY FRUITS')} />
        <GiftingSection onExploreGifting={() => scrollToCatalog('GIFT PACKS')} />
        <BrandStory />
        <Testimonials />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-out Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <SearchModal />
      <AccountModal />

      {/* Royal AI Spicer Chatbot */}
      <AiChatbot />

      {/* Toast feedback */}
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
