'use client'

import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Shield, Copy, Download, ChevronRight, AlertTriangle, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import * as bip39 from 'bip39';
import { useRouter } from 'next/navigation';
import { encryptData } from '@/utils/encryption';
// import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
import { fromB64, toB64 } from '@mysten/sui/utils';

const STEPS = {
  SECURITY_WARNING: 'SECURITY_WARNING',
  SHOW_SEED: 'SHOW_SEED',
  VERIFY_SEED: 'VERIFY_SEED',
  SUCCESS: 'SUCCESS'
};

const CreateWalletFlow = ({ onClose, onSuccess }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.SECURITY_WARNING);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showSeed, setShowSeed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [selectedWords, setSelectedWords] = useState([]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [verificationError, setVerificationError] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState(new Set());

  // Generate seed phrase and create keypair when showing seed
  useEffect(() => {
    if (currentStep === STEPS.SHOW_SEED && !seedPhrase) {
      const mnemonic = bip39.generateMnemonic(128); // 12 words
      setSeedPhrase(mnemonic);

      // Create keypair from mnemonic
      const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
      
      // Store encrypted keypair
      const walletData = {
        publicKey: toB64(keypair.getPublicKey().toSuiBytes()),
        privateKey: toB64(keypair.getSecretKey()),
        type: 'ed25519',
        address: keypair.toSuiAddress(),
        createdAt: new Date().toISOString()
      };

      const encryptedWallet = encryptData(walletData);
      localStorage.setItem('wallet', encryptedWallet);
    }
  }, [currentStep, seedPhrase]);

  // Animation setup
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Prepare shuffled words for verification
  useEffect(() => {
    if (currentStep === STEPS.VERIFY_SEED && seedPhrase) {
      const words = seedPhrase.split(' ');
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setSelectedWords([]);
      setVerificationError(false);
    }
  }, [currentStep, seedPhrase]);

  const modalSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'scale(1)' : 'scale(0.9)' 
    },
    config: { tension: 300, friction: 20 },
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(seedPhrase);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleWordSelect = (word, buttonIndex) => {
    const currentPosition = selectedWords.length;
    
    // Don't allow selecting if this button was already used
    if (selectedPositions.has(buttonIndex)) return;
    
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setSelectedPositions(new Set([...selectedPositions, buttonIndex]));
    setVerificationError(false);

    // Check if all words are selected and in correct order
    if (newSelected.length === 12) {
      if (newSelected.join(' ') === seedPhrase) {
        setCurrentStep(STEPS.SUCCESS);
      } else {
        setVerificationError(true);
        setSelectedWords([]);
        setSelectedPositions(new Set());
      }
    }
  };

  const createWallet = async () => {
    try {
      setIsCreatingWallet(true);
      
      // Create keypair from seed phrase
      const keypair = Ed25519Keypair.deriveKeypair(seedPhrase);
      
      // Create wallet object with actual keypair data
      const walletData = {
        publicKey: toB64(keypair.getPublicKey().toSuiBytes()),
        privateKey: toB64(keypair.getSecretKey()),
        type: 'ed25519',
        address: keypair.toSuiAddress(),
        createdAt: new Date().toISOString()
      };

      console.log("walletData created: " + JSON.stringify(walletData));

      // Encrypt and store wallet data
      const encryptedWallet = encryptData(walletData);
      localStorage.setItem('wallet', encryptedWallet);

      // Call onSuccess with the wallet data
      await onSuccess({
        publicKey: walletData.publicKey,
        type: walletData.type,
        address: walletData.address,
        createdAt: walletData.createdAt
      });

      setIsVisible(false);
      await new Promise(resolve => setTimeout(resolve, 300));
      router.push('/desktop');

    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const renderShowSeed = () => (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center">
        <button
          onClick={onClose}
          className="absolute -ml-2 p-2 text-black/50 hover:text-black rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-center">
        Your Recovery Phrase
      </h3>

      <div className="space-y-4">
        <p className="text-black/70">
          Write down these 12 words in order and store them securely. This is the only way to recover your wallet if you lose access.
        </p>

        <div className="relative">
          <div 
            className={`p-4 bg-black/5 rounded-xl ${!showSeed ? 'blur-lg' : ''} font-mono text-sm`}
          >
            <div className="grid grid-cols-3 gap-2">
              {seedPhrase?.split(' ').map((word, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-black/50 w-4 text-right">{index + 1}.</span>
                  <span>{word}</span>
                </div>
              ))}
            </div>
          </div>

          {!showSeed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowSeed(true)}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                Show Recovery Phrase
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                     font-medium hover:bg-black/10 transition-colors"
          >
            <Copy className="w-4 h-4" />
            {hasCopied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob([seedPhrase], {type: 'text/plain'});
              element.href = URL.createObjectURL(file);
              element.download = 'recovery-phrase.txt';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                     font-medium hover:bg-black/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>

        <p className="flex items-center gap-2 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          Never share your recovery phrase with anyone
        </p>
      </div>

      {/* Single primary action button */}
      <button
        onClick={() => setCurrentStep(STEPS.VERIFY_SEED)}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl 
                 font-medium hover:bg-black/90 transition-colors"
        disabled={!showSeed}
      >
        I've Saved My Recovery Phrase
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderSecurityWarning = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full">
        <Shield className="w-8 h-8 text-yellow-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-center">
        Secure Your Wallet
      </h3>

      <div className="space-y-4 text-black/70">
        <p>
          You're about to create a new wallet. Before proceeding, please ensure:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>You are in a private and secure environment</li>
          <li>No one is watching your screen</li>
          <li>You have a secure way to store your recovery phrase</li>
        </ul>
        <p className="flex items-center gap-2 p-4 bg-yellow-50 rounded-xl text-yellow-800">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          Never share your recovery phrase with anyone
        </p>
      </div>

      <button
        onClick={() => setCurrentStep(STEPS.SHOW_SEED)}
        className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl 
                 font-medium hover:bg-black/90 transition-colors"
      >
        I Understand
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderVerifySeed = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-yellow-100 rounded-full">
        <Shield className="w-8 h-8 text-yellow-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-center">
        Verify Recovery Phrase
      </h3>

      <div className="space-y-4">
        <p className="text-black/70">
          Select the words in the correct order to verify you've saved your recovery phrase.
        </p>

        {/* Selected Words */}
        <div className="p-4 bg-black/5 rounded-xl min-h-[120px]">
          <div className="grid grid-cols-3 gap-2">
            {Array(12).fill(null).map((_, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 ${
                  verificationError && 'animate-shake'
                }`}
              >
                <span className="text-black/50 w-4 text-right">{index + 1}.</span>
                <span className="min-w-[80px]">
                  {selectedWords[index] && (
                    <span className="px-2 py-1 bg-black text-white rounded-lg text-sm">
                      {selectedWords[index]}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Word Options */}
        <div className="flex flex-wrap gap-2">
          {shuffledWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordSelect(word, index)}
              disabled={selectedPositions.has(index)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${selectedPositions.has(index)
                  ? 'bg-black/10 text-black/30'
                  : 'bg-black/5 text-black hover:bg-black/10'
                }`}
            >
              {word}
            </button>
          ))}
        </div>

        {verificationError && (
          <p className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            Incorrect order. Please try again.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(STEPS.SHOW_SEED)}
          className="flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                   font-medium hover:bg-black/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => setSelectedWords([])}
          className="flex-1 flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                   font-medium hover:bg-black/10 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
        <Check className="w-8 h-8 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-center">
        Recovery Phrase Verified
      </h3>

      <div className="space-y-4">
        <p className="text-black/70 text-center">
          Your wallet is ready to be created. Remember to keep your recovery phrase safe and never share it with anyone.
        </p>

        <div className="p-4 bg-green-50 rounded-xl">
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              Recovery phrase verified
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              Wallet ready to be created
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              Security checks passed
            </li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(STEPS.VERIFY_SEED)}
          className="flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                   font-medium hover:bg-black/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={createWallet}
          disabled={isCreatingWallet}
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl 
                   font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
        >
          {isCreatingWallet ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Wallet...
            </>
          ) : (
            <>
              Create Wallet
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <animated.div
      style={modalSpring}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        {currentStep === STEPS.SECURITY_WARNING && renderSecurityWarning()}
        {currentStep === STEPS.SHOW_SEED && renderShowSeed()}
        {currentStep === STEPS.VERIFY_SEED && renderVerifySeed()}
        {currentStep === STEPS.SUCCESS && renderSuccess()}
      </div>
    </animated.div>
  );
};

// Add this CSS to your styles file
const styles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  
  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }
`;

export default CreateWalletFlow; 