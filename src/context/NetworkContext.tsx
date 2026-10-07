import React, { createContext, useContext, useState, useEffect } from 'react';

interface NetworkContextType {
  isOnline: boolean;
  isLowBandwidth: boolean;
  setLowBandwidth: (val: boolean) => void;
  toggleLowBandwidth: () => void;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  isLowBandwidth: false,
  setLowBandwidth: () => {},
  toggleLowBandwidth: () => {},
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tamil_buddy_low_bandwidth');
      if (saved !== null) return JSON.parse(saved);

      // Auto-detect slow connections
      const conn = (navigator as any).connection;
      if (conn) {
        if (conn.saveData) return true;
        if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') return true;
      }
    } catch {
      // Ignore
    }
    return false;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage('🟢 Back Online');
      setTimeout(() => setToastMessage(null), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage("📡 You're offline — Local lessons and cached audio available");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLowBandwidth = (val: boolean) => {
    setIsLowBandwidth(val);
    try {
      localStorage.setItem('tamil_buddy_low_bandwidth', JSON.stringify(val));
    } catch {}
  };

  const toggleLowBandwidth = () => {
    setLowBandwidth(!isLowBandwidth);
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isLowBandwidth,
        setLowBandwidth,
        toggleLowBandwidth,
      }}
    >
      {children}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl shadow-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
            isOnline
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white border border-amber-500'
          }`}
        >
          <span>{toastMessage}</span>
          {!isOnline && (
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs text-amber-200 hover:text-white underline ml-2"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
