import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { X, Gift, Heart, Coins } from 'lucide-react';

const ChatSettingsModal = ({ isOpen, onClose, theme }) => {
  const modalSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'scale(1)' : 'scale(0.9)',
    config: {
      tension: 300,
      friction: 20
    }
  });

  const overlaySpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: {
      tension: 300,
      friction: 20
    }
  });

  // Add spring animations for the stat bars
  const humorSpring = useSpring({
    width: isOpen ? '85%' : '0%',
    config: { 
      tension: 60,     // Lower tension for slower movement
      friction: 20,    // Lower friction for smoother motion
      mass: 2,         // More mass for more inertia
      duration: 2000,  // 2 seconds duration
      delay: 600      // Delay start by 600ms
    }
  });
  
  const sassinessSpring = useSpring({
    width: isOpen ? '95%' : '0%',
    config: { 
      tension: 60,
      friction: 20,
      mass: 2,
      duration: 2000,
      delay: 1200     // Start after humor bar
    }
  });
  
  const honestySpring = useSpring({
    width: isOpen ? '75%' : '0%',
    config: { 
      tension: 60,
      friction: 20,
      mass: 2,
      duration: 2000,
      delay: 1800     // Start after sassiness bar
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300]">
      <animated.div 
        style={overlaySpring}
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="absolute inset-0 fractal-background" />
      </animated.div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <animated.div 
          style={{
            ...modalSpring,
            background: theme.colors.background,
            borderColor: theme.colors.border,
            boxShadow: theme.colors.effects?.glow
          }}
          className="w-full max-w-4xl rounded-xl border backdrop-blur-xl relative z-10"
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
          </button>

          <div className="flex p-8 gap-8">
            {/* Left side - Agent Image */}
            <div className="flex flex-col items-center">
              <div className="w-80 h-80 rounded-2xl border overflow-hidden mb-4"
                style={{ borderColor: theme.colors.border }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/assets/characters/agent.mp4" type="video/mp4" />
                  {/* Fallback to static image if video fails */}
                  <img 
                    src="/assets/characters/sample_for_agent.png"
                    alt="Mitsui"
                    className="w-full h-full object-cover"
                  />
                </video>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ 
                    background: `${theme.colors.background}CC`,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.colors.effects?.glow
                  }}
                >
                  <Gift className="w-5 h-5" style={{ color: theme.colors.accent }} />
                </button>
                <button 
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ 
                    background: `${theme.colors.background}CC`,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.colors.effects?.glow
                  }}
                >
                  <Heart className="w-5 h-5" style={{ color: theme.colors.accent }} />
                </button>
                <button 
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ 
                    background: `${theme.colors.background}CC`,
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: theme.colors.effects?.glow
                  }}
                >
                  <Coins className="w-5 h-5" style={{ color: theme.colors.accent }} />
                </button>
              </div>
            </div>

            {/* Right side - Agent Details */}
            <div className="flex-1 space-y-6">
              {/* Name Section */}
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Name
                </div>
                <div className="text-3xl font-['Pacifico']" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
                  Mitsui
                </div>
              </div>

              {/* Bio Section */}
              <div>
                <div className="text-sm mb-1" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Bio
                </div>
                <div className="text-lg" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                  Girl who found Sui
                </div>
              </div>

              {/* Stats Section */}
              <div className="space-y-4 pt-4">
                {/* Humor Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                      Humor
                    </span>
                    <span className="text-sm" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
                      85%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full w-full"
                    style={{ background: `${theme.colors.secondary}80` }}
                  >
                    <animated.div
                      style={{
                        ...humorSpring,
                        background: theme.colors?.text?.accent || theme.colors.accent
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Sassiness Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                      Sassiness
                    </span>
                    <span className="text-sm" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
                      95%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full w-full"
                    style={{ background: `${theme.colors.secondary}80` }}
                  >
                    <animated.div
                      style={{
                        ...sassinessSpring,
                        background: theme.colors?.text?.accent || theme.colors.accent
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>

                {/* Honesty Bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                      Honesty
                    </span>
                    <span className="text-sm" style={{ color: theme.colors?.text?.accent || theme.colors.accent }}>
                      75%
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full w-full"
                    style={{ background: `${theme.colors.secondary}80` }}
                  >
                    <animated.div
                      style={{
                        ...honestySpring,
                        background: theme.colors?.text?.accent || theme.colors.accent
                      }}
                      className="h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default ChatSettingsModal; 