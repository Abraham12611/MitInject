import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const LoadingScreen = ({ isLoading, onLoadingComplete, theme }) => {
  const fadeOut = useSpring({
    opacity: isLoading ? 1 : 0,
    config: { duration: 800 },
    onRest: () => {
      if (!isLoading) {
        onLoadingComplete();
      }
    },
  });

  return (
    <animated.div
      style={{
        ...fadeOut,
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme?.colors?.background || '#000',
        color: theme?.colors?.text?.primary || '#fff',
      }}
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Pawtato Finance</h1>
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
            <animated.div
              className="h-full rounded-full"
              style={{
                background: theme?.colors?.accent || '#fff',
                width: useSpring({
                  from: { width: '0%' },
                  to: { width: '100%' },
                  config: { duration: 2000 },
                }).width,
              }}
            />
          </div>
          <p className="text-sm" style={{ color: theme?.colors?.text?.secondary || '#888' }}>
            Loading DeFi OS...
          </p>
        </div>
      </div>
    </animated.div>
  );
};

export default LoadingScreen; 