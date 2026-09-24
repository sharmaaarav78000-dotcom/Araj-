import React from 'react';
import { Home, Compass, ShoppingBag, Heart, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onNavigate: (sectionId: string, category?: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate }) => {
  const { cartCount, wishlist, openCart, openWishlist, setActiveCategory, openAiChat } = useStore();

  const handleHomeClick = () => {
    onNavigate('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogClick = () => {
    setActiveCategory('ALL');
    onNavigate('catalog');
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A10]/95 backdrop-blur-2xl border-t border-[#D4AF37]/35 px-2 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl glass-btn text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[50px]"
          aria-label="Navigate to Home"
        >
          <Home className="w-4.5 h-4.5 text-[#D4AF37]" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        {/* Explore Shop */}
        <button
          onClick={handleCatalogClick}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl glass-btn text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[50px]"
          aria-label="Browse All Products"
        >
          <Compass className="w-4.5 h-4.5 text-[#DFDACD]" />
          <span className="text-[10px] font-medium tracking-wide">Shop</span>
        </button>

        {/* AI Chat Box Trigger */}
        <button
          onClick={openAiChat}
          className="relative flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl glass-btn text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[50px] border border-[#D4AF37]/40 bg-[#D4AF37]/10"
          aria-label="Open AI Chat Box"
        >
          <div className="relative">
            <MessageSquare className="w-4.5 h-4.5 text-[#D4AF37]" />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-[#48BB78] ring-1 ring-[#0A0A10] animate-ping" />
          </div>
          <span className="text-[10px] font-bold text-[#F5DE88] tracking-wide">AI Chat</span>
        </button>

        {/* Wishlist with count badge */}
        <button
          onClick={openWishlist}
          className="relative flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl glass-btn text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[50px]"
          aria-label="Open Wishlist"
        >
          <div className="relative">
            <Heart className="w-4.5 h-4.5 text-[#DFDACD]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#C59F2D] text-[#070709] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide">Wishlist</span>
        </button>

        {/* Cart with count badge */}
        <button
          id="mobile-nav-cart"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-1 py-1.5 px-2.5 rounded-xl glass-btn-gold text-[#0A0A0E] active:scale-95 transition-all cursor-pointer min-w-[52px]"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5 text-[#0A0A0E]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#0A0A0E] text-[#D4AF37] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wide text-[#0A0A0E]">Cart</span>
        </button>
      </div>
    </nav>
  );
};
