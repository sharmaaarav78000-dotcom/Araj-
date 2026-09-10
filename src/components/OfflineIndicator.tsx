import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2 rounded-2xl bg-[#C53030]/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-red-400/30 animate-pulse">
      <WifiOff className="w-4 h-4 text-white" />
      <span>Offline Mode — Cached catalogue available</span>
    </div>
  );
};
