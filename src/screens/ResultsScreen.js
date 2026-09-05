import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useWallet } from '../context/WalletContext';
export default function ResultsScreen({ navigation }) {
  const { foundWallets } = useWallet();
  const openExplorer = (wallet) => { let url; if (wallet.network === 'ETH') url = `https://etherscan.io/address/${wallet.address}`; else if (wallet.network === 'BTC') url = `https://blockchain.info/address/${wallet.address}`; else if (wallet.network === 'BNB') url = `https://bscscan.com/address/${wallet.address}`; if (url) Linking.openURL(url); };
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openExplorer(item)}>
      <View style={styles.cardHeader}><Text style={[styles.networkBadge, { color: item.network === 'ETH' ? '#627EEA' : item.network === 'BTC' ? '#F7931A' : '#F0B90B' }]}>{item.network}</Text><Text style={styles.valueText}>${item.value.toFixed(2)}</Text></View>
      <Text style={styles.addressText}>{item.address}</Text>
      <Text style={styles.privateText}>🔑 {item.privateKey.slice(0, 20)}...{item.privateKey.slice(-8)}</Text>
      <Text style={styles.tapHint}>👆 Tap to view on explorer</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>{foundWallets.length === 0 ? (
      <View style={styles.empty}><Text style={styles.emptyIcon}>😴</Text><Text style={styles.emptyText}>No wallets found yet</Text><Text style={styles.emptySub}>Run a scan or import keys</Text><TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scan')}><Text style={styles.scanBtnText}>⚡ Start Scan</Text></TouchableOpacity></View>
    ) : (<FlatList data={foundWallets} renderItem={renderItem} keyExtractor={(item) => item.address} contentContainerStyle={styles.list} />)}</View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  list: { padding: 12 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A4E' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  networkBadge: { fontSize: 16, fontWeight: 'bold' },
  valueText: { fontSize: 16, fontWeight: 'bold', color: '#00FF88' },
  addressText: { fontSize: 12, color: '#8888AA', fontFamily: 'monospace', marginBottom: 4 },
  privateText: { fontSize: 11, color: '#FF8844', fontFamily: 'monospace', marginBottom: 4 },
  tapHint: { fontSize: 10, color: '#444466', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, color: '#8888AA', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#444466', marginBottom: 20 },
  scanBtn: { backgroundColor: '#00FF88', borderRadius: 10, padding: 14, paddingHorizontal: 30 },
  scanBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0D0D1A' },
});