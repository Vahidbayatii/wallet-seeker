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

async function checkBTC(address) {
  try {
    const { data } = await axios.get(API.BTC + '/address/' + address, { timeout: 8000 });
    if (data.data) {
      return (data.data.balance || 0) / 1e8;
    }
    return 0;
  } catch { return 0; }
}

async function checkImportedWallet(privateKeyHex) {
  try {
    const wallet = new ethers.Wallet('0x' + privateKeyHex);
    const ethAddress = wallet.address;
    const bnbAddress = ethAddress;
    const [ethBal, bnbBal] = await Promise.all([checkETH(ethAddress), checkBNB(bnbAddress)]);
    const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin&vs_currencies=usd', { timeout: 6000 });
    const ethPrice = data.ethereum?.usd || 0;
    const bnbPrice = data.binancecoin?.usd || 0;
    return {
      privateKey: privateKeyHex,
      eth: { address: ethAddress, balance: ethBal, usd: ethBal * ethPrice },
      bnb: { address: bnbAddress, balance: bnbBal, usd: bnbBal * bnbPrice },
      totalUSD: (ethBal * ethPrice) + (bnbBal * bnbPrice),
      found: (ethBal + bnbBal) > 0,
    };
  } catch {
    return { privateKey: privateKeyHex, error: 'Invalid private key', found: false };
  }
}

export { checkImportedWallet };