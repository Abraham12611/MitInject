import React from 'react';

const MarketApp = ({ isExpanded, theme }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 space-y-6">
        {/* Only show hackathon news when not expanded */}
        {!isExpanded ? (
          <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
            <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              @injective recently introduced iAssets, a new framework for bringing stocks, bonds, and ETFs onchain as programmable financial instruments instead of static tokens.
            </h3>
            <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              The problem with today's tokenized assets?
              They lack composability and capital efficiency because they rely on off-chain .... readmore
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors?.text?.accent || theme.colors.accent }} />
                <p className="text-sm" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                  NordStar - AI-powered DeFi assistant
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
                @injective recently introduced iAssets, a new framework for bringing stocks, bonds, and ETFs onchain as programmable financial instruments instead of static tokens.
                </h3>
                <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                The problem with today's tokenized assets?
                They lack composability and capital efficiency because they rely on off-chain collateral and synthetic minting.
                </p>
                <div className="mt-4 space-y-2">
                  {['NordStar - AI-powered DeFi assistant', 'TradingBrain - ML trading signals', 'AIStaking - Smart staking optimizer'].map((project, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors?.text?.accent || theme.colors.accent }} />
                      <p className="text-sm" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                        {project}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Helix News */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="text-lg font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                    Helix V2 Launch Imminent!
                  </h3>
                </div>
                <p className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  Helix, Injective's flagship DEX, is preparing to launch V2 with improved capital efficiency, concentrated liquidity, and advanced order types. The community is eagerly anticipating the update slated for next month.
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
                    Fresh in Injective this week
                  </h3>
                </div>

                {/* Project Updates */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                      Project Updates
                    </h4>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Gryphon: Reached 250M INJ staked milestone</p>
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Astroport: Added cross-chain swaps with 5 new chains</p>
                      <p className="text-sm" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>• Helix: Launched 10 new perpetual markets</p>
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