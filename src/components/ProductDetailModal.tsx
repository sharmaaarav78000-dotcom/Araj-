import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Minus, ShoppingCart, Zap, Heart, Star, ShieldCheck, 
  Leaf, RotateCcw, ChevronDown, ChevronUp, Share2, Check 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    closeProductDetail, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openCheckout,
    showToast 
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string>('details');
  const [copied, setCopied] = useState(false);

  if (!selectedProduct) return null;

  const wishlisted = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    closeProductDetail();
    openCheckout();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? '' : section));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl">
        {/* Background Click to Dismiss */}
        <div className="fixed inset-0" onClick={closeProductDetail} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel-gold border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-10 z-10"
        >
          {/* Close Button */}
          <button
            onClick={closeProductDetail}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-full glass-panel text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Image Showcase */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div className="relative w-full h-80 sm:h-96 rounded-2xl glass-panel p-6 flex items-center justify-center overflow-hidden group">
                {/* Floating Discount Pill */}
                <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-xs font-black tracking-wider uppercase shadow-md">
                  {selectedProduct.discountPercentage ? `${selectedProduct.discountPercentage}% OFF` : '50% OFF'}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`absolute top-4 right-4 z-10 p-2.5 rounded-full glass-panel ${
                    wishlisted ? 'text-[#E53E3E] bg-[#E53E3E]/20' : 'text-[#DFDACD] hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Ambient Glow */}
                <div className="absolute w-60 h-60 rounded-full bg-[#D4AF37]/15 blur-3xl" />

                {/* Image */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Guarantees Row */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 text-center text-[10px] text-[#A6A295]">
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Authentic</span>
                </div>
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <Leaf className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pure & Natural</span>
                </div>
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
                  <span>Freshness Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="md:col-span-6 flex flex-col space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                  {selectedProduct.category}
                </span>
                <div className="flex items-center gap-1 text-[#F5DE88] text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#F5DE88] text-[#F5DE88]" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-[#88847A]">({selectedProduct.reviews} customer ratings)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE] leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Pack Size Pill */}
              <div className="inline-flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-[#FAF7EE]">
                  Pack Size: <strong className="text-[#D4AF37]">{selectedProduct.weight}</strong>
                </span>
                <span className="text-xs text-[#48BB78] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock & Ready to Dispatch
                </span>
              </div>

              {/* Pricing Block */}
              <div className="p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#FAF7EE]">
                  ₹{selectedProduct.price}
                </span>
                <span className="text-base text-[#88847A] line-through">
                  MRP ₹{selectedProduct.originalPrice}
                </span>
                <span className="text-xs font-bold text-[#48BB78] ml-auto">
                  Save ₹{selectedProduct.originalPrice - selectedProduct.price} (Inclusive of all taxes)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#DFDACD] leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs text-[#A6A295] uppercase tracking-wider font-semibold">
                  Quantity
                </span>
                <div className="flex items-center rounded-xl glass-panel border border-white/15 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF7EE] disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-[#FAF7EE]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#FAF7EE]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl glass-panel border border-white/15 text-[#DFDACD] hover:text-white hover:bg-white/5 ml-auto"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl glass-panel-gold border border-[#D4AF37]/50 text-[#FAF7EE] font-bold text-xs uppercase tracking-wider hover:bg-[#D4AF37]/20 transition-all duration-200"
                >
                  <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg transition-all duration-200"
                >
                  <Zap className="w-4 h-4 fill-[#0A0A0E] text-[#0A0A0E]" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Information Accordions */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {/* Accordion 1: Nutritional & Ingredients */}
                <div className="rounded-xl glass-panel border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('details')}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-[#FAF7EE]"
                  >
                    <span>Ingredients & Sourcing</span>
                    {activeAccordion === 'details' ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A6A295]" />
                    )}
                  </button>
                  {activeAccordion === 'details' && (
                    <div className="px-4 pb-3 text-xs text-[#B8B4A8] space-y-1.5 border-t border-white/5 pt-2">
                      <p><strong>Ingredients:</strong> {selectedProduct.ingredients}</p>
                      <p><strong>Nutrition:</strong> {selectedProduct.nutritionalInfo}</p>
                      <p><strong>Origin:</strong> {selectedProduct.origin}</p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Storage & Quality */}
                <div className="rounded-xl glass-panel border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('storage')}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-[#FAF7EE]"
                  >
                    <span>Storage & Purity Guarantee</span>
                    {activeAccordion === 'storage' ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A6A295]" />
                    )}
                  </button>
                  {activeAccordion === 'storage' && (
                    <div className="px-4 pb-3 text-xs text-[#B8B4A8] space-y-1.5 border-t border-white/5 pt-2">
                      <p>{selectedProduct.storage}</p>
                      <p>100% vegetarian. Formulated according to strict FSSAI food quality and hygiene protocols in Agra, India.</p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Delivery */}
                <div className="rounded-xl glass-panel border border-white/10 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('delivery')}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-semibold text-[#FAF7EE]"
                  >
                    <span>Shipping & Express Dispatch</span>
                    {activeAccordion === 'delivery' ? (
                      <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A6A295]" />
                    )}
                  </button>
                  {activeAccordion === 'delivery' && (
                    <div className="px-4 pb-3 text-xs text-[#B8B4A8] space-y-1 border-t border-white/5 pt-2">
                      <p>• Dispatched within 24 hours in insulated aroma-lock packaging.</p>
                      <p>• Free express shipping on all orders over ₹499 across India.</p>
                      <p>• Expected delivery within 2-4 business days.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
