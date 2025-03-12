'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSpring, animated } from '@react-spring/web';
import './styles.css';
import { AuthProvider } from '@/contexts/AuthContext';
import RegistrationModal from '@/components/auth/RegistrationModal';
import { useAuth } from '@/contexts/AuthContext';

// Dynamically import BirdScene with no SSR
const BirdScene = dynamic(() => import('@/components/loading/birds/BirdsScene'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen bg-black absolute inset-0" />
  )
});

const LoadingPageContent = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);
  const [showLoadingBar, setShowLoadingBar] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const loadingComplete = useRef(false);
  const { user } = useAuth();

  // Handle initial mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for user auth state changes
  useEffect(() => {
    if (user && showRegistration) {
      // User just logged in, start transition
      setShowRegistration(false);
      setIsExiting(true);
      setTimeout(() => {
        router.push('/desktop');
      }, 1000);
    }
  }, [user, showRegistration, router]);

  // Fade in animation
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: isExiting ? 0 : 1 },
    config: { duration: 1000 },
    onRest: () => {
      if (!isExiting && mounted) {
        setShowText(true);
      }
    },
  });

  // Text animations
  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)' },
    config: { tension: 120, friction: 14 },
    onRest: () => {
      if (showText) {
        setTimeout(() => setShowLoadingBar(true), 500);
      }
    },
  });

  const subtitleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: showText ? 1 : 0, transform: showText ? 'translateY(0)' : 'translateY(20px)' },
    delay: 500,
    config: { tension: 120, friction: 14 },
  });

  // Loading progress
  useEffect(() => {
    if (showLoadingBar && !loadingComplete.current) {
      console.log('Starting loading sequence');
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 50;
        console.log('Progress:', currentProgress);

        if (currentProgress >= 100 && !loadingComplete.current) {
          console.log('Loading complete');
          loadingComplete.current = true;
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            if (user) {
              setIsExiting(true);
              setTimeout(() => {
                router.push('/desktop');
              }, 1000);
            } else {
              setShowRegistration(true);
            }
          }, 1000);
        } else {
          setProgress(Math.min(currentProgress, 100));
        }
      }, 500);

      return () => clearInterval(interval);
    }
  }, [showLoadingBar, router, user]);

  // Glitch effect
  useEffect(() => {
    if (showText) {
      const title = document.querySelector('.title-text');
      const subtitle = document.querySelector('.subtitle-text');

      const triggerRandomGlitch = () => {
        const elements = [title, subtitle];
        const randomElement = elements[Math.floor(Math.random() * elements.length)];

        randomElement?.classList.add('glitch-active');
        setTimeout(() => {
          randomElement?.classList.remove('glitch-active');
        }, 200);

        const nextGlitch = Math.random() * 5000 + 2000;
        setTimeout(triggerRandomGlitch, nextGlitch);
      };

      const timeout = setTimeout(triggerRandomGlitch, 2000);
      return () => clearTimeout(timeout);
    }
  }, [showText]);

  // Add a spring for the modal
  const modalWrapperSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: showRegistration ? 1 : 0 },
    config: { tension: 300, friction: 20 },
    immediate: false,
  });

  return (
    <div className="w-screen h-screen">
      <animated.div style={fadeIn} className="relative w-full h-full overflow-hidden">
        {/* BirdScene Background */}
        <div className="absolute inset-0">
          <BirdScene />
        </div>

        {/* Grayscale Overlay */}
        <div className="absolute inset-0" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <animated.h1
            style={titleSpring}
            className="text-6xl font-bold text-white mb-6 glitch title-text backdrop-blur-sm"
            data-text="Pool Protocol"
          >
            Pool Protocol
          </animated.h1>

          <animated.h2
            style={subtitleSpring}
            className="text-2xl text-white/80 mb-24 glitch subtitle-text backdrop-blur-sm"
            data-text="The Agent Network"
          >
            The Agent Network
          </animated.h2>

          {showLoadingBar && (
            <div className="w-96 h-1 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-black transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-black/50 text-sm space-y-1 backdrop-blur-sm">
          <span>© 2025 Pool Protocol. All rights reserved.</span>
        </div>
      </animated.div>

      {/* Registration Modal */}
      {showRegistration && (
        <animated.div
          style={{
            ...modalWrapperSpring,
            pointerEvents: showRegistration ? 'auto' : 'none',
          }}
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <RegistrationModal onClose={() => setShowRegistration(false)} />
        </animated.div>
      )}

      {/* Test Button - temporary for debugging */}
      {/* <button
        className="fixed bottom-4 right-4 z-[10000] bg-white text-black px-4 py-2 rounded"
        onClick={() => setShowRegistration(true)}
      >
        Show Modal
      </button> */}
    </div>
  );
};

export default function LoadingPage() {
  return (
    <AuthProvider>
      <LoadingPageContent />
    </AuthProvider>
  );
}