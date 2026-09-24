import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    closeWishlist,
    wishlist,
    toggleWishlist,
    addToCart,
    openCart
  } = useStore();

  if (!isWishlistOpen) return null;

  return (
    <AnimatePresence>
      <div key="wishlist-drawer-wrapper" className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          key="wishlist-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWishlist}
          className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            key="wishlist-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-[#0D0D14] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#11111B]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#E53E3E]/15 text-[#E53E3E]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#FAF7EE]">
                    Your Wishlist
                  </h2>
                  <span className="text-xs text-[#A6A295]">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                  </span>
                </div>
              </div>

              <button
                onClick={closeWishlist}
                aria-label="Close wishlist"
                className="p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-[#E53E3E]">
                    <Heart className="w-8 h-8 opacity-30" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF7EE]">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-[#A6A295] max-w-xs">
                    Save your favorite items by tapping the heart icon on any product card.
                  </p>
                  <button
                    onClick={closeWishlist}
                    className="mt-2 px-6 py-2.5 rounded-full glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Explore Products
                  </button>
                </div>
              ) : (
                wishlist.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl glass-panel border border-white/10 flex items-center gap-4 group hover:border-[#D4AF37]/35 transition-all"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl bg-white/[0.04] p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow-md"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-bold text-[#FAF7EE] truncate">
                        {product.name}
                      </h4>
                      <span className="text-[11px] text-[#A6A295] block">
                        Pack: {product.weight}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-bold text-[#FAF7EE]">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-[#88847A] line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="text-[#88847A] hover:text-[#E53E3E] transition-colors p-1"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          addToCart(product);
                          closeWishlist();
                          openCart();
                        }}
                        className="px-3 py-1.5 rounded-lg glass-btn-gold text-[#0A0A0E] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {wishlist.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-white/10 bg-[#11111B] space-y-3">
                <button
                  onClick={() => {
                    wishlist.forEach((p) => addToCart(p));
                    closeWishlist();
                    openCart();
                  }}
                  className="w-full py-3.5 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>MOVE ALL TO CART</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
