import React, { createContext, useState, useContext } from 'react';
const WalletContext = createContext();
export function WalletProvider({ children }) {
  const [foundWallets, setFoundWallets] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [stats, setStats] = useState({ totalScanned: 0, ethFound: 0, btcFound: 0, bnbFound: 0, totalValue: 0 });
  const addFoundWallet = (wallet) => { setFoundWallets(prev => { const exists = prev.find(w => w.address === wallet.address); if (exists) return prev; return [wallet, ...prev]; }); };
  const resetScan = () => { setFoundWallets([]); setScanning(false); setProgress({ current: 0, total: 0 }); setStats({ totalScanned: 0, ethFound: 0, btcFound: 0, bnbFound: 0, totalValue: 0 }); };
  return (<WalletContext.Provider value={{ foundWallets, setFoundWallets, scanning, setScanning, progress, setProgress, stats, setStats, addFoundWallet, resetScan }}>{children}</WalletContext.Provider>);
}
export function useWallet() { return useContext(WalletContext); }