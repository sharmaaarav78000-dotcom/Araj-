import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Package, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Sparkles, ExternalLink 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_INFO } from '../data/brand';

export const AccountModal: React.FC = () => {
  const { isAccountOpen, closeAccount, orders } = useStore();

  if (!isAccountOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAccount}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#0F0F17] border border-[#D4AF37]/35 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#141420]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE]">
                  Client Sanctuary
                </h2>
                <span className="text-xs text-[#A6A295]">
                  Order history & Concierge Support
                </span>
              </div>
            </div>

            <button
              onClick={closeAccount}
              className="p-2 rounded-full text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Orders Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D4AF37]" /> Your Orders ({orders.length})
                </span>
                <span className="text-[11px] text-[#A6A295]">Synced locally</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-2">
                  <Package className="w-8 h-8 text-[#A6A295] mx-auto opacity-40" />
                  <p className="text-xs text-[#FAF7EE] font-medium">No prior orders recorded</p>
                  <p className="text-[11px] text-[#88847A]">
                    When you place orders through our portal, receipts and tracking will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-white/10">
                        <div>
                          <span className="text-[#A6A295]">Order </span>
                          <strong className="font-mono text-[#D4AF37]">{order.id}</strong>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-[#48BB78]/20 text-[#48BB78] font-bold text-[10px] uppercase">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-[#DFDACD]">
                            <span>{item.quantity}x {item.product.name} ({item.product.weight})</span>
                            <span>₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 font-bold">
                        <span className="text-[#A6A295]">Total Amount</span>
                        <span className="text-[#FAF7EE]">₹{order.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Support Concierge */}
            <div className="space-y-3">
              <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Araj Concierge & Support
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#88847A] text-[10px]">Call Support</div>
                    <div className="text-[#FAF7EE] font-medium">{BRAND_INFO.phone}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[#88847A] text-[10px]">Email Support</div>
                    <div className="text-[#FAF7EE] font-medium truncate">{BRAND_INFO.email}</div>
                  </div>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[#88847A] text-[10px]">Headquarters & Tasting Room</div>
                  <div className="text-[#FAF7EE] font-medium">{BRAND_INFO.address}</div>
                  <div className="text-[#A6A295] text-[11px]">Visiting Hours: 10:00 AM – 8:00 PM IST</div>
                </div>
              </div>
            </div>

            {/* Quality Seal */}
            <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <div className="text-xs text-[#E1DACB]">
                <strong className="text-[#FAF7EE] block font-serif">Araj Authenticity Seal</strong>
                Certified 100% natural, adulterant-free, directly sourced from prime agricultural regions across India and the globe.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
