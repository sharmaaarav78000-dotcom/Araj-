import React from 'react';
import { Home, Compass, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileBottomNavProps {
  onNavigate: (sectionId: string, category?: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onNavigate }) => {
  const { cartCount, wishlist, openCart, openWishlist, setActiveCategory } = useStore();

  const handleHomeClick = () => {
    onNavigate('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCatalogClick = () => {
    setActiveCategory('ALL');
    onNavigate('catalog');
  };

  const handleSpicesClick = () => {
    setActiveCategory('SPICES');
    onNavigate('spices');
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A10]/92 backdrop-blur-2xl border-t border-[#D4AF37]/30 px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[54px]"
          aria-label="Navigate to Home"
        >
          <Home className="w-4.5 h-4.5 text-[#D4AF37]" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </button>

        {/* Explore Shop */}
        <button
          onClick={handleCatalogClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[54px]"
          aria-label="Browse All Products"
        >
          <Compass className="w-4.5 h-4.5 text-[#DFDACD]" />
          <span className="text-[10px] font-medium tracking-wide">Shop</span>
        </button>

        {/* Spices Shortcut */}
        <button
          onClick={handleSpicesClick}
          className="flex flex-col items-center justify-center gap-1 py-1 px-2 text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[54px]"
          aria-label="Pure Stone Ground Spices"
        >
          <Sparkles className="w-4.5 h-4.5 text-[#E69C36]" />
          <span className="text-[10px] font-medium tracking-wide">Spices</span>
        </button>

        {/* Wishlist with count badge */}
        <button
          onClick={openWishlist}
          className="relative flex flex-col items-center justify-center gap-1 py-1 px-2 text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[54px]"
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
          className="relative flex flex-col items-center justify-center gap-1 py-1 px-2 text-[#A6A295] hover:text-[#FAF7EE] active:scale-95 transition-all cursor-pointer min-w-[54px]"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5 text-[#F5DE88]" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F3D375] text-[#070709] text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide font-bold text-[#F5DE88]">Cart</span>
        </button>
      </div>
    </nav>
  );
};
