import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openProductDetail, addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const popularSearches = [
    'Chana Masala',
    'Haldi',
    'Garam Masala',
    'Badam',
    'Kaju',
    'Kishmish',
    'Gifting Box',
    'Hing'
  ];

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase();
    return PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSearch}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Search Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          className="relative w-full max-w-2xl bg-[#0F0F17] border border-[#D4AF37]/35 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Input Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#141420]">
            <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search authentic spices, dry fruits, gift boxes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm sm:text-base text-[#FAF7EE] placeholder-[#88847A] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#88847A] hover:text-white text-xs p-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-1.5 rounded-full text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions / Results */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
            {!searchTerm ? (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#A6A295] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#DFDACD] hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-[#A6A295]">
                  Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} for "{searchTerm}"
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-8 text-center text-sm text-[#A6A295]">
                    No matching products found. Try searching for spices, dry fruits, or gift boxes.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
                        onClick={() => {
                          openProductDetail(product);
                          closeSearch();
                        }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-12 h-12 rounded-xl bg-white/[0.05] p-1 shrink-0 flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm font-bold text-[#FAF7EE] group-hover:text-[#D4AF37] transition-colors truncate">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#A6A295]">
                              <span>{product.weight}</span>
                              <span>•</span>
                              <span className="capitalize">{product.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0 pl-2">
                          <span className="font-serif font-bold text-sm text-[#FAF7EE]">
                            ₹{product.price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              closeSearch();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0A0A0E] text-xs font-bold hover:brightness-110"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
