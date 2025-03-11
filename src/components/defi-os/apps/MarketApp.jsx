import React from 'react';

const MarketApp = ({ isExpanded, theme }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6">
        {/* Only show hackathon news when not expanded */}
        {!isExpanded ? (
          <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
            <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              Sui Typhoon AI Hackathon is here! 🚀
            </h3>
            <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              Checkout the list of submitted projects:
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors?.text?.accent || theme.colors.accent }} />
                <p className="text-sm" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                  SuiGPT - AI-powered DeFi assistant
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            <div className="h-full space-y-4">
              {/* Hackathon News */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                  Sui Typhoon AI Hackathon is here! 🚀
                </h3>
                <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Checkout the list of submitted projects:
                </p>
                <div className="mt-4 space-y-2">
                  {['SuiGPT - AI-powered DeFi assistant', 'TradingBrain - ML trading signals', 'AIStaking - Smart staking optimizer'].map((project, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors?.text?.accent || theme.colors.accent }} />
                      <p className="text-sm" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                        {project}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Walrus News */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                    Walrus Mainnet Launch Imminent!
                  </h3>
                </div>
                <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Will there be an announcement during the event at ETH Denver? The community is buzzing with speculation as Sui Presents Walrus is scheduled for February 26.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      background: `${theme.colors.accent}20`,
                      color: theme.colors?.text?.accent || theme.colors.accent
                    }}
                  >
                    Hot News
                  </div>
                  <div className="text-xs" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>2 hours ago</div>
                </div>
              </div>

              {/* Weekly Update */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📅</span>
                  <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                    Fresh in Sui this week
                  </h3>
                </div>

                {/* Project Updates */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                      Project Updates
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Scallop: Launched liquid staking v2</p>
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Turbos: Added perpetual trading</p>
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Cetus: Integrated with 5 new protocols</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketApp; 