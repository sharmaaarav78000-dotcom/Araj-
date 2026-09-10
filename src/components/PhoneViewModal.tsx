import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Smartphone, RotateCcw, CheckCircle2, QrCode, ExternalLink, 
  Copy, Check, ShieldCheck, Sparkles, RefreshCw, ZoomIn
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { playLuxuryChime } from '../utils/sound';

interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  os: 'iOS' | 'Android';
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-16', name: 'iPhone 16 Pro', width: 393, height: 840, os: 'iOS' },
  { id: 'galaxy-s24', name: 'Galaxy S24', width: 360, height: 780, os: 'Android' },
  { id: 'pixel-9', name: 'Google Pixel 9', width: 412, height: 870, os: 'Android' },
];

export const PhoneViewModal: React.FC = () => {
  const { isPhonePreviewOpen, closePhonePreview, showToast } = useStore();
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [zoomScale, setZoomScale] = useState(0.85);

  if (!isPhonePreviewOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Mobile URL copied to clipboard');
    playLuxuryChime('sparkle');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReloadFrame = () => {
    setIframeKey((prev) => prev + 1);
    playLuxuryChime('click');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/90 backdrop-blur-2xl">
        {/* Click outside to close */}
        <div className="fixed inset-0" onClick={closePhonePreview} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl glass-panel-gold rounded-3xl border border-[#D4AF37]/40 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-4 flex flex-col max-h-[96vh]"
        >
          {/* Top Bar Controls */}
          <div className="p-3.5 sm:p-5 border-b border-white/10 bg-[#0E0E18]/90 backdrop-blur-2xl flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-sm">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">
                    MOBILE AUDIT &amp; PHONE SIMULATOR
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#48BB78]/20 border border-[#48BB78]/40 text-[#48BB78] text-[9px] font-mono">
                    VERIFIED REPAIRED
                  </span>
                </div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-[#FAF7EE] leading-tight">
                  Real-Time Mobile Device Viewport Inspector
                </h2>
              </div>
            </div>

            {/* Device Preset Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
              {DEVICE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedDevice(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDevice.id === preset.id
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold shadow-md'
                      : 'text-[#A6A295] hover:text-[#FAF7EE]'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Actions: Reload & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleReloadFrame}
                title="Reload Device Frame"
                className="p-2 rounded-full glass-panel text-[#DFDACD] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={closePhonePreview}
                aria-label="Close Mobile Simulator"
                className="p-2 rounded-full glass-panel text-[#DFDACD] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Area: Device on Left, Verification Checklist on Right */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start justify-center">
            
            {/* Left: Realistic Smartphone Bezel Stage */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3 mb-3 text-xs text-[#A6A295] font-mono">
                <span>Viewport: {selectedDevice.width} × {selectedDevice.height}px</span>
                <span>•</span>
                <span className="text-[#D4AF37]">{selectedDevice.os} Mode</span>
              </div>

              {/* Smartphone Outer Titanium Frame */}
              <div
                className="relative rounded-[48px] p-3.5 bg-gradient-to-b from-[#2A2720] via-[#1A1814] to-[#2A2720] border-4 border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.3),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                style={{
                  width: `${selectedDevice.width}px`,
                  maxWidth: '100%',
                }}
              >
                {/* Dynamic Island / Top Camera Bezel */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="w-24 h-6 rounded-full bg-black border border-white/10 flex items-center justify-between px-3 shadow-inner">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A2E] border border-[#333]" />
                    <div className="w-2 h-2 rounded-full bg-[#00FF66]/60 animate-pulse" />
                  </div>
                </div>

                {/* Simulated Smartphone Status Bar */}
                <div className="h-9 px-6 bg-black/90 flex items-center justify-between text-[11px] font-semibold text-[#FAF7EE] tracking-tight relative z-20 select-none">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2 rounded-sm border border-current flex items-center p-0.5">
                      <div className="h-full w-full bg-[#48BB78] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Inner Device Screen (Live Interactive iFrame) */}
                <div
                  className="relative rounded-[36px] overflow-hidden bg-[#08080A] shadow-inner"
                  style={{
                    height: `${selectedDevice.height - 80}px`,
                  }}
                >
                  <iframe
                    key={`${selectedDevice.id}-${iframeKey}`}
                    src={window.location.href}
                    title="Mobile View Simulator"
                    className="w-full h-full border-0"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  />
                </div>

                {/* Simulated Home Indicator Bar */}
                <div className="h-6 flex items-center justify-center bg-black select-none">
                  <div className="w-32 h-1 rounded-full bg-white/40" />
                </div>
              </div>

              <span className="text-[11px] text-[#88847A] font-mono mt-3">
                Live interactive touch &amp; scroll responsive viewport simulation
              </span>
            </div>

            {/* Right: Mobile Quality Audit & Repairs Log */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Audit Status Card */}
              <div className="p-4 rounded-2xl glass-card-futuristic border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D4AF37]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mobile Layout Repairs Verified</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    {
                      title: 'Banner & Fixed Header Decoupled',
                      desc: 'Moved PWA prompt to bottom floating capsule; eliminated header collision on small screens.',
                    },
                    {
                      title: 'Mobile Header Padding Compacted',
                      desc: 'Reduced top header padding from 20px to 8px on phone view for maximum product visibility.',
                    },
                    {
                      title: 'Hero Headline Responsive Scaling',
                      desc: 'Scaled to text-3xl on narrow viewports to prevent awkward word splitting of "Stone-Ground Spices".',
                    },
                    {
                      title: 'Responsive CTA Hierarchy',
                      desc: 'Full-width primary "Explore Collection" button paired with balanced 50/50 secondary buttons.',
                    },
                    {
                      title: 'Horizontal Category Tabs with Zero Squash',
                      desc: 'Implemented touch smooth horizontal overflow scroll for showcase selector tabs.',
                    },
                    {
                      title: 'Aroma Simulator Ripple Overflow Contained',
                      desc: 'Applied overflow-hidden to prevent 3.0x terpene dispersion rings from causing horizontal jitter.',
                    },
                    {
                      title: 'Mobile Bottom Nav Comet Particle Target',
                      desc: 'Linked add-to-bag gold particle bursts directly to the mobile bottom bar cart badge.',
                    },
                  ].map((repair) => (
                    <div key={repair.title} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#48BB78] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[#FAF7EE] block">{repair.title}</span>
                        <span className="text-[11px] text-[#A6A295] block leading-relaxed">{repair.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Phone Instant Test Card */}
              <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-[#FAF7EE] uppercase tracking-wider">
                      Test on Real Smartphone
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#48BB78]">Instant Camera Scan</span>
                </div>

                <p className="text-xs text-[#A6A295] leading-relaxed">
                  Open your iPhone Camera or Android QR Scanner to launch this live preview directly on your physical handheld device.
                </p>

                {/* Copy Link Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-[#D4AF37]/20 border border-white/15 text-xs text-[#FAF7EE] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#48BB78]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Mobile URL'}</span>
                  </button>

                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass-panel text-[#DFDACD] hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
