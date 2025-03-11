import React from 'react';
import ProOverlay from '../ProOverlay';

const LiquidityApp = ({ isExpanded, theme, onRebalance }) => {
  const handleRebalance = (e, poolName) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the window
    if (onRebalance) {
      onRebalance(poolName);
    }
  };

  return (
    <div className="relative h-full">
      <div className="p-6 space-y-6 blur-[2px]">
        {/* Total Liquidity */}
        <div className={`${isExpanded ? 'grid grid-cols-2 gap-6' : 'space-y-6'}`}>
          <div>
            <h2 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="font-medium">Total Liquidity</h2>
            <div style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-3xl font-bold">$58,921.45</div>
          </div>
          <div>
            <h2 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="font-medium">Daily Fees</h2>
            <div className="text-3xl font-bold text-green-500">+$142.88</div>
          </div>
        </div>

        {/* Only show first pool when not expanded */}
        {!isExpanded ? (
          <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">S</div>
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">U</div>
                </div>
                <div>
                  <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>SUI/USDC</h3>
                  <p style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>$32,450.21 • 42% APR</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleRebalance(e, 'SUI/USDC')}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                style={{ 
                  background: theme.colors.accent,
                  color: theme.colors?.text?.primary || '#FFFFFF'
                }}
              >
                Rebalance
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 blur-[2px]">
            <div className="h-full space-y-4">
              {/* Show all pools when expanded */}
              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                {/* SUI/USDC Pool */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">S</div>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">U</div>
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>SUI/USDC</h3>
                      <p style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>$32,450.21 • 42% APR</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleRebalance(e, 'SUI/USDC')}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    style={{ 
                      background: theme.colors.accent,
                      color: theme.colors?.text?.primary || '#FFFFFF'
                    }}
                  >
                    Rebalance
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                {/* BLUR/USDC Pool */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs">B</div>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">U</div>
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>BLUR/USDC</h3>
                      <p style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>$15,782.12 • 38% APR</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleRebalance(e, 'BLUR/USDC')}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    style={{ 
                      background: theme.colors.accent,
                      color: theme.colors?.text?.primary || '#FFFFFF'
                    }}
                  >
                    Rebalance
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ background: theme.colors.secondary }}>
                {/* CETUS/USDC Pool */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">C</div>
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">U</div>
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>CETUS/USDC</h3>
                      <p style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>$10,689.12 • 35% APR</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleRebalance(e, 'CETUS/USDC')}
                    className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    style={{ 
                      background: theme.colors.accent,
                      color: theme.colors?.text?.primary || '#FFFFFF'
                    }}
                  >
                    Rebalance
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="pt-4 border-t" style={{ borderColor: theme.colors.border }}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg" style={{ background: theme.colors.secondary }}>
                    <h4 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="text-sm">24h Volume</h4>
                    <p style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-lg font-medium">$245,892</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: theme.colors.secondary }}>
                    <h4 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="text-sm">Total Pairs</h4>
                    <p style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-lg font-medium">3 Active</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: theme.colors.secondary }}>
                    <h4 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="text-sm">Health Status</h4>
                    <p className="text-lg font-medium text-green-500">Optimal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProOverlay theme={theme} />
    </div>
  );
};

export default LiquidityApp;