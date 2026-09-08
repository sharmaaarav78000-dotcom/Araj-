import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CheckCircle2, Truck, CreditCard, Banknote, 
  QrCode, ArrowLeft, ArrowRight, Sparkles, MapPin, Phone, Mail, User, Package
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cart, 
    cartTotal, 
    placeOrder
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingCharge = cartTotal >= 499 ? 0 : 50;
  const finalTotal = cartTotal + shippingCharge;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode) {
      alert('Please fill all required delivery details.');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const order = placeOrder({
        ...formData,
        paymentMethod
      });
      setPlacedOrder(order);
      setIsProcessing(false);
      setStep('success');
    }, 1200);
  };

  const resetAndClose = () => {
    closeCheckout();
    setStep('shipping');
    setPlacedOrder(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'success' ? resetAndClose : closeCheckout}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0F0F17] border border-[#D4AF37]/30 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#141420]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs tracking-widest text-[#D4AF37]">ARAJ COUTURE FOODS</span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-[#A6A295]">Express Secure Checkout</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7EE] mt-0.5">
                {step === 'shipping' && 'Delivery Information'}
                {step === 'payment' && 'Select Payment Method'}
                {step === 'success' && 'Order Placed Successfully!'}
              </h2>
            </div>

            <button
              onClick={step === 'success' ? resetAndClose : closeCheckout}
              className="p-2 rounded-full text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          {step !== 'success' && (
            <div className="px-6 py-3 bg-[#181826] border-b border-white/5 flex items-center justify-between text-xs">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#D4AF37] font-bold' : 'text-[#48BB78]'}`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center border border-current text-[11px]">
                  {step === 'payment' ? '✓' : '1'}
                </span>
                <span>Address</span>
              </div>
              <div className="w-12 h-px bg-white/15" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#D4AF37] font-bold' : 'text-[#88847A]'}`}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center border border-current text-[11px]">
                  2
                </span>
                <span>Payment</span>
              </div>
              <div className="w-12 h-px bg-white/15" />
              <div className="flex items-center gap-2 text-[#88847A]">
                <span className="w-5 h-5 rounded-full flex items-center justify-center border border-current text-[11px]">
                  3
                </span>
                <span>Confirmation</span>
              </div>
            </div>
          )}

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            
            {/* Step 1: Shipping Form */}
            {step === 'shipping' && (
              <form id="shipping-form" onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#DFDACD] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Vikramaditya Singhania"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#DFDACD] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#DFDACD] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> Email Address (For Order Tracking)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. vikram@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#DFDACD] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    placeholder="House/Villa No., Apartment/Street, Landmark"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#DFDACD]">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. New Delhi / Agra"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#DFDACD]">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other State</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#DFDACD]">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      placeholder="e.g. 282001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-[#161622] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Dispatch & Assurance note */}
                <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <p className="text-xs text-[#E1DACB]">
                    Dispatched from our Agra central facility with temperature-shielded packing. Standard delivery in 2–4 business days.
                  </p>
                </div>
              </form>
            )}

            {/* Step 2: Payment Options */}
            {step === 'payment' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  {/* UPI Option */}
                  <label
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'upi'
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                        : 'bg-[#161622] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-[#FAF7EE] text-sm flex items-center gap-2">
                          Instant UPI / Google Pay / PhonePe / Paytm
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#48BB78]/20 text-[#48BB78] font-bold">Fastest</span>
                        </div>
                        <span className="text-xs text-[#A6A295]">Scan QR or pay via any UPI app</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                      {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'cod'
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                        : 'bg-[#161622] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-[#FAF7EE] text-sm">
                          Cash on Delivery (COD)
                        </div>
                        <span className="text-xs text-[#A6A295]">Pay cash upon verified doorstep delivery</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                      {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </label>

                  {/* Credit / Debit Card */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'card'
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                        : 'bg-[#161622] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-[#FAF7EE] text-sm">
                          Credit / Debit Cards
                        </div>
                        <span className="text-xs text-[#A6A295]">Visa, MasterCard, RuPay, Amex</span>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-white/30'}`}>
                      {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </label>
                </div>

                {/* Delivery destination preview */}
                <div className="p-3.5 rounded-xl bg-[#161622] border border-white/10 text-xs text-[#DFDACD] space-y-1">
                  <div className="font-bold text-[#FAF7EE]">Delivering to:</div>
                  <div>{formData.name} • {formData.phone}</div>
                  <div className="text-[#A6A295]">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</div>
                </div>
              </div>
            )}

            {/* Step 3: Success Confirmation */}
            {step === 'success' && placedOrder && (
              <div className="text-center py-6 space-y-5">
                <div className="w-20 h-20 rounded-full bg-[#48BB78]/15 border border-[#48BB78]/30 mx-auto flex items-center justify-center text-[#48BB78]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">
                    Order Confirmed
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#FAF7EE] mt-1">
                    Thank You, {placedOrder.customer.name}!
                  </h3>
                  <p className="text-xs text-[#A6A295] mt-1">
                    Your luxury order has been received and scheduled for fresh batch packaging.
                  </p>
                </div>

                {/* Order Details Card */}
                <div className="p-4 rounded-2xl bg-[#161622] border border-white/10 text-left space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                    <span className="text-[#A6A295]">Order Reference ID:</span>
                    <strong className="font-mono text-[#D4AF37]">{placedOrder.id}</strong>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                    <span className="text-[#A6A295]">Payment Method:</span>
                    <span className="uppercase text-[#FAF7EE] font-semibold">{placedOrder.customer.paymentMethod}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                    <span className="text-[#A6A295]">Amount Paid:</span>
                    <strong className="text-[#FAF7EE] font-serif text-base">₹{placedOrder.total}</strong>
                  </div>

                  <div className="text-xs space-y-1 pt-1">
                    <div className="text-[#A6A295]">Shipping to:</div>
                    <div className="text-[#FAF7EE]">{placedOrder.customer.address}, {placedOrder.customer.city}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs text-[#E1DACB] flex items-center justify-center gap-2">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tracking updates will be sent to <strong>{placedOrder.customer.phone}</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-5 sm:p-6 border-t border-white/10 bg-[#141420] flex items-center justify-between">
            {step === 'shipping' && (
              <>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#B8B4A8] hover:text-white transition-colors"
                >
                  Return to Cart
                </button>
                <button
                  type="submit"
                  form="shipping-form"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 'payment' && (
              <>
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#B8B4A8] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:brightness-110 shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Securing Order...</span>
                  ) : (
                    <>
                      <span>PAY ₹{finalTotal} & CONFIRM</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}

            {step === 'success' && (
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg"
              >
                Continue Shopping
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
