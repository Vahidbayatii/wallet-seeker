import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
const API = { ETH: 'https://api.etherscan.io/api', BTC: 'https://chain.api.btc.com/v3', BNB: 'https://api.bscscan.com/api' };
const API_KEY_ETH = 'YourEtherscanApiKey';
const API_KEY_BNB = 'YourBscscanApiKey';
let prices = { eth: 0, btc: 0, bnb: 0 };
async function fetchPrices() { try { const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,binancecoin&vs_currencies=usd', { timeout: 6000 }); prices.eth = data.ethereum?.usd || 0; prices.btc = data.bitcoin?.usd || 0; prices.bnb = data.binancecoin?.usd || 0; } catch {} }
function isHexKey(key) { const c = key.replace('0x',''); return /^[0-9a-fA-F]{64}$/.test(c) || /^[0-9a-fA-F]{128}$/.test(c); }
function isWIF(key) { return /^[5KL][1-9A-HJ-NP-Za-km-z]{51}$/.test(key); }
function deriveEthAddress(pk) { try { const k = pk.startsWith('0x')?pk:'0x'+pk; return new ethers.Wallet(k).address; } catch { return null; } }
function deriveBtcAddress(wif) { try { const kp = bitcoin.ECPair.fromWIF(wif); return bitcoin.payments.p2pkh({pubkey:kp.publicKey}).address; } catch { return null; } }
async function checkEthBalance(addr) { try { const {data} = await axios.get(API.ETH,{params:{module:'account',action:'balance',address:addr,tag:'latest',apikey:API_KEY_ETH},timeout:8000}); if(data.status==='1') return parseFloat(data.result)/1e18; return 0; } catch { return 0; } }
async function checkBtcBalance(addr) { try { const {data} = await axios.get(`${API.BTC}/address/${addr}`,{timeout:8000}); if(data.data) return data.data.balance/1e8; return 0; } catch { return 0; } }
async function checkBnbBalance(addr) { try { const {data} = await axios.get(API.BNB,{params:{module:'account',action:'balance',address:addr,tag:'latest',apikey:API_KEY_BNB},timeout:8000}); if(data.status==='1') return parseFloat(data.result)/1e18; return 0; } catch { return 0; } }
export async function checkAllBalances(privateKey) {
  await fetchPrices();
  if (isWIF(privateKey)) { const addr = deriveBtcAddress(privateKey); if (!addr) return null; const bal = await checkBtcBalance(addr); if (bal > 0) return { network:'BTC', address:addr, privateKey, balance:bal, value:bal*prices.btc }; return null; }
  if (isHexKey(privateKey)) { const addr = deriveEthAddress(privateKey); if (!addr) return null; const ethBal = await checkEthBalance(addr); if (ethBal > 0) return { network:'ETH', address:addr, privateKey, balance:ethBal, value:ethBal*prices.eth }; const bnbBal = await checkBnbBalance(addr); if (bnbBal > 0) return { network:'BNB', address:addr, privateKey, balance:bnbBal, value:bnbBal*prices.bnb }; return null; }
  return null;
}