import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Wifi,
  Zap,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const AndroidInstallModal: React.FC = () => {
  const { isInstallModalOpen, closeInstallModal, showToast } = useStore();
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'apk'>('direct');
  const [copied, setCopied] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isInstallModalOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://araj.in';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    showToast('App link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      const success = await install();
      setIsInstalling(false);
      if (success) {
        showToast('ARAJ App installed successfully on your Android phone!');
        closeInstallModal();
      }
    } else {
      // Fallback scroll or switch to guide
      setActiveTab('direct');
      showToast('Follow the 3 quick steps below to install on your Android device!');
    }
  };

  return (
    <AnimatePresence>
      <div key="android-install-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl">
        {/* Backdrop click to dismiss */}
        <div key="android-install-backdrop" className="fixed inset-0" onClick={closeInstallModal} />

        <motion.div
          key="android-install-dialog"
          initial={{ opacity: 0, scale: 0.95, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 25 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl glass-panel-gold border border-[#D4AF37]/45 shadow-[0_30px_90px_rgba(0,0,0,0.9)] p-5 sm:p-7 z-10 bg-[#0C0C12]"
        >
          {/* Close button */}
          <button
            onClick={closeInstallModal}
            aria-label="Close Android App Modal"
            className="absolute top-4 right-4 p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Showcase with App Icon */}
          <div className="flex items-start gap-4 pb-4 border-b border-white/10">
            {/* App Icon */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#161622] via-[#201D2B] to-[#161622] border-2 border-[#D4AF37]/60 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.3)] shrink-0 overflow-hidden">
              <img
                src="/images/logo.png"
                alt="ARAJ Logo"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#48BB78] ring-2 ring-[#0C0C12] animate-pulse" />
            </div>

            {/* App Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5DE88] text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-[#D4AF37]" /> Android & PWA App
                </span>
                <span className="text-[10px] text-[#A6A295]">v2.4.0</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF7EE] tracking-tight mt-1">
                ARAJ Dry Fruits & Spices
              </h2>
              <p className="text-xs text-[#B8B4A8] mt-0.5">
                Hand-crafted Pure Spices & Luxury Dry Fruits • Agra, Since 1985
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 pb-3">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'direct'
                  ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                  : 'glass-btn-pill text-[#DFDACD] hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Direct Android Install</span>
            </button>
            <button
              onClick={() => setActiveTab('apk')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'apk'
                  ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                  : 'glass-btn-pill text-[#DFDACD] hover:text-white'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>APK & Play Store</span>
            </button>
          </div>

          {/* Tab 1: Direct Android Install */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              {/* Primary 1-Click Action Button */}
              {isInstalled ? (
                <div className="p-3.5 rounded-2xl bg-[#48BB78]/15 border border-[#48BB78]/40 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#48BB78] shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-[#FAF7EE]">App Already Installed</p>
                    <p className="text-[#B8B4A8]">
                      ARAJ is already running as an installed standalone app on your device!
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleTriggerInstall}
                  disabled={isInstalling}
                  className="w-full group relative py-3.5 px-6 rounded-2xl glass-btn-gold text-[#0A0A0E] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer"
                >
                  <Download className="w-4.5 h-4.5 text-[#0A0A0E] group-hover:-translate-y-0.5 transition-transform" />
                  <span>
                    {isInstalling
                      ? 'Installing...'
                      : isInstallable
                      ? 'INSTALL ON ANDROID NOW'
                      : 'DOWNLOAD / ADD TO HOME SCREEN'}
                  </span>
                </button>
              )}

              {/* Four Key Native Benefits */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl glass-panel border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FAF7EE]">Instant Launch</p>
                    <p className="text-[10px] text-[#A6A295]">Full-screen app mode</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl glass-panel border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FAF7EE]">Offline Ready</p>
                    <p className="text-[10px] text-[#A6A295]">Browse products offline</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl glass-panel border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FAF7EE]">Ultra Light</p>
                    <p className="text-[10px] text-[#A6A295]">&lt; 3 MB total storage</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl glass-panel border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#FAF7EE]">WhatsApp Sync</p>
                    <p className="text-[10px] text-[#A6A295]">1-Tap order dispatch</p>
                  </div>
                </div>
              </div>

              {/* 3 Step Visual Guide for Android Phones */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> 3-Step Installation on Android Phone
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-[#DFDACD]">
                      Open <strong>Google Chrome</strong> or <strong>Samsung Internet</strong> on your Android phone and load this store.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="text-[#DFDACD]">
                      Tap the <strong>three vertical dots (⋮)</strong> menu in the upper right corner of Chrome.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-[#DFDACD]">
                      Tap <strong>"Install app"</strong> (or <strong>"Add to Home screen"</strong>). The ARAJ icon will appear on your phone's home screen &amp; app drawer!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: APK & Google Play Store Package */}
          {activeTab === 'apk' && (
            <div className="space-y-3.5 text-xs text-[#DFDACD]">
              <div className="p-3 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[#FAF7EE] text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Google Play Store Publishing Guide
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#48BB78]/20 text-[#48BB78] font-mono font-semibold">Ready</span>
                </div>
                <p className="text-[#B8B4A8] mt-1 text-xs leading-relaxed">
                  ARAJ is 100% compliant with Google's <strong>Trusted Web Activity (TWA)</strong> standard. You can package and publish this exact app to Google Play Store in 4 simple steps:
                </p>
              </div>

              {/* 4-Step Play Store Roadmap */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
                    <span className="font-bold text-[#FAF7EE]">Generate Android App Bundle (.aab)</span>
                  </div>
                  <p className="text-[#A6A295] text-[11px] pl-6 leading-relaxed">
                    Open <a href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noreferrer" className="text-[#D4AF37] underline font-medium hover:text-[#FAF7EE]">PWABuilder.com</a>, click <strong>"Package for Android"</strong>, and download your signed Google Play <code>.aab</code> bundle and signing key.
                  </p>
                </div>

                <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
                    <span className="font-bold text-[#FAF7EE]">Create Play Console Developer Account</span>
                  </div>
                  <p className="text-[#A6A295] text-[11px] pl-6 leading-relaxed">
                    Sign in to <a href="https://play.google.com/console" target="_blank" rel="noreferrer" className="text-[#D4AF37] underline font-medium hover:text-[#FAF7EE]">Google Play Console</a> (one-time $25 USD registration fee) and click <strong>"Create App"</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
                    <span className="font-bold text-[#FAF7EE]">Upload .aab & Store Assets</span>
                  </div>
                  <p className="text-[#A6A295] text-[11px] pl-6 leading-relaxed">
                    Upload the generated <code>.aab</code> to <em>Production</em> or <em>Internal Testing</em>. Add the 512×512 icon (provided below) and app screenshots.
                  </p>
                </div>

                <div className="p-3 rounded-xl glass-panel border border-white/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#0A0A0E] font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
                    <span className="font-bold text-[#FAF7EE]">Digital Asset Links Verification</span>
                  </div>
                  <p className="text-[#A6A295] text-[11px] pl-6 leading-relaxed">
                    The store is already pre-configured to serve <code>/.well-known/assetlinks.json</code> so Android recognizes your Play Store app and hides browser address bars.
                  </p>
                </div>
              </div>

              {/* Quick Copy Store Listing Details */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <p className="font-bold text-[#D4AF37] text-[11px] uppercase tracking-wider">
                  Copy-Paste Store Listing Metadata
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-[#88847A] block">App Name (up to 30 chars):</span>
                    <span className="text-[#FAF7EE] font-mono bg-white/5 px-2 py-0.5 rounded block select-all">ARAJ Dry Fruits & Spices</span>
                  </div>
                  <div>
                    <span className="text-[#88847A] block">Short Description (up to 80 chars):</span>
                    <span className="text-[#FAF7EE] font-mono bg-white/5 px-2 py-0.5 rounded block select-all">Pure stone-ground spices, luxury dry fruits & royal hampers since 1985.</span>
                  </div>
                  <div>
                    <span className="text-[#88847A] block">Package ID:</span>
                    <span className="text-[#FAF7EE] font-mono bg-white/5 px-2 py-0.5 rounded block select-all">com.araj.dryfruits</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://www.pwabuilder.com?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl glass-btn-gold text-[#0A0A0E] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PWABuilder (1-Click AAB)</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="py-2.5 px-4 rounded-xl glass-btn-secondary text-[#FAF7EE] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#48BB78]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  <span>{copied ? 'Copied!' : 'Copy Store URL'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A6A295]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Certified PWA Standard
            </span>
            <span>Compatible with all Android 8.0+ devices</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
