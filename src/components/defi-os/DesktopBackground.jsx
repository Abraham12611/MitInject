import React from 'react';

const DesktopBackground = ({ theme }) => {
  return (
    <>
      {/* Base gradient */}
      <div className="absolute inset-0 backdrop-blur-3xl -z-30">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20" />
      </div>
      
      {/* Theme background gradient */}
      {theme.colors.effects?.background && (
        <div 
          className="absolute inset-0 backdrop-blur-3xl -z-20" 
          style={{ 
            backgroundImage: `linear-gradient(${theme.colors.effects.background})`,
            opacity: 0.9
          }} 
        />
      )}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${theme.colors.border} 1px, transparent 1px),
              linear-gradient(to bottom, ${theme.colors.border} 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            opacity: 0.1
          }}
        />
      </div>

      {/* Theme gradient overlay */}
      {theme.colors.effects?.overlay && (
        <div 
          className="absolute inset-0 -z-10" 
          style={{
            background: theme.colors.effects.overlay,
            mixBlendMode: 'soft-light'
          }}
        />
      )}

      {/* Fractal background animation */}
      <style jsx global>{`
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
    </>
  );
};

export default DesktopBackground; 