import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  PackageCheck, 
  ShieldCheck, 
  Truck, 
  Store,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_INFO } from '../data/brand';
import { playLuxuryChime } from '../utils/sound';

export const DistributorModal: React.FC = () => {
  const { isDistributorModalOpen, closeDistributorModal, submitDistributorInquiry } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    state: 'Uttar Pradesh',
    businessType: 'distributor' as 'distributor' | 'wholesaler' | 'retailer' | 'caterer_hotel' | 'gift_reseller',
    expectedVolume: '50-100 kg/month',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isDistributorModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.businessName || !formData.phone || !formData.city) {
      return;
    }

    submitDistributorInquiry({
      fullName: formData.fullName,
      businessName: formData.businessName,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      state: formData.state,
      businessType: formData.businessType,
      expectedVolume: formData.expectedVolume,
      message: formData.message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeDistributorModal();
    }, 4000);
  };

  const whatsAppUrl = `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hello ARAJ Spices Agra! I am interested in B2B / Dealership & Wholesale for pure spices & dry fruits.\nName: ${formData.fullName || 'Business Owner'}\nBusiness: ${formData.businessName || 'Store'}\nCity: ${formData.city || 'India'}`
  )}`;

  return (
    <AnimatePresence>
      <div key="distributor-modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          key="distributor-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeDistributorModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          key="distributor-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#111119] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 my-8 overflow-hidden text-[#FAF7EE]"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeDistributorModal}
            className="absolute top-5 right-5 p-2 rounded-full glass-btn-icon text-[#A6A295] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#48BB78]/20 border border-[#48BB78]/40 text-[#48BB78] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Inquiry Received Successfully!
              </h3>
              <p className="text-sm text-[#DFDACD] max-w-md mx-auto">
                Thank you for your interest in partnering with ARAJ Agra. Our institutional sales team will review your requirements and reach out within 24 hours.
              </p>
              <div className="pt-4">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full glass-btn-emerald text-emerald-300 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer hover:brightness-110 shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Agra Factory on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5DE88] text-[11px] font-semibold uppercase tracking-wider">
                  <Store className="w-3 h-3 text-[#D4AF37]" />
                  <span>B2B Dealership &amp; Wholesale • थोक व वितरक व्यापार</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Partner with Agra’s Purest Spices &amp; Dry Fruits
                </h3>
                <p className="text-xs sm:text-sm text-[#B8B4A8]">
                  Direct factory pricing, AGMARK Grade quality, continuous supply, and high-margin retail support for grocers, distributors, caterers, and modern trade.
                </p>
              </div>

              {/* Value Propositions */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <div>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-white">100% AGMARK</p>
                  <p className="text-[9px] text-[#A6A295]">Tested Purity</p>
                </div>
                <div>
                  <PackageCheck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-white">Direct Mill Price</p>
                  <p className="text-[9px] text-[#A6A295]">Maximum Margins</p>
                </div>
                <div>
                  <Truck className="w-4 h-4 text-[#D4AF37] mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-white">Pan-India Freight</p>
                  <p className="text-[9px] text-[#A6A295]">Dispatched in 48h</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      Contact Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      Business / Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g. Sharma Kirana & General Stores"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      City &amp; District *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Agra, Mathura, Aligarh, Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      Business Type
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    >
                      <option value="distributor">Regional Distributor / Super Stockist</option>
                      <option value="wholesaler">Mandi Wholesaler / Trader</option>
                      <option value="retailer">Retail Kirana / Supermarket</option>
                      <option value="caterer_hotel">Hotel / Restaurant / Halwai / Caterer</option>
                      <option value="gift_reseller">Corporate &amp; Wedding Gift Reseller</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                      Monthly Expected Requirement
                    </label>
                    <select
                      value={formData.expectedVolume}
                      onChange={(e) => setFormData({ ...formData, expectedVolume: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none"
                    >
                      <option value="25-50 kg/month">Small Retailer (25 - 50 kg/mo)</option>
                      <option value="50-100 kg/month">Standard Store (50 - 100 kg/mo)</option>
                      <option value="100-500 kg/month">Wholesaler / Large Caterer (100 - 500 kg/mo)</option>
                      <option value="500+ kg/month">Exclusive District Distributor (500+ kg/mo)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-[#DFDACD] block mb-1">
                    Specific Products or Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your territory or preferred masalas/dry fruits..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1A1A26] border border-white/10 focus:border-[#D4AF37] text-xs sm:text-sm text-white outline-none resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl glass-btn-gold text-[#0E0E14] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Dealership Inquiry</span>
                  </button>

                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-5 rounded-xl glass-btn-emerald text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-110 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Instant WhatsApp</span>
                  </a>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
