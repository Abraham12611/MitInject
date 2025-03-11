'use client'

import React, { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Wallet, Import } from 'lucide-react';
import { usePrivyAuth } from '@/contexts/PrivyAuthContext';
import { useRouter } from 'next/navigation';

const RegistrationModal = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { login, connectWallet, isAuthenticated, isConnected } = usePrivyAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isConnected) {
      handleRedirect();
    }
  }, [isAuthenticated, isConnected]);

  const modalSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(0.9)' },
    config: { tension: 300, friction: 20 },
  });

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleRedirect = () => {
    handleClose();
    router.push('/desktop'); 
  };

  const handleLogin = async () => {
    try {
      await login();
      if (isAuthenticated && isConnected) {
        handleRedirect();
      }
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      if (isAuthenticated && isConnected) {
        handleRedirect();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <animated.div 
      style={modalSpring}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome to Mitinject Terminal
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={handleConnectWallet}
            className="w-full flex items-center justify-center gap-2 bg-[#7C3AED] text-white py-3 px-4 rounded-xl 
                     font-medium hover:bg-[#6D28D9] transition-colors"
          >
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-black/50">or</span>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-black/5 text-black py-3 px-4 rounded-xl 
                     font-medium hover:bg-black/10 transition-colors"
          >
            Continue with Email
          </button>
        </div>
      </div>
    </animated.div>
  );
};

export default RegistrationModal; 