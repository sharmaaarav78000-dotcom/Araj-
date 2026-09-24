import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, 
  Sparkles, Tag, Check 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    cartSubtotal, 
    cartDiscount,
    openCheckout,
    showToast
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'ARAJ1985' || couponCode.trim().toUpperCase() === 'FESTIVE') {
      setAppliedCoupon(couponCode.trim().toUpperCase());
      showToast('Promo code applied successfully!');
    } else {
      showToast('Invalid coupon code. Try ARAJ1985');
    }
  };

  const couponDiscount = appliedCoupon ? Math.round(cartTotal * 0.1) : 0;
  const finalPayable = Math.max(0, cartTotal - couponDiscount);
  const shippingCharge = cartTotal >= freeShippingThreshold || cartTotal === 0 ? 0 : 50;

  return (
    <AnimatePresence>
      <div key="cart-drawer-wrapper" className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          key="cart-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart}
          className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
          <motion.div
            key="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-[#0D0D14] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#11111B]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#D4AF37]/15 text-[#D4AF37]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#FAF7EE]">
                    Your Shopping Bag
                  </h2>
                  <span className="text-xs text-[#A6A295]">
                    {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="px-6 py-3 bg-[#161622] border-b border-white/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#DFDACD]">
                  {remainingForFreeShipping > 0 ? (
                    <>Add <strong className="text-[#D4AF37]">₹{remainingForFreeShipping}</strong> more for Free Shipping</>
                  ) : (
                    <span className="text-[#48BB78] font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> You qualified for FREE Express Delivery!
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-[#A6A295] uppercase font-bold">
                  {Math.round(progressToFreeShipping)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#48BB78] transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-[#D4AF37]">
                    <ShoppingBag className="w-8 h-8 opacity-40" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#FAF7EE]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#A6A295] max-w-xs">
                    Explore our authentic dry fruits, stone-ground spices, and luxury festive gift boxes.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-2 px-6 py-2.5 rounded-full glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
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
                          ₹{product.price * quantity}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[11px] text-[#88847A] line-through">
                            ₹{product.originalPrice * quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stepper and Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#88847A] hover:text-[#E53E3E] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center rounded-lg bg-white/[0.06] border border-white/10 p-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 rounded hover:bg-white/10 text-[#FAF7EE]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#FAF7EE]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 rounded hover:bg-white/10 text-[#FAF7EE]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 sm:p-6 border-t border-white/10 bg-[#11111B] space-y-4">
                
                {/* Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A6A295]" />
                    <input
                      type="text"
                      placeholder="Coupon: try ARAJ1985"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-[#1A1A26] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-[#FAF7EE] uppercase placeholder:normal-case placeholder-[#88847A] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl glass-btn-secondary text-xs font-bold text-[#FAF7EE] cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-xs text-[#48BB78] bg-[#48BB78]/10 px-3 py-1.5 rounded-lg border border-[#48BB78]/20">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Coupon '{appliedCoupon}' active (10% Off)
                    </span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-[#E53E3E] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#B8B4A8]">
                    <span>Original MRP Total:</span>
                    <span>₹{cartSubtotal}</span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-[#48BB78]">
                      <span>Instant Store Discount:</span>
                      <span>-₹{cartDiscount}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-[#48BB78]">
                      <span>Promo Discount:</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#B8B4A8]">
                    <span>Shipping Charges:</span>
                    <span>{shippingCharge === 0 ? <strong className="text-[#48BB78]">FREE</strong> : `₹${shippingCharge}`}</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm sm:text-base">
                    <span className="font-serif font-bold text-[#FAF7EE]">Grand Total:</span>
                    <span className="font-serif text-xl font-bold text-[#F5DE88]">
                      ₹{finalPayable + shippingCharge}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  id="cart-proceed-checkout-btn"
                  onClick={openCheckout}
                  className="w-full py-3.5 rounded-xl glass-btn-gold text-[#0A0A0E] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#A6A295]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>100% Secure Checkout • Cash on Delivery & UPI Supported</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
