import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Sparkles, Check, Plus, Trash2, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { playLuxuryChime } from '../utils/sound';

interface BoxOption {
  id: string;
  name: string;
  material: string;
  price: number;
  bgGradient: string;
  borderColor: string;
}

const BOX_OPTIONS: BoxOption[] = [
  {
    id: 'obsidian',
    name: 'Imperial Obsidian Velvet',
    material: 'Midnight velvet with 24K micro-gold foil embossing',
    price: 350,
    bgGradient: 'from-[#12121E] via-[#0A0A10] to-[#1A1A28]',
    borderColor: 'border-[#D4AF37]/50',
  },
  {
    id: 'marble',
    name: 'Agra Pietra Dura Lacquer',
    material: 'High-gloss ivory lacquer inspired by Mughal marble inlay',
    price: 450,
    bgGradient: 'from-[#1A1A22] via-[#242432] to-[#12121A]',
    borderColor: 'border-[#FFF0C2]/50',
  },
  {
    id: 'brass',
    name: 'Royal Heritage Brass & Teak',
    material: 'Hand-burnished seasoned teak with brass filigree latches',
    price: 550,
    bgGradient: 'from-[#2A1E14] via-[#1C140E] to-[#2B1B10]',
    borderColor: 'border-[#E6A938]/60',
  },
];

export const HamperBuilderModal: React.FC = () => {
  const { isHamperOpen, closeHamper, addToCart } = useStore();
  const [selectedBox, setSelectedBox] = useState<BoxOption>(BOX_OPTIONS[0]);
  const [slots, setSlots] = useState<(Product | null)[]>([
    PRODUCTS[0], // California Almonds
    PRODUCTS[1], // Jumbo Cashews
    PRODUCTS[3], // Garam Masala
    null,
  ]);
  const [customEngraving, setCustomEngraving] = useState('With Deepest Regards & Warmth');

  if (!isHamperOpen) return null;

  const handleSelectSlot = (index: number, product: Product) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = product;
      return next;
    });
    playLuxuryChime('click');
  };

  const handleRemoveSlot = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    playLuxuryChime('click');
  };

  // Calculate items total
  const itemsTotal = slots.reduce((acc, p) => (p ? acc + p.price : acc), 0);
  const totalHamperPrice = itemsTotal + selectedBox.price;
  const isComplete = slots.filter(Boolean).length === 4;

  const handleAddHamperToBag = () => {
    const filledProducts = slots.filter((p): p is Product => p !== null);
    const hamperName = `Custom ${selectedBox.name} (${filledProducts.map((p) => p.name).join(', ')})`;
    
    // Create a virtual product representing the custom bespoke hamper
    const customHamperProduct: Product = {
      id: `custom-hamper-${Date.now()}`,
      name: `Bespoke Hamper: ${selectedBox.name}`,
      category: 'gifting',
      weight: 'Custom 4-Piece Curation',
      price: totalHamperPrice,
      originalPrice: totalHamperPrice + 250,
      discountPercentage: 12,
      rating: 5.0,
      reviews: 1,
      image: '/images/products-gifting/premium-gifting-dryfruits-box.png',
      description: `Bespoke artisanal gift coffret featuring ${filledProducts.map((p) => p.name).join(', ')}. Engraved note: "${customEngraving}".`,
      featured: true,
      inStock: true,
      tags: ['GIFT PACKS'],
    };

    addToCart(customHamperProduct, 1);
    playLuxuryChime('success');
    closeHamper();
  };

  return (
    <AnimatePresence>
      <div key="hamper-modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          key="hamper-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeHamper}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          key="hamper-dialog"
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-5xl glass-card-futuristic rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#0E0E18]/85 backdrop-blur-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display-luxury text-[10px] sm:text-xs tracking-[0.25em] text-[#D4AF37] font-bold">
                    BESPOKE ATELIER
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono">
                    ROYAL COFFRET
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE] tracking-wide">
                  Architect Your Custom Luxury Gift Coffret
                </h2>
              </div>
            </div>

            <button
              onClick={closeHamper}
              className="p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white"
              aria-label="Close Hamper Architect"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-7">
            
            {/* Step 1: Choose Box Finish */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1. Select Presentation Coffret Finish
                </span>
                <span className="text-xs text-[#A6A295]">Handcrafted in Agra</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BOX_OPTIONS.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => {
                      setSelectedBox(box);
                      playLuxuryChime('click');
                    }}
                    className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden group cursor-pointer ${
                      selectedBox.id === box.id
                        ? `${box.borderColor} bg-gradient-to-br ${box.bgGradient} shadow-[0_0_25px_rgba(212,175,55,0.2)]`
                        : 'border-white/10 bg-[#12121C] hover:border-white/20'
                    }`}
                  >
                    {selectedBox.id === box.id && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <h3 className="font-serif text-sm font-bold text-[#FAF7EE] group-hover:text-[#D4AF37] transition-colors">
                      {box.name}
                    </h3>
                    <p className="text-[11px] text-[#A6A295] mt-1 leading-relaxed">
                      {box.material}
                    </p>
                    <div className="mt-3 font-mono text-xs text-[#D4AF37] font-semibold">
                      +₹{box.price} Packaging & Satin Ribbon
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: 4-Chamber Velvet Presentation Slot Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> 2. Fill the 4 Velvet Chambers ({slots.filter(Boolean).length}/4)
                </span>
                <span className="text-xs text-[#88847A]">Click any slot to swap or pick below</span>
              </div>

              {/* 4 Interactive Chambers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {slots.map((slot, index) => (
                  <div
                    key={`hamper-chamber-slot-${index}`}
                    className={`relative p-4 rounded-2xl border transition-all flex flex-col items-center justify-center min-h-[160px] text-center ${
                      slot
                        ? 'bg-[#151522]/90 border-[#D4AF37]/40 shadow-inner'
                        : 'bg-white/[0.02] border-dashed border-white/15'
                    }`}
                  >
                    <div className="absolute top-2 left-2.5 font-mono text-[9px] text-[#A6A295] tracking-widest uppercase">
                      Chamber 0{index + 1}
                    </div>

                    {slot ? (
                      <>
                        <button
                          onClick={() => handleRemoveSlot(index)}
                          className="absolute top-2 right-2 p-1 rounded-full text-[#88847A] hover:text-red-400 hover:bg-white/5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-16 h-16 flex items-center justify-center my-2">
                          <img
                            src={slot.image}
                            alt={slot.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-md"
                          />
                        </div>
                        <h4 className="font-serif text-xs font-bold text-[#FAF7EE] line-clamp-1">
                          {slot.name}
                        </h4>
                        <div className="text-[11px] font-mono text-[#D4AF37] mt-0.5">
                          ₹{slot.price}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#A6A295]">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] text-[#88847A] block">
                          Empty Chamber
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Catalog Selection Carousel */}
            <div className="space-y-2.5">
              <span className="text-xs text-[#C4C0B5] font-semibold block">
                Available Delicacies to Add:
              </span>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {PRODUCTS.slice(0, 10).map((product) => {
                  const isSelected = slots.some((s) => s?.id === product.id);
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        // Find first empty slot or replace slot 3
                        const emptyIdx = slots.findIndex((s) => s === null);
                        if (emptyIdx !== -1) {
                          handleSelectSlot(emptyIdx, product);
                        } else {
                          handleSelectSlot(3, product);
                        }
                      }}
                      className={`flex items-center gap-2.5 p-2 pr-3.5 rounded-xl border shrink-0 transition-all text-left ${
                        isSelected
                          ? 'border-[#D4AF37]/50 bg-[#D4AF37]/10'
                          : 'border-white/10 bg-[#12121C] hover:border-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-black/40 p-1 flex items-center justify-center shrink-0">
                        <img src={product.image} alt={product.name} className="max-h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#FAF7EE] line-clamp-1 max-w-[130px]">
                          {product.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#D4AF37]">₹{product.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Custom Calligraphy Gift Message */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#161624] to-[#12121C] border border-[#D4AF37]/25 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 3. Engraved Royal Calligraphy Note
                </label>
                <span className="text-[11px] text-[#A6A295]">Included complimentary</span>
              </div>

              <input
                type="text"
                value={customEngraving}
                onChange={(e) => setCustomEngraving(e.target.value)}
                maxLength={70}
                placeholder="e.g. For our esteemed partners at Singhania Estates"
                className="w-full bg-[#0A0A10] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
              />

              {/* Live Preview in Alex Brush Script font */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
                <span className="text-[9px] uppercase tracking-widest text-[#88847A] font-mono block">
                  Gold Letterpress Live Engraving:
                </span>
                <p className="font-script-luxury text-2xl sm:text-3xl text-[#D4AF37] leading-relaxed">
                  "{customEngraving || 'With Royal Warmth'}"
                </p>
                <span className="font-editorial italic text-xs text-[#A6A295] block">
                  Maison Araj • Est. 1985 Agra
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer with Total & Add to Bag */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0E0E18]/90 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#A6A295] uppercase tracking-wider block">Bespoke Hamper Total:</span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                  ₹{totalHamperPrice}
                </span>
                <span className="text-xs text-[#48BB78] font-semibold">
                  (Includes ₹{selectedBox.price} Presentation Box)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={closeHamper}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl glass-btn-secondary text-xs font-semibold text-[#DFDACD] hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleAddHamperToBag}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Bespoke Coffret to Bag</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
