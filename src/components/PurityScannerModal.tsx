import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, Sparkles, Activity, Cpu, CheckCircle2, 
  RotateCcw, ShoppingBag, Eye, Award, FileText, Zap, ChevronRight 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { playLuxuryChime } from '../utils/sound';

export const PurityScannerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, scannedProduct, addToCart, openProductDetail } = useStore();
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  useEffect(() => {
    if (scannedProduct) {
      setSelectedItem(scannedProduct);
      triggerScan();
    } else if (PRODUCTS.length > 0) {
      setSelectedItem(PRODUCTS[0]);
    }
  }, [scannedProduct, isScannerOpen]);

  if (!isScannerOpen || !selectedItem) return null;

  const triggerScan = () => {
    setScanning(true);
    setScanProgress(0);
    playLuxuryChime('scan');

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        setScanProgress(100);
        setScanning(false);
        clearInterval(interval);
        playLuxuryChime('success');
      } else {
        setScanProgress(current);
      }
    }, 90);
  };

  // Botanical laboratory metrics derived deterministically from product
  const isSpice = selectedItem.category.toLowerCase().includes('spice') || selectedItem.tags.includes('SPICES');
  const primaryAlkaloid = isSpice 
    ? (selectedItem.name.includes('Pepper') ? 'Piperine Content' : selectedItem.name.includes('Turmeric') ? 'Curcumin Active' : 'Essential Volatile Terpenes')
    : 'Oleic Nutrient Density';
  
  const alkaloidValue = isSpice ? '99.4%' : '98.8%';
  const essentialOilIndex = isSpice ? '4.85 ml/100g' : '99.2% Unoxidized';
  const moistureLevel = '4.2% (Cryo-Locked)';
  const batchCode = `ARAJ-SPEC-1985-${selectedItem.id}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop with heavy blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeScanner}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window with Futuristic Glass Finish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-4xl glass-card-futuristic rounded-3xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]"
        >
          {/* Top Bar with HUD Grid lines */}
          <div className="p-4 sm:p-6 border-b border-white/10 bg-[#0E0E18]/80 backdrop-blur-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display-luxury text-[10px] sm:text-xs tracking-[0.25em] text-[#D4AF37] font-bold">
                    LABORATORY SPECTROMETRY SCANNER
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] bg-[#48BB78]/20 border border-[#48BB78]/40 text-[#48BB78] font-mono">
                    LIVE SYSTEM v4.2
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE] tracking-wide">
                  Cryogenic Molecular Purity Audit
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerScan}
                disabled={scanning}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-xs text-[#FAF7EE] hover:border-[#D4AF37]/50 transition-all cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-[#D4AF37] ${scanning ? 'animate-spin' : ''}`} />
                <span>Rescan Batch</span>
              </button>
              <button
                onClick={closeScanner}
                className="p-2 rounded-full text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close scanner"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Select Bar for other items */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#121220]/90 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[10px] uppercase tracking-wider text-[#A6A295] font-bold shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Select Batch:
            </span>
            {PRODUCTS.slice(0, 8).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedItem(p);
                  triggerScan();
                }}
                className={`px-3 py-1 rounded-lg shrink-0 transition-all text-[11px] font-medium ${
                  selectedItem.id === p.id
                    ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow-md'
                    : 'bg-white/[0.04] text-[#C4C0B5] hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Modal Main Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Holographic Laser Scan Visualizer */}
              <div className="lg:col-span-5 relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0B0B12]/80 border border-[#D4AF37]/25 overflow-hidden group">
                
                {/* Holographic Radar Circular Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-64 h-64 rounded-full border border-[#D4AF37] animate-ping" style={{ animationDuration: '4s' }} />
                  <div className="w-48 h-48 rounded-full border border-[#D4AF37]/50" />
                  <div className="w-32 h-32 rounded-full border border-dashed border-[#D4AF37]/40" />
                </div>

                {/* Laser scan line */}
                {scanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_15px_#D4AF37] animate-radar-sweep z-20" />
                )}

                {/* Botanical Image in Focus */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center z-10">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className={`max-h-full max-w-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-all duration-700 ${
                      scanning ? 'brightness-125 contrast-125 scale-105' : 'hover:scale-105'
                    }`}
                  />
                  {/* Floating target crosshairs */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
                </div>

                {/* HUD Spec Stamp below image */}
                <div className="mt-4 text-center z-10 space-y-1">
                  <span className="font-mono text-[10px] text-[#D4AF37] tracking-widest block">
                    {batchCode}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#FAF7EE]">
                    {selectedItem.name}
                  </h3>
                  <p className="font-editorial italic text-xs text-[#C8A856]">
                    "Estate Harvest • Cryo-milled at -28°C"
                  </p>
                </div>
              </div>

              {/* Right Column: Lab Audit Data & Telemetry */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Purity Coefficient Header */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-white/[0.03] to-transparent border border-[#D4AF37]/35 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#A6A295] block">
                      PURITY COEFFICIENT INDEX
                    </span>
                    <div className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7EE] flex items-baseline gap-2">
                      <span className="gold-gradient-text font-display-luxury">99.8%</span>
                      <span className="text-xs text-[#48BB78] font-sans font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Certified Pure
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#A6A295] block">
                      SCAN STATUS
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D4AF37]">
                      {scanning ? `ANALYZING ${scanProgress}%` : 'VERIFIED 100%'}
                    </span>
                  </div>
                </div>

                {/* 4 Key Laboratory Spectrometry Metrics */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  
                  {/* Metric 1 */}
                  <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[#A6A295]">
                      <span className="text-[11px] font-medium">{primaryAlkaloid}</span>
                      <Activity className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="font-mono text-base font-bold text-[#FAF7EE]">
                      {alkaloidValue}
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '99%' }} />
                    </div>
                    <span className="text-[9px] text-[#A6A295] block">Standard market avg: 65-72%</span>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[#A6A295]">
                      <span className="text-[11px] font-medium">Volatile Aromatic Oils</span>
                      <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="font-mono text-base font-bold text-[#FAF7EE]">
                      {essentialOilIndex}
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#48BB78] rounded-full" style={{ width: '96%' }} />
                    </div>
                    <span className="text-[9px] text-[#A6A295] block">Cryo-sealed terpene retention</span>
                  </div>

                  {/* Metric 3 */}
                  <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[#A6A295]">
                      <span className="text-[11px] font-medium">Synthetic Additives</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#48BB78]" />
                    </div>
                    <div className="font-mono text-base font-bold text-[#48BB78]">
                      0.00% (ZERO)
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#48BB78] rounded-full" style={{ width: '100%' }} />
                    </div>
                    <span className="text-[9px] text-[#A6A295] block">Zero starch, chalk, or artificial dyes</span>
                  </div>

                  {/* Metric 4 */}
                  <div className="p-3.5 rounded-2xl glass-panel border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-[#A6A295]">
                      <span className="text-[11px] font-medium">Moisture Content</span>
                      <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </div>
                    <div className="font-mono text-base font-bold text-[#FAF7EE]">
                      {moistureLevel}
                    </div>
                    <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: '94%' }} />
                    </div>
                    <span className="text-[9px] text-[#A6A295] block">Safe shelf stability up to 24 months</span>
                  </div>
                </div>

                {/* Master Spicer Tasting & Verification Seal */}
                <div className="p-4 rounded-2xl bg-[#141424]/90 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-[#FAF7EE] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Organoleptic Master Certification
                    </span>
                    <span className="font-script-luxury text-base text-[#D4AF37]">
                      Kaushal Reserve Seal
                    </span>
                  </div>
                  <p className="text-[#C4C0B5] text-[11px] leading-relaxed">
                    Harvested from verified single-origin partner plantations and low-temperature stone-milled in Rawatpara, Agra. Each batch undergoes multi-spectral chromatography and vacuum nitrogen flushing before sealed dispatch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer with Immediate Action */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-[#0E0E18]/90 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-baseline gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] text-[#A6A295] uppercase tracking-wider block">Price per pack:</span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7EE]">
                  ₹{selectedItem.price}
                </span>
              </div>
              {selectedItem.originalPrice > selectedItem.price && (
                <div className="text-xs text-[#88847A]">
                  <span className="line-through">₹{selectedItem.originalPrice}</span>
                  <span className="text-[#48BB78] font-bold ml-1.5">
                    {selectedItem.discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  closeScanner();
                  openProductDetail(selectedItem);
                }}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl glass-pill text-xs font-semibold text-[#DFDACD] hover:text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Full Culinary Dossier</span>
              </button>

              <button
                onClick={() => {
                  addToCart(selectedItem);
                  closeScanner();
                }}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Verified Batch to Bag</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
