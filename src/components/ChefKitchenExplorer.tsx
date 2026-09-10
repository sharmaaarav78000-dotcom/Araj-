import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, ChefHat, Check, ShoppingBag, ArrowRight, Flame, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playLuxuryChime } from '../utils/sound';

interface RecipePairing {
  id: string;
  title: string;
  hindiTitle: string;
  category: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Chef Secret';
  chefQuote: string;
  icon: string;
  spiceIds: string[];
}

const RECIPE_PAIRINGS: RecipePairing[] = [
  {
    id: 'chana-masala',
    title: 'Agra Special Chana Masala',
    hindiTitle: 'आगरा का चटपटा चना मसाला',
    category: 'North Indian Heritage',
    prepTime: '25 Mins',
    difficulty: 'Easy',
    chefQuote: 'Roast soaked chickpeas with freshly ground Dhaniya and our signature Chana Masala blend; finish with a dash of pure Amchur and roasted Heeng Jeera for the true Agra bazaar taste.',
    icon: '🍲',
    spiceIds: ['SPC-3', 'SPC-2', 'SPC-47', 'SPC-16']
  },
  {
    id: 'shahi-biryani',
    title: 'Royal Mughlai Dum Biryani',
    hindiTitle: 'शाही मुग़लई दम बिरयानी',
    category: 'Royal Festive Feast',
    prepTime: '45 Mins',
    difficulty: 'Chef Secret',
    chefQuote: 'Layer long-grain basmati with slow-ground Garam Masala and Kashmiri Lal Mirch for radiant natural saffron hue without artificial dyes, garnished with toasted almonds.',
    icon: '🍛',
    spiceIds: ['SPC-10', 'SPC-12', 'SPC-1', 'DF-1']
  },
  {
    id: 'dal-swad',
    title: 'Dhaba Dal Swad & Makhani',
    hindiTitle: 'दाल स्वाद व दाल मखनी',
    category: 'Comfort Classic',
    prepTime: '20 Mins',
    difficulty: 'Easy',
    chefQuote: 'Gently crush hand-harvested Kasturi Methi between your palms into sizzling golden turmeric tadka to unlock fragrant volatile oils that elevate simple yellow lentils to royal status.',
    icon: '🥘',
    spiceIds: ['SPC-9', 'SPC-53', 'SPC-4']
  },
  {
    id: 'pav-bhaji',
    title: 'Street Pav Bhaji & Chaat',
    hindiTitle: 'पाव भाजी व चटपटा चाट',
    category: 'Tangy Street Soul',
    prepTime: '30 Mins',
    difficulty: 'Medium',
    chefQuote: 'Our Pav Bhaji blend and Chatpata Chat Masala contain pure rock salts and dry mango. Use rare yellow chilli powder for subtle fiery depth that keeps your bhaji vibrant.',
    icon: '🫓',
    spiceIds: ['SPC-15', 'SPC-5', 'SPC-19']
  },
  {
    id: 'shahi-paneer',
    title: 'Velvet Shahi Paneer & Subzi',
    hindiTitle: 'शाही पनीर व किचन किंग सब्जी',
    category: 'Mughal Heritage',
    prepTime: '25 Mins',
    difficulty: 'Medium',
    chefQuote: 'Blend soaked ARAJ premium cashews into your tomato gravy and stir in Shahi Paneer Masala and Kitchen King for a velvety, restaurant-style aromatic curry.',
    icon: '🧀',
    spiceIds: ['SPC-18', 'SPC-13', 'DF-2']
  },
  {
    id: 'masala-chai',
    title: 'Kadak Masala Chai & Doodh',
    hindiTitle: 'कड़क मसाला चाय व बादाम दूध',
    category: 'Immunity & Warmth',
    prepTime: '10 Mins',
    difficulty: 'Easy',
    chefQuote: 'Infuse stone-ground Sonth (ginger powder) and cracked black pepper with crushed fennel in boiling milk for soothing digestion and authentic North Indian morning cheer.',
    icon: '☕',
    spiceIds: ['SPC-11', 'SPC-8', 'SPC-1', 'DF-4']
  }
];

export const ChefKitchenExplorer: React.FC = () => {
  const { products, addToCart, showToast } = useStore();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('chana-masala');
  const [addedAll, setAddedAll] = useState<boolean>(false);

  const currentRecipe = RECIPE_PAIRINGS.find((r) => r.id === selectedRecipeId) || RECIPE_PAIRINGS[0];

  // Resolve matching product records
  const pairingProducts = currentRecipe.spiceIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  const bundleTotal = pairingProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleOriginal = pairingProducts.reduce((sum, p) => sum + p.originalPrice, 0);

  const handleAddAllToCart = () => {
    pairingProducts.forEach((p) => {
      addToCart(p, 1);
    });
    setAddedAll(true);
    playLuxuryChime('add');
    showToast(`Added all ${pairingProducts.length} pairing spices for "${currentRecipe.title}" to bag!`);
    setTimeout(() => setAddedAll(false), 3000);
  };

  return (
    <section id="chef-kitchen" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#D4AF37]/15 to-transparent blur-[140px] pointer-events-none" />

      {/* Header matching Munshi Panna Masale culinary inspiration */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/35 text-[#F5DE88] text-xs font-semibold tracking-wider uppercase">
          <ChefHat className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Apne Andar Ke Chef Ko Jagao! • अपने अंदर के शेफ को जगाओ</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF7EE] leading-tight">
          Master Authentic Recipes with <br className="hidden sm:inline" />
          <span className="gold-gradient-text font-serif italic">Agra's Pure Stone-Ground Spices</span>
        </h2>

        <p className="text-sm sm:text-base text-[#DFDACD] max-w-2xl mx-auto leading-relaxed">
          The soul of every unforgettable Indian dish lies in the purity of its spices. Explore time-tested chef pairings made with slow-milled, unadulterated masalas without artificial colours or fillers.
        </p>
      </div>

      {/* Dish Selection Grid / Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-10">
        {RECIPE_PAIRINGS.map((recipe) => {
          const isSelected = recipe.id === selectedRecipeId;
          return (
            <button
              key={recipe.id}
              id={`chef-tab-${recipe.id}`}
              onClick={() => {
                setSelectedRecipeId(recipe.id);
                setAddedAll(false);
                playLuxuryChime('click');
              }}
              className={`p-3 sm:p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-b from-[#D4AF37]/25 to-[#1A1A24] border-[#D4AF37] shadow-[0_8px_25px_rgba(212,175,55,0.25)] scale-[1.02]'
                  : 'bg-[#12121A]/80 hover:bg-[#1A1A24]/90 border-white/10 hover:border-[#D4AF37]/30'
              }`}
            >
              <div className="text-2xl sm:text-3xl mb-2">{recipe.icon}</div>
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#D4AF37] font-semibold">
                  {recipe.prepTime}
                </p>
                <h4 className={`text-xs sm:text-sm font-bold line-clamp-1 ${isSelected ? 'text-[#FFF]' : 'text-[#DFDACD]'}`}>
                  {recipe.title}
                </h4>
                <p className="text-[10px] text-[#A6A295] font-hindi line-clamp-1 mt-0.5">
                  {recipe.hindiTitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Recipe Stage & Spice Pairing Cards */}
      <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#13131D]/95 to-[#0A0A10]/95 p-6 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Recipe Narrative & Chef Note */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5DE88] text-[10px] font-mono uppercase tracking-wider">
                  {currentRecipe.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#A6A295] text-[10px] font-mono">
                  Diff: {currentRecipe.difficulty}
                </span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE]">
                {currentRecipe.title}
              </h3>
              <p className="text-sm font-medium text-[#D4AF37] font-hindi">
                {currentRecipe.hindiTitle}
              </p>
            </div>

            {/* Chef's Secret Quote Box */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/25 relative">
              <div className="flex items-start gap-3">
                <Utensils className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs uppercase font-bold tracking-wider text-[#F5DE88] mb-1">
                    Chef’s Secret Technique (रसोई का राज)
                  </h5>
                  <p className="text-xs sm:text-sm text-[#DFDACD] italic leading-relaxed">
                    "{currentRecipe.chefQuote}"
                  </p>
                </div>
              </div>
            </div>

            {/* 1-Click Bundle Buy Box */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-[#A6A295] uppercase font-mono block">
                  All {pairingProducts.length} Pairing Spices Set
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-[#FFF]">
                    ₹{bundleTotal}
                  </span>
                  <span className="text-sm text-[#88847A] line-through font-mono">
                    ₹{bundleOriginal}
                  </span>
                  <span className="text-[11px] font-bold text-[#48BB78] bg-[#48BB78]/15 px-2 py-0.5 rounded-md">
                    Save ₹{bundleOriginal - bundleTotal}
                  </span>
                </div>
              </div>

              <button
                id={`add-all-spices-${currentRecipe.id}`}
                onClick={handleAddAllToCart}
                className={`px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  addedAll
                    ? 'bg-[#48BB78] text-white shadow-[0_0_20px_rgba(72,187,120,0.5)]'
                    : 'bg-gradient-to-r from-[#D4AF37] to-[#E69C36] hover:from-[#E69C36] hover:to-[#D4AF37] text-[#0A0A0F] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                }`}
              >
                {addedAll ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Spice Set to Bag (सेट खरीदें)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Spice Cards included in pairing */}
          <div className="lg:col-span-7">
            <h4 className="text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Essential Spices in This Blend (शामिल शुद्ध मसाले)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pairingProducts.map((spice) => (
                <div
                  key={spice.id}
                  className="rounded-2xl p-3.5 bg-[#171724]/90 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#F8F5EE] p-1.5 flex items-center justify-center shrink-0 border border-white/20 shadow-md">
                    <img
                      src={spice.image}
                      alt={spice.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-[#D4AF37] block font-bold">
                      {spice.weight}
                    </span>
                    <h5 className="font-bold text-xs sm:text-sm text-[#FAF7EE] truncate">
                      {spice.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#FAF7EE]">
                        ₹{spice.price}
                      </span>
                      <span className="text-[10px] text-[#88847A] line-through">
                        ₹{spice.originalPrice}
                      </span>
                      <span className="text-[9px] text-[#48BB78] font-bold">
                        50% OFF
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(spice, 1);
                      playLuxuryChime('add');
                    }}
                    title={`Add ${spice.name} to cart`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0E0E14] transition-colors shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
