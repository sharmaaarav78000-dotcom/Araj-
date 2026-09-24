import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, CheckCircle2, Truck, CreditCard, Banknote, 
  QrCode, ArrowLeft, ArrowRight, Sparkles, MapPin, Phone, Mail, User, Package, MessageCircle, ExternalLink
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo, Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    cart, 
    cartTotal, 
    placeOrder,
    user,
    userProfile,
    loginWithGoogle,
    isAuthLoading,
    showToast,
    openAccount
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [formError, setFormError] = useState<string | null>(null);
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

  // Pre-fill user information if available
  React.useEffect(() => {
    if (user || userProfile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || userProfile?.displayName || user?.displayName || '',
        email: prev.email || user?.email || '',
        phone: prev.phone || userProfile?.phone || '',
        address: prev.address || userProfile?.address || '',
      }));
    }
  }, [user, userProfile]);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');

  if (!isCheckoutOpen) return null;

  const shippingCharge = cartTotal >= 499 ? 0 : 50;
  const finalTotal = cartTotal + shippingCharge;

  const generateWhatsAppUrl = (order: Order) => {
    const itemsList = order.items
      .map((item, index) => `${index + 1}. *${item.product.name}* (${item.product.weight || 'Standard'}) - Qty: ${item.quantity} - ₹${item.product.price * item.quantity}`)
      .join('\n');

    const message = `🛍️ *NEW ORDER - ARAJ DRY FRUITS & SPICES*
━━━━━━━━━━━━━━━━━━━━━
*Order ID:* ${order.id}
*Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}

📦 *ITEMS ORDERED:*
${itemsList}

💰 *Subtotal:* ₹${order.subtotal}
🚚 *Shipping:* ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
🏷️ *Total Price:* ₹${order.total}
💳 *Payment Mode:* ${order.customer.paymentMethod.toUpperCase()}

📍 *CUSTOMER & DELIVERY ADDRESS:*
*Name:* ${order.customer.name}
*Phone:* ${order.customer.phone}
*Email:* ${order.customer.email || 'N/A'}
*Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
${order.customer.notes ? `*Delivery Instructions:* ${order.customer.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━
_Order placed via official ARAJ website._`;

    const targetPhone = '919917104448';
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.pincode.trim()) {
      const errMsg = 'Please fill all required delivery details (Name, Phone, Address, PIN Code).';
      setFormError(errMsg);
      showToast(errMsg);
      return;
    }
    setFormError(null);
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

      // Generate WhatsApp order message and URL for 9917104448
      const waLink = generateWhatsAppUrl(order);
      setWhatsAppUrl(waLink);
      showToast('Order confirmed! Automatically redirecting to WhatsApp (+91 9917104448)...');

      // Automatically redirect to WhatsApp at +91 9917104448 with order details
      setTimeout(() => {
        try {
          window.location.href = waLink;
        } catch (err) {
          console.warn('Auto redirect navigation warning:', err);
        }
      }, 1200);
    }, 1200);
  };

  const resetAndClose = () => {
    closeCheckout();
    setStep('shipping');
    setPlacedOrder(null);
  };

  return (
    <AnimatePresence>
      <div key="checkout-modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          key="checkout-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'success' ? resetAndClose : closeCheckout}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          key="checkout-container"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0F0F17] border border-[#D4AF37]/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 my-4 sm:my-8 max-h-[92vh] flex flex-col"
        >
          {/* Top Bar */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#141420]">
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
              className="p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white"
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

                {/* Gmail Express Autofill Banner */}
                {user ? (
                  <div className="p-3 rounded-xl bg-[#48BB78]/10 border border-[#48BB78]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#48BB78]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="text-[#FAF7EE] font-medium">
                        Patron details auto-filled from your account ({user.email})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#48BB78] uppercase font-bold">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                    <div className="text-xs text-left">
                      <span className="text-[#FAF7EE] font-semibold block">Have a Gmail account?</span>
                      <span className="text-[11px] text-[#A6A295]">1-Click Sign-In to auto-fill address &amp; sync tracking</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => loginWithGoogle()}
                      disabled={isAuthLoading}
                      className="py-1.5 px-3 rounded-lg bg-white hover:bg-gray-100 text-gray-900 text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow border border-gray-200"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                      <span>Sign In with Gmail</span>
                    </button>
                  </div>
                )}

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

                {/* WhatsApp Order Dispatch Card */}
                <div className="p-4 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/40 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#25D366] font-bold text-xs uppercase tracking-wider">
                      <MessageCircle className="w-4 h-4 animate-bounce" />
                      <span>Automatically Redirecting to WhatsApp...</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] font-bold">
                      +91 99171 04448
                    </span>
                  </div>
                  <p className="text-xs text-[#E1DACB] leading-relaxed">
                    Order confirmed! We are automatically opening WhatsApp to send your complete order summary (Order ID, item list, total amount, and delivery address) to ARAJ Spices at <strong>+91 99171 04448</strong>.
                  </p>
                  {/* Subtle animated bar */}
                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-[#25D366] h-full w-full animate-pulse" />
                  </div>
                  {whatsAppUrl && (
                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                      <a
                        href={whatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          try {
                            window.location.href = whatsAppUrl;
                          } catch {}
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-black font-extrabold text-xs cursor-pointer shadow-lg hover:brightness-105 transition-all"
                      >
                        <MessageCircle className="w-4 h-4 fill-black text-[#25D366]" />
                        <span>Open WhatsApp Chat (+91 99171 04448)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <span className="text-[10px] text-[#A6A295]">
                        Click if WhatsApp does not open automatically
                      </span>
                    </div>
                  )}
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
                  className="px-4 py-2.5 rounded-xl glass-btn-secondary text-xs text-[#B8B4A8] hover:text-white cursor-pointer"
                >
                  Return to Cart
                </button>
                <button
                  type="submit"
                  form="shipping-form"
                  className="px-6 py-3 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
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
                  className="px-4 py-2.5 rounded-xl glass-btn-secondary text-xs text-[#B8B4A8] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePlaceOrder}
                  className="px-6 py-3 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  type="button"
                  onClick={() => {
                    resetAndClose();
                    openAccount();
                  }}
                  className="flex-1 py-3.5 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Package className="w-4 h-4" />
                  <span>Track Real-Time Status</span>
                </button>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="py-3.5 px-6 rounded-xl glass-btn-secondary text-[#DFDACD] hover:text-white font-medium text-xs uppercase tracking-wider cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
