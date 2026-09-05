import React, { createContext, useContext, useState, useCallback } from 'react';

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [scannedCount, setScannedCount] = useState(0);
  const [totalUSD, setTotalUSD] = useState(0);

  const addResult = useCallback((wallet) => {
    setResults(prev => {
      const exists = prev.find(w => w.privateKey === wallet.privateKey);
      if (exists) return prev;
      const updated = [...prev, wallet];
      setTotalUSD(t => t + wallet.totalUSD);
      return updated;
    });
  }, []);

  const incrementScanned = useCallback(() => {
    setScannedCount(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setResults([]);
    setScannedCount(0);
    setTotalUSD(0);
    setScanning(false);
  }, []);

  return (
    <WalletContext.Provider value={{ scanning, setScanning, results, addResult, scannedCount, incrementScanned, totalUSD, reset }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}