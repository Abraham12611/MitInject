import React from 'react';

const AnimationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes float {
        0% { 
          transform: translate(-50%, 0); 
        }
        100% { 
          transform: translate(-50%, -400px); 
        }
      }

      @keyframes pop {
        0% { 
          opacity: 0; 
          transform: scale(0) rotate(0deg); 
        }
        40% { 
          opacity: 1; 
          transform: scale(1.3) rotate(10deg); 
        }
        60% { 
          opacity: 1;
          transform: scale(0.9) rotate(-5deg); 
        }
        80% { 
          opacity: 1;
          transform: scale(1) rotate(0deg); 
        }
        100% { 
          opacity: 0; 
          transform: scale(0.3) translateY(-400px) rotate(15deg); 
        }
      }
      
      .fractal-background {
        background: 
          repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.1) 0px,
            rgba(255, 255, 255, 0.1) 2px,
            transparent 2px,
            transparent 4px
          );
        animation: fractalCreep 10s linear infinite;
        opacity: 0.5;
        mix-blend-mode: overlay;
      }

      @keyframes fractalCreep {
        0% {
          background-position: 0 100vh;
          opacity: 0;
        }
        50% {
          opacity: 0.5;
        }
        100% {
          background-position: 0 0;
          opacity: 0;
        }
      }
    `}</style>
  );
};

export default AnimationStyles; 