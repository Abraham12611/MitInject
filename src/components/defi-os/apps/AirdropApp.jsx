import React, { useState } from 'react';

const AirdropApp = ({ isExpanded, theme, onProjectInteract, onChatOpen }) => {
  const [showWebsite, setShowWebsite] = useState(false);

  const handleInteract = (e, projectName) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the window
    
    if (projectName === 'Walrus') {
      setShowWebsite(true);
      // Open chat with Walrus instructions
      if (onChatOpen) {
        onChatOpen("After checking tweets and recent activity, here are the steps to maximize your chances for the Walrus airdrop:\n\n1. Bridge assets to Sui Network (min. $500 worth)\n2. Store files on Walrus testnet (min. 3 files)\n3. Maintain storage for >14 days\n4. Join Discord & follow Twitter\n5. Complete governance votes when available\n\nI'll monitor your progress and alert you of any new opportunities. Would you like me to help track these tasks?");
      }
    } else {
      onProjectInteract(projectName);
    }
  };

  if (showWebsite) {
    return (
      <iframe
        src="https://www.walrus.xyz/"
        className="w-full h-full"
        frameBorder="0"
        title="Walrus Protocol"
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6">
        {/* Search Status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-sm">
              Searching for top projects on Sui without a token...
            </p>
          </div>
        </div>

        {/* Only show featured project when not expanded */}
        {!isExpanded ? (
          <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>Walrus</h3>
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      background: `${theme.colors.accent}20`,
                      color: theme.colors?.text?.accent || theme.colors.accent
                    }}
                  >
                    Featured
                  </span>
                </div>
                <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>Decentralised storage</p>
              </div>
              <button 
                onClick={(e) => handleInteract(e, 'Walrus')}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ 
                  background: theme.colors.accent,
                  color: theme.colors?.text?.primary || '#FFFFFF'
                }}
              >
                Interact
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <div className="h-full space-y-4">
              {/* Featured Project */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>Walrus</h3>
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ 
                          background: `${theme.colors.accent}20`,
                          color: theme.colors?.text?.accent || theme.colors.accent
                        }}
                      >
                        Featured
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>Decentralised storage</p>
                  </div>
                  <button 
                    onClick={(e) => handleInteract(e, 'Walrus')}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{ 
                      background: theme.colors.accent,
                      color: theme.colors?.text?.primary || '#FFFFFF'
                    }}
                  >
                    Interact
                  </button>
                </div>
              </div>

              {/* Other Projects */}
              {[
                { name: 'MovEX', desc: 'DEX with 100k+ users' },
                { name: 'SuiPad', desc: 'Launchpad with $50M TVL' },
                { name: 'NavaLend', desc: 'Lending protocol, 50k users' },
                { name: 'SuiStake', desc: 'Liquid staking, $100M TVL' }
              ].map((project) => (
                <div 
                  key={project.name}
                  className="p-4 rounded-lg"
                  style={{ background: theme.colors.secondary }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>{project.name}</h3>
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>{project.desc}</p>
                    </div>
                    <button 
                      onClick={(e) => handleInteract(e, project.name)}
                      className="px-4 py-2 rounded-lg text-sm"
                      style={{ 
                        background: theme.colors.accent,
                        color: theme.colors?.text?.primary || '#FFFFFF'
                      }}
                    >
                      Interact
                    </button>
                  </div>
                </div>
              ))}

              {/* Step 2 Hint */}
              <div className="pt-4 border-t" style={{ borderColor: theme.colors.border }}>
                <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Click 'Interact' to start farming potential airdrops
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirdropApp; 