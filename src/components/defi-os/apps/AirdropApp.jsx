import React, { useState } from 'react';

const AirdropApp = ({ isExpanded, theme, onProjectInteract, onChatOpen }) => {
  const [showWebsite, setShowWebsite] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const handleInteract = (e, projectName) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the window

    if (projectName === 'Helix') {
      setCurrentProject('Helix');
      setShowWebsite(true);
      // Open chat with Helix instructions
      if (onChatOpen) {
        onChatOpen("After analyzing Helix's activity and requirements, here are the optimal steps for potential airdrop eligibility:\n\n1. Connect wallet to Helix DEX and deposit funds (min. $200 worth)\n2. Execute spot and perpetual trades regularly (at least 2x weekly)\n3. Participate in their Trading Competitions when available\n4. Join their Discord & follow Twitter for announcements\n5. Provide liquidity using their liquidity bots if possible\n\nI'll track your progress and notify you of any trading competitions or new opportunities. Would you like me to help monitor these activities?");
      }
    } else if (projectName === 'Ninja Garden') {
      setCurrentProject('Ninja Garden');
      setShowWebsite(true);
      if (onChatOpen) {
        onChatOpen("To maximize your chances for the Ninja Garden $KUNAI airdrop, follow these steps:\n\n1. Sign in with Twitter/X account \n2. Join a faction by purchasing creator keys\n3. Participate in missions by engaging with posts\n4. Bond INJ via their liquid staking platform to receive gINJ\n5. Complete bounties with your faction to earn points\n\nThe points campaign recently ended, but stay active for the next phase. Would you like me to alert you when new opportunities become available?");
      }
    } else if (projectName === 'Gryphon') {
      setCurrentProject('Gryphon');
      setShowWebsite(true);
      if (onChatOpen) {
        onChatOpen("For potential Gryphon airdrop opportunities, consider these actions:\n\n1. Connect wallet to their platform\n2. Explore their AI agent launchpad features\n3. Interact with their data infrastructure tools\n4. Follow their Twitter for announcements\n5. Join their community channels\n\nGryphon combines AI and DeFi in a unique way - they offer high-quality financial data access and tools for developers. I'll monitor for any token launch announcements. Would you like me to track your engagement?");
      }
    } else {
      onProjectInteract(projectName);
    }
  };

  if (showWebsite) {
    let projectUrl = "";
    let projectTitle = "";

    if (currentProject === 'Helix') {
      projectUrl = "https://app.helixapp.com/";
      projectTitle = "Helix DEX";
    } else if (currentProject === 'Ninja Garden') {
      projectUrl = "https://ninja.garden/";
      projectTitle = "Ninja Garden";
    } else if (currentProject === 'Gryphon') {
      projectUrl = "https://gryphon.finance/";
      projectTitle = "Gryphon Finance";
    }

    return (
      <iframe
        src={projectUrl}
        className="w-full h-full"
        frameBorder="0"
        title={projectTitle}
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
              Searching for top projects on Injective without a token...
            </p>
          </div>
        </div>

        {/* Only show featured project when not expanded */}
        {!isExpanded ? (
          <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>Helix</h3>
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
                <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>Premier DEX on Injective</p>
              </div>
              <button
                onClick={(e) => handleInteract(e, 'Helix')}
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
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>Helix</h3>
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
                    <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>Premier DEX on Injective</p>
                  </div>
                  <button
                    onClick={(e) => handleInteract(e, 'Helix')}
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
                { name: 'Ninja Garden', desc: 'Social-Fi with engage-to-earn' },
                { name: 'Gryphon', desc: 'AI-powered finance platform' },
                { name: 'Astroport', desc: 'Multi-chain DEX, 200k+ users' },
                { name: 'Talis', desc: 'NFT protocol with real-world utility' }
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
                  Click 'Interact' to start farming potential airdrops on Injective
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