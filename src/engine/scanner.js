import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
const API = { ETH: 'https://api.etherscan.io/api', BTC: 'https://chain.api.btc.com/v3', BNB: 'https://api.bscscan.com/api' };
const API_KEY_ETH = 'YourEtherscanApiKey';
const API_KEY_BNB = 'YourBscscanApiKey';
let prices = { eth: 0, btc: 0, bnb: 0 };
async function fetchPrices() {
  try { const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,binancecoin&vs_currencies=usd', { timeout: 6000 }); prices.eth = data.ethereum?.usd || 0; prices.btc = data.bitcoin?.usd || 0; prices.bnb = data.binancecoin?.usd || 0; } catch {}
}
function generateRandomHex(bytes = 32) { const arr = new Uint8Array(bytes); crypto.getRandomValues(arr); return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join(''); }
function generateWIF() { const keyBytes = new Uint8Array(32); crypto.getRandomValues(keyBytes); const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(keyBytes)); return keyPair.toWIF(); }
function deriveEthAddress(pk) { try { const k = pk.startsWith('0x') ? pk : '0x' + pk; return new ethers.Wallet(k).address; } catch { return null; } }
function deriveBtcAddress(wif) { try { const kp = bitcoin.ECPair.fromWIF(wif); return bitcoin.payments.p2pkh({ pubkey: kp.publicKey }).address; } catch { return null; } }
function deriveBnbAddress(pk) { return deriveEthAddress(pk); }
async function checkEthBalance(addr) { try { const { data } = await axios.get(API.ETH, { params: { module: 'account', action: 'balance', address: addr, tag: 'latest', apikey: API_KEY_ETH }, timeout: 8000 }); if (data.status === '1') return parseFloat(data.result) / 1e18; return 0; } catch { return 0; } }
async function checkBtcBalance(addr) { try { const { data } = await axios.get(`${API.BTC}/address/${addr}`, { timeout: 8000 }); if (data.data) return data.data.balance / 1e8; return 0; } catch { return 0; } }
async function checkBnbBalance(addr) { try { const { data } = await axios.get(API.BNB, { params: { module: 'account', action: 'balance', address: addr, tag: 'latest', apikey: API_KEY_BNB }, timeout: 8000 }); if (data.status === '1') return parseFloat(data.result) / 1e18; return 0; } catch { return 0; } }
export async function scanEngine(maxKeys = 5000, onProgress = () => {}, stopRef = { current: false }) {
  await fetchPrices();
  let found = 0;
  for (let i = 0; i < maxKeys; i++) {
    if (stopRef.current) break;
    const ethPrivateKey = generateRandomHex();
    const btcWIF = generateWIF();
    const ethAddress = deriveEthAddress(ethPrivateKey);
    const btcAddress = deriveBtcAddress(btcWIF);
    const bnbAddress = deriveBnbAddress(ethPrivateKey);
    if (!ethAddress || !btcAddress || !bnbAddress) { onProgress(i + 1, maxKeys, null); continue; }
    const ethBal = await checkEthBalance(ethAddress);
    if (ethBal > 0) { onProgress(i + 1, maxKeys, { network: 'ETH', address: ethAddress, privateKey: ethPrivateKey, balance: ethBal, value: ethBal * prices.eth }); found++; continue; }
    const btcBal = await checkBtcBalance(btcAddress);
    if (btcBal > 0) { onProgress(i + 1, maxKeys, { network: 'BTC', address: btcAddress, privateKey: btcWIF, balance: btcBal, value: btcBal * prices.btc }); found++; continue; }
    const bnbBal = await checkBnbBalance(bnbAddress);
    if (bnbBal > 0) { onProgress(i + 1, maxKeys, { network: 'BNB', address: bnbAddress, privateKey: ethPrivateKey, balance: bnbBal, value: bnbBal * prices.bnb }); found++; }
    onProgress(i + 1, maxKeys, null);
    if (i % 5 === 0) await new Promise(r => setTimeout(r, 100));
  }
  return found;
}