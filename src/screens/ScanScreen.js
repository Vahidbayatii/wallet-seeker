import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { WalletContext } from '../context/WalletContext';
import { scanPrivateKey, generateRandomHex } from '../engine/scanner';

export default function ScanScreen({ navigation }) {
  const { addResult, incrementScanned } = useContext(WalletContext);
  const [scanning, setScanning] = useState(false);
  const [keysScanned, setKeysScanned] = useState(0);
  const [found, setFound] = useState(0);

  const startScan = async () => {
    setScanning(true);
    setKeysScanned(0);
    setFound(0);

    for (let i = 0; i < 200; i++) {
      if (!scanning && i > 0) break;
      try {
        const pk = generateRandomHex();
        const result = await scanPrivateKey(pk);
        setKeysScanned(prev => prev + 1);
        incrementScanned();
        if (result.found) {
          setFound(prev => prev + 1);
          addResult(result);
        }
        await new Promise(r => setTimeout(r, 500));
      } catch {}
    }
    setScanning(false);
  };

  const stopScan = () => {
    setScanning(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>⚡ Scanning Random Keys</Text>
        <Text style={styles.subtitle}>Generating random private keys and checking ETH, BTC, BNB balances</Text>

        <View style={styles.statsBox}>
          <View style={styles.statRow}>
            <Text style={styles.statKey}>Keys Scanned</Text>
            <Text style={styles.statVal}>{keysScanned.toLocaleString()}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statKey}>Wallets Found</Text>
            <Text style={[styles.statVal, { color: '#FFD700' }]}>{found}</Text>
          </View>
        </View>

        {!scanning ? (
          <TouchableOpacity style={styles.startButton} onPress={startScan}>
            <Text style={styles.startText}>▶ Start Scan</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopScan}>
            <Text style={styles.stopText}>⏹ Stop Scan</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.resultsLink} onPress={() => navigation.navigate('Results')}>
          <Text style={styles.resultsLinkText}>📂 View Found Wallets</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#00FF88', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#8888AA', marginBottom: 24 },
  statsBox: {
    backgroundColor: 'rgba(13,13,26,0.9)', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#333', marginBottom: 20,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  statKey: { color: '#888888', fontSize: 14 },
  statVal: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  startButton: {
    backgroundColor: '#00FF88', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 30, marginBottom: 12,
  },
  startText: { color: '#0D0D1A', fontSize: 18, fontWeight: 'bold' },
  stopButton: {
    backgroundColor: '#FF3355', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 30, marginBottom: 12,
  },
  stopText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  resultsLink: {
    alignItems: 'center', borderWidth: 1, borderColor: '#00FF8844',
    borderRadius: 12, paddingVertical: 12,
  },
  resultsLinkText: { color: '#00FF88', fontSize: 14, fontWeight: '600' },
});