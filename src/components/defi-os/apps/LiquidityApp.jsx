import React from 'react';
import LiquidityPoolManager from './liquidity/LiquidityPoolManager';

const LiquidityApp = ({ isExpanded, theme }) => {
  return (
    <div className="h-full overflow-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text?.primary }}>
          Injective Liquidity Pools
        </h2>
        <div className="mb-4 p-3 rounded-lg" style={{ background: theme.colors.secondary }}>
          <p className="text-sm" style={{ color: theme.colors.text?.secondary }}>
            Manage your liquidity positions across Helix and Astroport protocols on the Injective network.
            View APRs, add/remove liquidity, and track your rewards.
          </p>
        </div>
      </div>
      <LiquidityPoolManager theme={theme} />
    </div>
  );
};

export default LiquidityApp;