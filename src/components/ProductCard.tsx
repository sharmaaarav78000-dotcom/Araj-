import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, Eye, ShoppingCart, Zap, Star, Activity, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { triggerParticleBurst } from '../utils/effects';
import { playLuxuryChime } from '../utils/sound';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    openProductDetail, 
    openCheckout, 
    openScanner
  } = useStore();
  const wishlisted = isInWishlist(product.id);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt and interactive specular reflection position
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;

    // Subtle tilt max 5 degrees for ultra-expensive tactile feel
    const rx = ((y / rect.height) - 0.5) * -8;
    const ry = ((x / rect.width) - 0.5) * 8;

    setTilt({ rx, ry });
    setGlarePos({ x: xPct, y: yPct, opacity: 0.18 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerParticleBurst(e, { type: 'gold' });
    addToCart(product, 1);
    openCheckout();
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerParticleBurst(e, { type: 'cart', targetCart: true });
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerParticleBurst(e, { type: 'heart' });
    playLuxuryChime('heart');
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openProductDetail(product);
  };

  const handleOpenScanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerParticleBurst(e, { type: 'spice' });
    openScanner(product);
  };

  // Luxury provenance subtitle based on category
  const isSpice = product.category.toLowerCase().includes('spice') || product.tags.includes('SPICES');
  const luxurySubtitle = isSpice 
    ? 'Stone-Ground • Aromatic Terpene Lock' 
    : 'Imperial Grade • Sun-Cured Heritage';

  return (
    <motion.div
      layout
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => openProductDetail(product)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 0.18s ease-out, box-shadow 0.3s ease',
      }}
      className="group relative rounded-3xl p-4 sm:p-5 glass-card-futuristic hover:border-[#D4AF37]/60 hover:shadow-[0_25px_55px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden transform hover:-translate-y-1.5"
    >
      {/* Interactive dynamic specular glare that follows the mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 245, 210, ${glarePos.opacity}) 0%, transparent 60%)`,
        }}
      />

      {/* Top Bar: Luxury Badge & Fast Actions */}
      <div className="flex items-center justify-between z-20 w-full mb-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            {product.discountPercentage ? `${product.discountPercentage}% OFF` : 'SPECIAL'}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[9px] font-mono text-[#D4AF37]">
            EST. 1985
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Working Futuristic Purity Scanner Trigger Button */}
          <button
            onClick={handleOpenScanner}
            title="Scan Batch Spectrometry"
            aria-label="Scan Batch Purity"
            className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0A0E] transition-all group-hover:scale-105"
          >
            <Activity className="w-3.5 h-3.5" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick View"
            className="w-8 h-8 rounded-full glass-panel-subtle flex items-center justify-center text-[#DFDACD] hover:text-[#D4AF37] hover:bg-white/10 transition-all opacity-80 group-hover:opacity-100"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label="Wishlist"
            className={`w-8 h-8 rounded-full glass-panel-subtle flex items-center justify-center transition-all ${
              wishlisted
                ? 'text-[#E53E3E] bg-[#E53E3E]/10 border border-[#E53E3E]/30'
                : 'text-[#DFDACD] hover:text-[#D4AF37] hover:bg-white/10'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                wishlisted ? 'fill-current' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Product Image Stage on Studio Podium */}
      <div className="relative w-full h-44 sm:h-52 rounded-2xl bg-gradient-to-b from-white via-white to-[#FAF8F2] flex items-center justify-center my-2 p-3 overflow-hidden border border-[#D4AF37]/25 shadow-sm group-hover:border-[#D4AF37]/50 transition-colors">
        {/* Soft radial backdrop halo on hover */}
        <div className="absolute inset-0 bg-radial from-amber-100/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('arajpure.com')) {
              target.src = `https://www.arajpure.com${product.image.replace('/images', '')}`;
            }
          }}
        />
      </div>

      {/* Product Metadata with High Luxury Typography */}
      <div className="space-y-2 pt-2 border-t border-white/10 z-20">
        <div className="flex items-center justify-between text-xs">
          <span className="font-editorial italic text-[11px] text-[#C59F2D]">
            {luxurySubtitle}
          </span>
          <div className="flex items-center gap-1 text-[#F5DE88] text-[11px] font-semibold">
            <Star className="w-3 h-3 fill-[#F5DE88] text-[#F5DE88]" />
            <span>{product.rating}</span>
            <span className="text-[#88847A]">({product.reviews})</span>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-lg font-bold text-[#FAF7EE] tracking-tight group-hover:text-[#F5DE88] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="text-[11px] text-[#A6A295] font-mono block">
            Net Weight: {product.weight}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2.5 pt-0.5">
          <span className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7EE]">
            ₹{product.price}
          </span>
          <span className="text-xs text-[#88847A] line-through font-normal">
            ₹{product.originalPrice}
          </span>
          <span className="text-[11px] font-bold text-[#48BB78] ml-auto">
            Save ₹{product.originalPrice - product.price}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-white/[0.05] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/50 text-[#FAF7EE] font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ADD TO BAG</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] hover:brightness-110 text-[#0A0A0E] font-bold text-[11px] uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-[#0A0A0E] text-[#0A0A0E]" />
            <span>BUY NOW</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
