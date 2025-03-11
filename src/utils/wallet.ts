// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
import { fromB64 } from '@mysten/sui/utils';
import { decryptData } from './encryption';

export interface WalletData {
  publicKey: string;
  privateKey: string;
  type: 'ed25519';
  createdAt: string;
}

export function getStoredWallet(): WalletData | null {
  try {
    const encrypted = localStorage.getItem('wallet');
    if (!encrypted) return null;
    
    return decryptData(encrypted) as WalletData;
  } catch (error) {
    console.error('Error reading wallet from storage:', error);
    return null;
  }
}

export function getKeypair(): ReturnType<typeof Ed25519Keypair.deriveKeypair> | null {
  try {
    const wallet = getStoredWallet();
    if (!wallet) return null;

    return Ed25519Keypair.fromSecretKey(fromB64(wallet.privateKey));
  } catch (error) {
    console.error('Error getting keypair:', error);
    return null;
  }
} 