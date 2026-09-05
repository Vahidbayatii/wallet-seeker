import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { checkAllBalances } from '../engine/checker';
export default function ImportScreen({ navigation }) {
  const { addFoundWallet, setStats, stats } = useWallet();
  const [keys, setKeys] = useState('');
  const [checking, setChecking] = useState(false);
  const handleImport = async () => {
    const lines = keys.trim().split('\n').filter(l => l.trim());
    if (lines.length === 0) { Alert.alert('Empty', 'Paste at least one private key'); return; }
    setChecking(true);
    let found = 0;
    for (let i = 0; i < lines.length; i++) {
      const pk = lines[i].trim();
      const result = await checkAllBalances(pk);
      if (result) { addFoundWallet(result); found++; setStats(prev => ({ ...prev, ethFound: prev.ethFound + (result.network === 'ETH' ? 1 : 0), btcFound: prev.btcFound + (result.network === 'BTC' ? 1 : 0), bnbFound: prev.bnbFound + (result.network === 'BNB' ? 1 : 0), totalValue: prev.totalValue + result.value })); }
    }
    setChecking(false);
    Alert.alert('Done', `Checked ${lines.length} keys\nFound ${found} with balance`);
    navigation.navigate('Results');
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📥 Import Private Keys</Text>
      <Text style={styles.subtitle}>Paste one key per line (hex or WIF format)</Text>
      <TextInput style={styles.input} multiline placeholder={'0xabc123...\n0xdef456...\n5Jb3f... (WIF)'} placeholderTextColor="#444466" value={keys} onChangeText={setKeys} autoCapitalize="none" autoCorrect={false} />
      <TouchableOpacity style={[styles.checkBtn, checking && styles.checkBtnDisabled]} onPress={handleImport} disabled={checking}><Text style={styles.checkBtnText}>{checking ? '⏳ Checking...' : '🔍 Check Balances'}</Text></TouchableOpacity>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00FF88', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#8888AA', marginBottom: 16 },
  input: { backgroundColor: '#111122', borderRadius: 8, padding: 14, minHeight: 180, color: '#00FF88', fontFamily: 'monospace', fontSize: 13, borderWidth: 1, borderColor: '#2A2A4E', marginBottom: 16, textAlignVertical: 'top' },
  checkBtn: { backgroundColor: '#627EEA', borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 12 },
  checkBtnDisabled: { opacity: 0.5 },
  checkBtnText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  backBtn: { alignItems: 'center', padding: 10 },
  backBtnText: { fontSize: 14, color: '#627EEA' },
});