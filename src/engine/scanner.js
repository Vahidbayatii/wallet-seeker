import { ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';

const API = {
  ETH: 'https://api.etherscan.io/api',
  BTC: 'https://chain.api.btc.com/v3',
  BNB: 'https://api.bscscan.com/api',
};
const API_KEY_ETH = '8PZBAW6EVWU6MMQQ48NIW2NDFECT44EH7R';
const API_KEY_BNB = '8PZBAW6EVWU6MMQQ48NIW2NDFECT44EH7R';
let prices = { eth: 0, btc: 0, bnb: 0 };

async function fetchPrices() {
  try {
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,binancecoin&vs_currencies=usd', { timeout: 6000 });
    prices.eth = data.ethereum?.usd || 0;
    prices.btc = data.bitcoin?.usd || 0;
    prices.bnb = data.binancecoin?.usd || 0;
  } catch {}
}

function generateRandomHex(bytes = 32) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateWIF() {
  const keyBytes = new Uint8Array(32);
  crypto.getRandomValues(keyBytes);
  keyBytes[0] &= 0xef;
  keyBytes[31] &= 0x3f;
  keyBytes[31] |= 0x40;
  const prefix = Buffer.from([0x80]);
  const extended = Buffer.concat([prefix, Buffer.from(keyBytes)]);
  const first = bitcoin.crypto.sha256(bitcoin.crypto.sha256(extended));
  const checksum = first.slice(0, 4);
  return bitcoin.address.toBase58Check(Buffer.concat([extended, checksum]));
}

function privateKeyToAddressETH(pk) {
  try {
    const wallet = new ethers.Wallet('0x' + pk);
    return wallet.address;
  } catch { return null; }
}

function privateKeyToAddressBTC(wif) {
  try {
    const keyPair = bitcoin.ECPair.fromWIF(wif);
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address;
  } catch { return null; }
}

async function checkETH(address) {
  try {
    const { data } = await axios.get(API.ETH, { params: { module: 'account', action: 'balance', address, tag: 'latest', apikey: API_KEY_ETH }, timeout: 8000 });
    if (data.status === '1') {
      const balance = parseFloat(data.result) / 1e18;
      return balance > 0 ? balance : 0;
    }
    return 0;
  } catch { return 0; }
}

async function checkBTC(address) {
  try {
    const { data } = await axios.get(API.BTC + '/address/' + address, { timeout: 8000 });
    if (data.data) {
      return (data.data.balance || 0) / 1e8;
    }
    return 0;
  } catch { return 0; }
}

async function checkBNB(address) {
  try {
    const { data } = await axios.get(API.BNB, { params: { module: 'account', action: 'balance', address, tag: 'latest', apikey: API_KEY_BNB }, timeout: 8000 });
    if (data.status === '1') {
      const balance = parseFloat(data.result) / 1e18;
      return balance > 0 ? balance : 0;
    }
    return 0;
  } catch { return 0; }
}

async function scanPrivateKey(pk) {
  await fetchPrices();
  const ethAddress = privateKeyToAddressETH(pk);
  const wif = generateWIF();
  const btcAddress = privateKeyToAddressBTC(wif);
  const bnbAddress = ethAddress;
  const [ethBal, btcBal, bnbBal] = await Promise.all([checkETH(ethAddress), checkBTC(btcAddress), checkBNB(bnbAddress)]);
  const totalUSD = (ethBal * prices.eth) + (btcBal * prices.btc) + (bnbBal * prices.bnb);
  return {
    privateKey: pk,
    eth: { address: ethAddress, balance: ethBal, usd: ethBal * prices.eth },
    btc: { address: btcAddress, balance: btcBal, usd: btcBal * prices.btc },
    bnb: { address: bnbAddress, balance: bnbBal, usd: bnbBal * prices.bnb },
    totalUSD,
    found: totalUSD > 0,
  };
}

export { scanPrivateKey, generateRandomHex, generateWIF, fetchPrices };