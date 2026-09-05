import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import ResultsScreen from './screens/ResultsScreen';
import ImportScreen from './screens/ImportScreen';
import { WalletProvider } from './context/WalletContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <WalletProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: { backgroundColor: '#0D0D1A', elevation: 0 },
              headerTintColor: '#00FF88',
              headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
              cardStyle: { backgroundColor: '#0D0D1A' },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🔍 Wallet Seeker' }} />
            <Stack.Screen name="Scan" component={ScanScreen} options={{ title: '⚡ Scanning' }} />
            <Stack.Screen name="Results" component={ResultsScreen} options={{ title: '💰 Found Wallets' }} />
            <Stack.Screen name="Import" component={ImportScreen} options={{ title: '📥 Import Keys' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D1A' },
});