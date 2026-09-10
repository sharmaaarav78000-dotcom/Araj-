import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { CategoryFilter, SortOption } from '../types';
import { playLuxuryChime } from '../utils/sound';

const CATEGORIES: CategoryFilter[] = [
  'ALL',
  'DRY FRUITS',
  'SPICES',
  'NUTS',
  'SEEDS',
  'GIFT PACKS',
];

export const ShopCatalog: React.FC = () => {
  const { products, activeCategory, setActiveCategory } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [selectedWeight, setSelectedWeight] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Available weights from catalog
  const weights = ['all', '100g', '200g', '250g', '400g', '500g', '600g', '1kg'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category match
        if (activeCategory !== 'ALL' && !p.tags.includes(activeCategory as any)) {
          return false;
        }
        // Search match
        if (localSearch.trim()) {
          const q = localSearch.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        // Price match
        if (p.price > priceRange) return false;

        // Weight match
        if (selectedWeight !== 'all') {
          if (!p.weight.toLowerCase().includes(selectedWeight.toLowerCase())) {
            return false;
          }
        }

        // Rating match
        if (minRating > 0 && p.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'discount':
            return (b.discountPercentage || 0) - (a.discountPercentage || 0);
          case 'newest':
            return b.id.localeCompare(a.id);
          case 'featured':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, activeCategory, localSearch, priceRange, selectedWeight, minRating, selectedSort]);

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setLocalSearch('');
    setSelectedSort('featured');
    setPriceRange(2000);
    setSelectedWeight('all');
    setMinRating(0);
    playLuxuryChime('click');
  };

  const isFiltered =
    activeCategory !== 'ALL' ||
    localSearch !== '' ||
    priceRange < 2000 ||
    selectedWeight !== 'all' ||
    minRating > 0;

  return (
    <section id="catalog" className="relative py-10 sm:py-16 px-3.5 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Harvest</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE]">
          The <span className="gold-gradient-text font-serif italic">Araj</span> Collection
        </h2>
        <p className="text-sm sm:text-base text-[#B8B4A8] font-light tracking-wide">
          Exceptional ingredients. Timeless taste.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              id={`cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                setActiveCategory(cat);
                playLuxuryChime('click');
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] border-[#D4AF37] shadow-[0_4px_18px_rgba(212,175,55,0.4)]'
                  : 'glass-panel border-white/10 text-[#DFDACD] hover:text-[#FFF] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Search, Filters toggle, Sorting, Result count */}
      <div className="rounded-2xl glass-panel p-4 mb-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6A295]" />
          <input
            type="text"
            placeholder="Search spices, almonds, cashews..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-[#14141E]/80 border border-white/15 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-[#FAF7EE] placeholder-[#88847A] focus:outline-none focus:border-[#D4AF37] transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88847A] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting and Filters Options */}
        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFiltersMobile((prev) => !prev)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-[#FAF7EE]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A6A295] hidden sm:inline flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-[#D4AF37]" /> Sort By:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as SortOption)}
              className="bg-[#14141E] border border-white/15 rounded-xl px-3 py-2 text-xs text-[#FAF7EE] focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="featured">Featured Selections</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest Additions</option>
            </select>
          </div>

          {/* Reset Filters Pill */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 ml-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Extended Glass Filters Panel (Collapsible on Mobile, always accessible) */}
      <div className={`mb-8 p-4 rounded-2xl glass-panel border border-white/10 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-xs">
          {/* Price Range Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[#A6A295]">
              <span>Max Price</span>
              <span className="text-[#FAF7EE] font-semibold">Up to ₹{priceRange}</span>
            </div>
            <input
              type="range"
              min={65}
              max={1800}
              step={25}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#D4AF37] bg-white/10 h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Weight Filter */}
          <div className="space-y-1.5">
            <span className="text-[#A6A295] block">Pack Weight</span>
            <div className="flex flex-wrap gap-1.5">
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider text-[10px] font-semibold transition-all ${
                    selectedWeight === w
                      ? 'bg-[#D4AF37] text-[#0A0A0E]'
                      : 'bg-white/[0.05] text-[#DFDACD] hover:bg-white/10'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-1.5">
            <span className="text-[#A6A295] block">Minimum Rating</span>
            <div className="flex gap-2">
              {[0, 4.0, 4.5, 4.8].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    minRating === r
                      ? 'bg-[#D4AF37] text-[#0A0A0E]'
                      : 'bg-white/[0.05] text-[#DFDACD] hover:bg-white/10'
                  }`}
                >
                  {r === 0 ? 'All' : `${r}★ & up`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-[#A6A295] px-1">
        <span>
          Showing <strong className="text-[#FAF7EE] font-semibold">{filteredProducts.length}</strong> authentic products
        </span>
        <span className="text-[#D4AF37] flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3" /> 100% Genuine Araj Guarantee
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center rounded-3xl glass-panel border border-white/10 space-y-4">
          <Search className="w-10 h-10 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="font-serif text-2xl font-bold text-[#FAF7EE]">
            No matching harvest found
          </h3>
          <p className="text-sm text-[#A6A295] max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to explore our full collection of dry fruits, spices, and gifting packs.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
