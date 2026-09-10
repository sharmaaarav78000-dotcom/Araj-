import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  RotateCw, 
  Sparkles, 
  Layers, 
  Check, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Utensils, 
  Volume2,
  Box,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ThreeDProductViewer } from './ThreeDProductViewer';
import { triggerParticleBurst } from '../utils/effects';
import { playLuxuryChime } from '../utils/sound';
import { Product } from '../types';

interface ThreeDAtelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product;
}

export const ThreeDAtelierModal: React.FC<ThreeDAtelierModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
}) => {
  const { products, addToCart, openCheckout } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product>(
    initialProduct || products[0] || {} as Product
  );
  const [activeTab, setActiveTab] = useState<'pouch' | 'specs' | 'aroma'>('pouch');
  const [isAromaPulsing, setIsAromaPulsing] = useState(false);

  // Update selected product when initialProduct changes
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  if (!isOpen || !selectedProduct) return null;

  const handleAddToCart = (e: React.MouseEvent) => {
    triggerParticleBurst(e, { type: 'cart', targetCart: true });
    playLuxuryChime('sparkle');
    addToCart(selectedProduct, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    triggerParticleBurst(e, { type: 'gold' });
    addToCart(selectedProduct, 1);
    onClose();
    openCheckout();
  };

  const handleReleaseAroma = (e: React.MouseEvent) => {
    setIsAromaPulsing(true);
    triggerParticleBurst(e, { type: 'spice' });
    playLuxuryChime('aroma');
    setTimeout(() => setIsAromaPulsing(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl glass-panel-gold border-2 border-[#D4AF37]/45 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col z-10"
        >
          {/* Top Bar Header */}
          <div className="px-5 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between bg-[#12121A]/95">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#975A16] flex items-center justify-center text-[#0A0A0E] shadow-md">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE] tracking-tight">
                    Munshi Panna 3D Spice Atelier
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5DE88] text-[9px] font-mono uppercase font-bold">
                    Interactive 360°
                  </span>
                </div>
                <p className="text-xs text-[#A6A295]">
                  Experience real-time WebGL 3D volumetric packaging &amp; botanical grain depth
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close 3D Atelier"
              className="p-2 rounded-full glass-panel text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left 3D Canvas Stage */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full h-[360px] sm:h-[440px]">
                <ThreeDProductViewer
                  key={selectedProduct.id}
                  product={selectedProduct}
                  className="w-full h-full"
                />

                {/* Simulated Aroma Wave Particle Ring */}
                {isAromaPulsing && (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full border-4 border-[#D4AF37] pointer-events-none"
                  />
                )}
              </div>

              {/* Spice Selection Carousel Under 3D Viewer */}
              <div className="w-full mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {products.slice(0, 8).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      playLuxuryChime('sparkle');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
                      selectedProduct.id === prod.id
                        ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#FAF7EE] shadow-md'
                        : 'bg-white/5 border-white/10 text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/10'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    <span>{prod.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Real-time Specifications, Aromatics, & Add to Cart */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5DE88] text-[10px] font-bold uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE] mt-2">
                  {selectedProduct.name}
                </h3>
                {selectedProduct.hindiName && (
                  <p className="font-hindi text-base text-[#F5DE88] font-medium">
                    {selectedProduct.hindiName}
                  </p>
                )}
                <p className="text-xs text-[#DFDACD] mt-2 leading-relaxed font-light">
                  {selectedProduct.description}
                </p>
              </div>

              {/* 3D Features & Laboratory Certifications */}
              <div className="p-3.5 rounded-2xl bg-[#14141E] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A6A295] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#48BB78]" />
                    <span>AGMARK Certification:</span>
                  </span>
                  <span className="font-bold text-[#48BB78]">Grade I Pure (Zero Starch)</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A6A295] flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#E53E3E]" />
                    <span>Grinding Process:</span>
                  </span>
                  <span className="font-medium text-[#FAF7EE]">Low-Temperature Cold Stone</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A6A295] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Essential Oil Retention:</span>
                  </span>
                  <span className="font-bold text-[#F5DE88]">99.4% Preserved</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold gold-gradient-text">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm text-[#718096] line-through">
                    ₹{selectedProduct.originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#A6A295]">({selectedProduct.weight})</span>
              </div>

              {/* Interactive Actions */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={handleReleaseAroma}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-[#E69C36]/20 hover:from-[#D4AF37]/30 hover:to-[#E69C36]/30 border border-[#D4AF37]/50 text-[#F5DE88] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Release 3D Volatile Aroma Burst</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1A1A26] hover:bg-[#222234] border border-[#D4AF37]/45 text-[#FAF7EE] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E6CA65] to-[#C59F2D] text-[#0A0A0E] text-xs font-extrabold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>BUY NOW</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
