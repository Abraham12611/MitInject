'use client'

import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Shield, Import, ChevronRight, AlertTriangle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import * as bip39 from 'bip39';
import { useRouter } from 'next/navigation';
import { encryptData } from '@/utils/encryption';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
import { fromB64, toB64 } from '@mysten/sui/utils';

const ImportWalletFlow = ({ onClose, onSuccess }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Animation setup
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const modalSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'scale(1)' : 'scale(0.9)' 
    },
    config: { tension: 300, friction: 20 },
  });

  const validateAndImport = async () => {
    try {
      setError('');
      setIsImporting(true);

      // Clean seed phrase
      const cleanedPhrase = seedPhrase
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[\n\r\t]/g, ' ')
        .toLowerCase();

      // Validate seed phrase
      const words = cleanedPhrase.split(' ');
      if (words.length !== 12) {
        throw new Error('Please enter all 12 words of your recovery phrase');
      }

      if (!bip39.validateMnemonic(cleanedPhrase)) {
        throw new Error('Invalid recovery phrase. Please check each word and try again');
      }

      // Create keypair from mnemonic
      const keypair = Ed25519Keypair.deriveKeypair(cleanedPhrase);

      // Store encrypted wallet data
      const walletData = {
        publicKey: toB64(keypair.getPublicKey().toSuiBytes()),
        privateKey: toB64(keypair.getSecretKey()),
        type: 'ed25519',
        address: keypair.toSuiAddress(),
        createdAt: new Date().toISOString()
      };

      console.log("walletData from import: " + JSON.stringify(walletData));

      const encryptedWallet = encryptData(walletData);
      localStorage.setItem('wallet', encryptedWallet);

      // Call onSuccess with the wallet data
      await onSuccess({
        publicKey: walletData.publicKey,
        type: walletData.type,
        address: walletData.address
      });

      // Fade out and navigate
      setIsVisible(false);
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push('/desktop');

    } catch (error) {
      setError(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <animated.div
      style={modalSpring}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8 space-y-6">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="absolute -ml-2 p-2 text-black/50 hover:text-black rounded-full hover:bg-black/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Import className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center">
          Import Existing Wallet
        </h3>

        <div className="space-y-4">
          <p className="text-black/70">
            Enter your 12-word recovery phrase to import your existing wallet.
          </p>

          <div className="relative">
            <textarea
              value={seedPhrase}
              onChange={(e) => {
                setError('');
                setSeedPhrase(e.target.value);
              }}
              placeholder="Enter your recovery phrase..."
              rows={4}
              className={`w-full p-4 bg-black/5 rounded-xl font-mono text-sm resize-none
                ${error ? 'border-2 border-red-500' : 'border-2 border-transparent'}
                ${showPhrase ? '' : 'blur-lg'}`}
            />
            <button
              onClick={() => setShowPhrase(!showPhrase)}
              className="absolute right-4 top-4 text-black/50 hover:text-black"
            >
              {showPhrase ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </p>
          )}

          <button
            onClick={validateAndImport}
            disabled={isImporting || !seedPhrase.trim()}
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl 
                     font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Importing Wallet...
              </>
            ) : (
              <>
                Import Wallet
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default ImportWalletFlow; 