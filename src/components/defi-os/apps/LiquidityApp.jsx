import React from 'react';
import LiquidityPoolManager from './liquidity/LiquidityPoolManager';

const LiquidityApp = ({ isExpanded, theme }) => {
  return (
    <div className="h-full overflow-auto">
      <LiquidityPoolManager theme={theme} />
    </div>
  );
};

export default LiquidityApp;