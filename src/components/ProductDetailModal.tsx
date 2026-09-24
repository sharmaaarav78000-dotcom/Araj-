import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Minus, ShoppingCart, Zap, Heart, Star, ShieldCheck, 
  Leaf, RotateCcw, ChevronDown, ChevronUp, Share2, Check, ZoomIn, Eye, Camera
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { triggerParticleBurst } from '../utils/effects';
import { playLuxuryChime } from '../utils/sound';
import { ImageUploadModal } from './ImageUploadModal';

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
  const [loupeActive, setLoupeActive] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50, px: 0, py: 0 });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  if (!selectedProduct) return null;

  const wishlisted = isInWishlist(selectedProduct.id);

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const xPct = Math.max(0, Math.min(100, (px / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (py / rect.height) * 100));
    setLoupePos({ x: xPct, y: yPct, px, py });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerParticleBurst(e, { type: 'cart', targetCart: true });
    addToCart(selectedProduct, quantity);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    triggerParticleBurst(e, { type: 'gold' });
    addToCart(selectedProduct, quantity);
    closeProductDetail();
    openCheckout();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    triggerParticleBurst(e, { type: 'heart' });
    playLuxuryChime('heart');
    toggleWishlist(selectedProduct);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link copied to clipboard');
    playLuxuryChime('sparkle');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion((prev) => (prev === section ? '' : section));
  };

  return (
    <>
      <AnimatePresence>
        <div
          key={`product-detail-modal-${selectedProduct.id}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-xl"
        >
          {/* Background Click to Dismiss */}
          <div className="fixed inset-0" onClick={closeProductDetail} />

          <motion.div
            key={`product-detail-dialog-${selectedProduct.id}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl glass-panel-gold border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 sm:p-10 z-10"
          >
          {/* Close Button */}
          <button
            onClick={closeProductDetail}
            aria-label="Close dialog"
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left: Product Image Showcase with Optical Texture Loupe */}
            <div className="md:col-span-6 flex flex-col items-center">
              <div
                ref={imageContainerRef}
                onMouseEnter={() => setLoupeActive(true)}
                onMouseLeave={() => setLoupeActive(false)}
                onMouseMove={handleImageMouseMove}
                className="relative w-full h-64 sm:h-96 rounded-2xl bg-gradient-to-b from-white via-white to-[#F7F5EE] border border-[#D4AF37]/30 shadow-md p-4 sm:p-6 flex items-center justify-center overflow-hidden group cursor-crosshair select-none"
              >
                {/* Floating Discount Pill */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A0A0E] text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md">
                  {selectedProduct.discountPercentage ? `${selectedProduct.discountPercentage}% OFF` : '50% OFF'}
                </div>

                {/* Buttons overlay */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="p-2 sm:p-2.5 rounded-full glass-btn-icon text-[#DFDACD] hover:text-[#F5DE88] hover:border-[#D4AF37]/60"
                    title="Upload / Change exact box packaging image"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2 sm:p-2.5 rounded-full glass-btn-icon ${
                      wishlisted ? 'text-[#E53E3E] border-[#E53E3E]/50' : 'text-[#DFDACD] hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Ambient Soft Glow */}
                <div className="absolute inset-0 bg-radial from-amber-100/40 via-transparent to-transparent pointer-events-none" />

                {/* Main Image */}
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                />

                {/* Interactive Optical Texture Loupe HUD Overlay */}
                {loupeActive && (
                  <div
                    className="absolute pointer-events-none z-30 w-36 h-36 rounded-full border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.6)] bg-[#07070A] overflow-hidden hidden sm:block"
                    style={{
                      left: loupePos.px - 72,
                      top: loupePos.py - 72,
                    }}
                  >
                    {/* Magnified Image */}
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${selectedProduct.image})`,
                        backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                        backgroundSize: '320%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    {/* Optical Crosshair HUD */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-[1px] bg-[#D4AF37]/30" />
                      <div className="h-full w-[1px] bg-[#D4AF37]/30 absolute" />
                      <div className="w-6 h-6 rounded-full border border-[#D4AF37]/60 absolute" />
                    </div>
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-[#F5DE88] border border-[#D4AF37]/40 tracking-wider">
                      2.5x ZOOM
                    </span>
                  </div>
                )}
              </div>

              {/* Inspection Info Bar */}
              <div className="flex items-center justify-between w-full mt-2 px-1 text-[11px] text-[#A6A295]">
                <span className="flex items-center gap-1 font-mono text-[10px] text-[#D4AF37]">
                  <ZoomIn className="w-3 h-3" /> Hover to Inspect Grain Texture
                </span>
                <span className="text-[10px] font-mono text-[#88847A]">
                  Stone-Milled Purity • 100%
                </span>
              </div>

              {/* Quick Update Button for Peri Peri packaging */}
              {selectedProduct.id === 'SPC-7' && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 via-[#F5DE88]/20 to-[#D4AF37]/20 border border-[#D4AF37]/50 hover:border-[#F5DE88] text-xs font-semibold text-[#F5DE88] flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Set Exact Peri Peri Packaging Artwork</span>
                </button>
              )}

              {/* Guarantees Row */}
              <div className="grid grid-cols-3 gap-2 w-full mt-3 text-center text-[10px] text-[#A6A295]">
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="truncate w-full">100% Authentic</span>
                </div>
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="truncate w-full">Pure & Natural</span>
                </div>
                <div className="p-2 rounded-xl glass-panel flex flex-col items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
                  <span className="truncate w-full">Fresh Guarantee</span>
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
                  <span className="text-[#88847A]">({selectedProduct.reviews})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-[#FAF7EE] leading-tight">
                {selectedProduct.name}
              </h2>

              {/* Pack Size Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs text-[#FAF7EE]">
                  Pack Size: <strong className="text-[#D4AF37]">{selectedProduct.weight}</strong>
                </span>
                <span className="text-xs text-[#48BB78] font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" /> Ready to Dispatch
                </span>
              </div>

              {/* Pricing Block */}
              <div className="p-3.5 sm:p-4 rounded-2xl glass-panel border border-[#D4AF37]/20 flex flex-wrap items-baseline justify-between gap-2 sm:gap-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                    ₹{selectedProduct.price}
                  </span>
                  <span className="text-sm sm:text-base text-[#88847A] line-through">
                    MRP ₹{selectedProduct.originalPrice}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#48BB78]">
                  Save ₹{selectedProduct.originalPrice - selectedProduct.price} (Incl. taxes)
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
                  className="p-2.5 rounded-xl glass-btn-icon text-[#DFDACD] hover:text-white ml-auto cursor-pointer"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="glass-btn-secondary flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[#FAF7EE] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="glass-btn-gold flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[#0A0A0E] font-extrabold text-xs uppercase tracking-wider cursor-pointer"
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

    {/* Image Upload Modal for exact product box image */}
    <ImageUploadModal
      isOpen={isUploadModalOpen}
      onClose={() => setIsUploadModalOpen(false)}
      productId={selectedProduct.id}
      defaultProductName={selectedProduct.name}
    />
  </>
);
};
