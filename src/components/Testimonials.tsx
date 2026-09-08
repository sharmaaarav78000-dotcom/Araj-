import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { REVIEWS } from '../data/brand';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Voices of Distinction</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE]">
          Treasured by <span className="gold-gradient-text font-serif italic">Connoisseurs</span>
        </h2>
        <p className="text-sm sm:text-base text-[#B8B4A8] font-light">
          Real words from households, royal confectioners, and corporate clients across India.
        </p>
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map((rev, index) => (
          <motion.div
            key={rev.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="rounded-2xl p-6 glass-panel border border-white/10 hover:border-[#D4AF37]/40 hover:glass-panel-gold transition-all duration-300 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Stars & Verified */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#F5DE88]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F5DE88] text-[#F5DE88]" />
                  ))}
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-[#48BB78] font-medium bg-[#48BB78]/10 px-2 py-0.5 rounded-full border border-[#48BB78]/20">
                    <CheckCircle className="w-3 h-3" /> Verified Purchase
                  </span>
                )}
              </div>

              {/* Product reviewed */}
              <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                {rev.productName}
              </div>

              {/* Review Text */}
              <p className="text-sm text-[#DFDACD] leading-relaxed italic font-light">
                "{rev.comment}"
              </p>
            </div>

            {/* Author details */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="font-serif font-bold text-[#FAF7EE] block">
                  {rev.name}
                </span>
                <span className="text-[#88847A]">{rev.location}</span>
              </div>
              <span className="text-[11px] text-[#6A665D]">{rev.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
