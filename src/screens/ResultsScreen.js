import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { WalletContext } from '../context/WalletContext';

export default function ResultsScreen({ navigation }) {
  const { results } = useContext(WalletContext);

  const openExplorer = (item) => {
    if (item.eth?.address) Linking.openURL('https://etherscan.io/address/' + item.eth.address);
    else if (item.btc?.address) Linking.openURL('https://blockchain.info/address/' + item.btc.address);
    else if (item.bnb?.address) Linking.openURL('https://bscscan.com/address/' + item.bnb.address);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openExplorer(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.valueText}>${item.totalUSD.toFixed(2)}</Text>
      </View>
      {item.eth?.balance > 0 && <Text style={styles.balanceText}>ETH: {item.eth.balance.toFixed(6)} — {item.eth.address.slice(0, 10)}...</Text>}
      {item.btc?.balance > 0 && <Text style={styles.balanceText}>BTC: {item.btc.balance.toFixed(6)} — {item.btc.address.slice(0, 10)}...</Text>}
      {item.bnb?.balance > 0 && <Text style={styles.balanceText}>BNB: {item.bnb.balance.toFixed(6)} — {item.bnb.address.slice(0, 10)}...</Text>}
      <Text style={styles.privateText}>🔑 {item.privateKey.slice(0, 16)}...{item.privateKey.slice(-8)}</Text>
      <Text style={styles.tapHint}>👆 Tap to view on explorer</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>😴</Text>
          <Text style={styles.emptyText}>No wallets found yet</Text>
          <Text style={styles.emptySub}>Run a scan or import keys</Text>
          <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('Scan')}>
            <Text style={styles.scanBtnText}>⚡ Start Scan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item, i) => item.privateKey + i}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  list: { padding: 12 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2A2A4E' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  valueText: { fontSize: 18, fontWeight: 'bold', color: '#00FF88' },
  balanceText: { fontSize: 12, color: '#AAAACC', fontFamily: 'monospace', marginBottom: 2 },
  privateText: { fontSize: 11, color: '#FF8844', fontFamily: 'monospace', marginBottom: 4 },
  tapHint: { fontSize: 10, color: '#444466', marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, color: '#8888AA', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#444466', marginBottom: 20 },
  scanBtn: { backgroundColor: '#00FF88', borderRadius: 10, padding: 14, paddingHorizontal: 30 },
  scanBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0D0D1A' },
});