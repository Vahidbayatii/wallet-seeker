import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { scanEngine } from '../engine/scanner';
export default function ScanScreen({ navigation }) {
  const { scanning, setScanning, progress, setProgress, stats, setStats, addFoundWallet, resetScan } = useWallet();
  const [log, setLog] = useState([]);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const stopRef = useRef(false);
  useEffect(() => {
    const pulse = Animated.loop(Animated.sequence([Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }), Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })]));
    pulse.start(); return () => pulse.stop();
  }, []);
  const startScan = async () => {
    resetScan(); stopRef.current = false; setScanning(true); setLog([]);
    const onProgress = (current, total, wallet) => {
      setProgress({ current, total });
      if (wallet) { addFoundWallet(wallet); setLog(prev => [`✅ ${wallet.network} | ${wallet.address.slice(0,10)}... | $${wallet.value.toFixed(2)}`, ...prev].slice(0, 50)); setStats(prev => ({ ...prev, totalScanned: current, ethFound: prev.ethFound + (wallet.network === 'ETH' ? 1 : 0), btcFound: prev.btcFound + (wallet.network === 'BTC' ? 1 : 0), bnbFound: prev.bnbFound + (wallet.network === 'BNB' ? 1 : 0), totalValue: prev.totalValue + wallet.value })); }
      else { if (current % 100 === 0) setLog(prev => [`⏳ Scanned ${current.toLocaleString()} wallets...`, ...prev].slice(0, 50)); setStats(prev => ({ ...prev, totalScanned: current })); }
    };
    const result = await scanEngine(10000, onProgress, stopRef);
    setScanning(false); setLog(prev => [result > 0 ? `🎉 Found ${result} wallet(s)!` : '😴 No wallets with balance found.', ...prev]);
  };
  const stopScan = () => { stopRef.current = true; setScanning(false); };
  return (
    <View style={styles.container}>
      <View style={styles.radarContainer}><Animated.View style={[styles.radarDot, { opacity: pulseAnim }]} /><Text style={styles.radarText}>{scanning ? 'SCANNING...' : 'READY'}</Text></View>
      <View style={styles.progressContainer}><View style={styles.progressBg}><View style={[styles.progressFill, { width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' }]} /></View><Text style={styles.progressText}>{progress.current.toLocaleString()} / {progress.total.toLocaleString()}</Text></View>
      <View style={styles.statsRow}><Text style={styles.statItem}>🔍 {stats.totalScanned.toLocaleString()}</Text><Text style={[styles.statItem, { color: '#00FF88' }]}>💰 {stats.totalValue.toFixed(2)}$</Text></View>
      <View style={styles.logContainer}>{log.map((entry, i) => (<Text key={i} style={styles.logEntry}>{entry}</Text>))}{log.length === 0 && (<Text style={styles.logEmpty}>{scanning ? '⏳ Generating keys & checking balances...' : 'Press START to begin scanning'}</Text>)}</View>
      {!scanning ? (<TouchableOpacity style={styles.startBtn} onPress={startScan}><Text style={styles.startBtnText}>▶ START SCAN</Text></TouchableOpacity>) : (<TouchableOpacity style={styles.stopBtn} onPress={stopScan}><Text style={styles.stopBtnText}>⏹ STOP</Text></TouchableOpacity>)}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A', padding: 16 },
  radarContainer: { alignItems: 'center', marginVertical: 20 },
  radarDot: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00FF88', marginBottom: 10 },
  radarText: { fontSize: 18, fontWeight: 'bold', color: '#00FF88', letterSpacing: 3 },
  progressContainer: { marginBottom: 16 },
  progressBg: { height: 6, backgroundColor: '#1A1A2E', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#00FF88', borderRadius: 3 },
  progressText: { fontSize: 12, color: '#8888AA', textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  statItem: { fontSize: 16, fontWeight: 'bold', color: '#8888AA' },
  logContainer: { flex: 1, backgroundColor: '#111122', borderRadius: 8, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#1A1A2E' },
  logEntry: { fontSize: 11, color: '#00FF88', fontFamily: 'monospace', marginBottom: 2 },
  logEmpty: { fontSize: 12, color: '#444466', textAlign: 'center', marginTop: 40 },
  startBtn: { backgroundColor: '#00FF88', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 },
  startBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0D0D1A' },
  stopBtn: { backgroundColor: '#FF4444', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 10 },
  stopBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  backBtn: { alignItems: 'center', padding: 10 },
  backBtnText: { fontSize: 14, color: '#627EEA' },
});