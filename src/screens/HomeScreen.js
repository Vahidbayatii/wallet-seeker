import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useWallet } from '../context/WalletContext';
export default function HomeScreen({ navigation }) {
  const { stats, foundWallets } = useWallet();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}><Text style={styles.heroTitle}>🔐 Wallet Seeker</Text><Text style={styles.heroSub}>Find lost crypto wallets with balance</Text></View>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: '#627EEA' }]}><Text style={styles.statLabel}>ETH</Text><Text style={[styles.statValue, { color: '#627EEA' }]}>{stats.ethFound}</Text></View>
        <View style={[styles.statCard, { borderColor: '#F7931A' }]}><Text style={styles.statLabel}>BTC</Text><Text style={[styles.statValue, { color: '#F7931A' }]}>{stats.btcFound}</Text></View>
        <View style={[styles.statCard, { borderColor: '#F0B90B' }]}><Text style={styles.statLabel}>BNB</Text><Text style={[styles.statValue, { color: '#F0B90B' }]}>{stats.bnbFound}</Text></View>
      </View>
      <View style={styles.valueBox}><Text style={styles.valueLabel}>💰 Total Found Value</Text><Text style={styles.valueAmount}>${stats.totalValue.toFixed(2)}</Text></View>
      <View style={styles.scannedBox}><Text style={styles.scannedText}><Text style={styles.scannedNum}>{stats.totalScanned.toLocaleString()}</Text>{'\n'}wallets scanned</Text></View>
      <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scan')}><Text style={styles.scanBtnText}>⚡ Start Scanning</Text></TouchableOpacity>
      <TouchableOpacity style={styles.importBtn} onPress={() => navigation.navigate('Import')}><Text style={styles.importBtnText}>📥 Import Private Keys</Text></TouchableOpacity>
      {foundWallets.length > 0 && (<TouchableOpacity style={styles.resultsBtn} onPress={() => navigation.navigate('Results')}><Text style={styles.resultsBtnText}>📂 View Results ({foundWallets.length})</Text></TouchableOpacity>)}
      <Text style={styles.footer}>Powered by WormGPT ⚡ v1.0</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  content: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 16 },
  hero: { alignItems: 'center', marginBottom: 24 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#00FF88', marginBottom: 6 },
  heroSub: { fontSize: 14, color: '#8888AA', textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#1A1A2E', borderRadius: 12, padding: 14, marginHorizontal: 4, alignItems: 'center', borderWidth: 1 },
  statLabel: { fontSize: 12, color: '#8888AA', marginBottom: 4 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  valueBox: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 20, width: '100%', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#00FF88' },
  valueLabel: { fontSize: 14, color: '#8888AA', marginBottom: 8 },
  valueAmount: { fontSize: 32, fontWeight: 'bold', color: '#00FF88' },
  scannedBox: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 20 },
  scannedText: { fontSize: 14, color: '#8888AA', textAlign: 'center' },
  scannedNum: { fontSize: 28, fontWeight: 'bold', color: '#00FF88' },
  scanBtn: { backgroundColor: '#00FF88', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12 },
  scanBtnText: { fontSize: 18, fontWeight: 'bold', color: '#0D0D1A' },
  importBtn: { backgroundColor: '#1A1A2E', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#627EEA' },
  importBtnText: { fontSize: 16, color: '#627EEA', fontWeight: '600' },
  resultsBtn: { backgroundColor: '#2D1A2E', borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#00FF88' },
  resultsBtnText: { fontSize: 16, color: '#00FF88', fontWeight: '600' },
  footer: { fontSize: 12, color: '#444466', marginTop: 20 },
});