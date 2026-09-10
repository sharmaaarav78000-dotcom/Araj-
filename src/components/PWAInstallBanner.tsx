import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Download, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { openInstallModal } = useStore();
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('araj_pwa_banner_dismissed');
      if (isDismissed === 'true') {
        setDismissed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('araj_pwa_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        openInstallModal();
      }
    } else {
      openInstallModal();
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="App Download Banner"
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-sm z-40 glass-panel-gold rounded-2xl p-3 border border-[#D4AF37]/50 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#F5DE88] p-0.5 shrink-0 flex items-center justify-center text-[#0A0A0E] shadow-md">
              <Smartphone className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[#FAF7EE] text-xs leading-tight truncate">
                ARAJ Mobile App
              </span>
              <span className="text-[#DFDACD] text-[10px] truncate">
                1-tap ordering &amp; offline shopping
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[11px] font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss banner"
              className="p-1 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
