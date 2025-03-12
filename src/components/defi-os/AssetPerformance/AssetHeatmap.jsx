import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, BarChart2, Volume2 } from 'lucide-react';
import AssetDetailModal from './AssetDetailModal';

const AssetHeatmap = ({ theme, onAssetSelect }) => {
  const [assets, setAssets] = useState([
    {
      name: 'Injective',
      symbol: 'INJ',
      price: 32.45,
      change: 8.32,
      volume: '892M',
      holdings: 1850,
      value: 60032.50,
      marketCap: '2.8B',
      dominance: '0.2%',
      volatility: 'Very High',
      signal: 'Strong Buy',
      stakingAPY: '9.8%'
    },
    {
      name: 'Helix',
      symbol: 'HLX',
      price: 5.25,
      change: 12.45,
      volume: '245M',
      holdings: 7500,
      value: 39375.00,
      marketCap: '325M',
      dominance: '0.02%',
      volatility: 'High',
      signal: 'Buy',
      stakingAPY: '15.4%'
    },
    {
      name: 'Astroport',
      symbol: 'ASTRO',
      price: 4.75,
      change: 15.67,
      volume: '178M',
      holdings: 7500,
      value: 35625.00,
      marketCap: '285M',
      dominance: '0.02%',
      volatility: 'Very High',
      signal: 'Strong Buy',
      stakingAPY: '18.2%'
    },
    {
      name: 'Ninja Garden',
      symbol: 'NJA',
      price: 0.85,
      change: 25.45,
      volume: '89M',
      holdings: 18500,
      value: 15725.00,
      marketCap: '125M',
      dominance: '0.01%',
      volatility: 'Very High',
      signal: 'Strong Buy',
      stakingAPY: '22.5%'
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 43250.00,
      change: -3.99,
      volume: '12.5B',
      holdings: 0.75,
      value: 32437.50,
      marketCap: '845B',
      dominance: '51.2%',
      volatility: 'Medium',
      signal: 'Neutral',
      stakingAPY: null
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      price: 98.45,
      change: -0.99,
      volume: '892M',
      holdings: 245.2,
      value: 24139.94,
      marketCap: '42B',
      dominance: '2.8%',
      volatility: 'Very High',
      signal: 'Buy',
      stakingAPY: '6.8%'
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 2245.67,
      change: -8.03,
      volume: '8.1B',
      holdings: 8.5,
      value: 19088.20,
      marketCap: '270B',
      dominance: '17.2%',
      volatility: 'High',
      signal: 'Oversold',
      stakingAPY: '4.2%'
    },
    {
      name: 'XRP',
      symbol: 'XRP',
      price: 0.52,
      change: -9.49,
      volume: '1.2B',
      holdings: 25000,
      value: 13000.00,
      marketCap: '28B',
      dominance: '1.8%',
      volatility: 'High',
      signal: 'Oversold',
      stakingAPY: null
    },
    {
      name: 'Tether',
      symbol: 'USDT',
      price: 1.00,
      change: 0.02,
      volume: '25.5B',
      holdings: 10500,
      value: 10500.00,
      marketCap: '95B',
      dominance: '6.1%',
      volatility: 'Low',
      signal: 'Hold',
      stakingAPY: '3.5%'
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      price: 1.00,
      change: 0.01,
      volume: '15.2B',
      holdings: 8500,
      value: 8500.00,
      marketCap: '85B',
      dominance: '5.4%',
      volatility: 'Low',
      signal: 'Hold',
      stakingAPY: '4.1%'
    },
    {
      name: 'Chainlink',
      symbol: 'LINK',
      price: 14.23,
      change: 5.67,
      volume: '198M',
      holdings: 350,
      value: 4980.50,
      marketCap: '7.8B',
      dominance: '0.5%',
      volatility: 'Medium',
      signal: 'Buy',
      stakingAPY: '5.2%'
    },
    {
      name: 'Polygon',
      symbol: 'MATIC',
      price: 0.85,
      change: 4.23,
      volume: '156M',
      holdings: 5000,
      value: 4250.00,
      marketCap: '7.9B',
      dominance: '0.5%',
      volatility: 'Medium',
      signal: 'Buy',
      stakingAPY: '6.3%'
    },
    {
      name: 'Polkadot',
      symbol: 'DOT',
      price: 6.82,
      change: 3.45,
      volume: '245M',
      holdings: 800,
      value: 5456.00,
      marketCap: '8.5B',
      dominance: '0.5%',
      volatility: 'High',
      signal: 'Buy',
      stakingAPY: '12.5%'
    },
    {
      name: 'Avalanche',
      symbol: 'AVAX',
      price: 35.45,
      change: -4.82,
      volume: '287M',
      holdings: 125,
      value: 4431.25,
      marketCap: '12.4B',
      dominance: '0.8%',
      volatility: 'High',
      signal: 'Neutral',
      stakingAPY: '8.7%'
    },
    {
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.078,
      change: -9.97,
      volume: '445M',
      holdings: 85000,
      value: 6630.00,
      marketCap: '11B',
      dominance: '0.7%',
      volatility: 'Very High',
      signal: 'Sell',
      stakingAPY: null
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      price: 0.48,
      change: -10.50,
      volume: '320M',
      holdings: 12000,
      value: 5760.00,
      marketCap: '17B',
      dominance: '1.1%',
      volatility: 'High',
      signal: 'Oversold',
      stakingAPY: '5.4%'
    }
  ]);

  // Simulate random price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prev => prev.map(asset => ({
        ...asset,
        change: asset.change + (Math.random() - 0.5), // Smaller random changes
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (change) => {
    const intensity = Math.min(Math.abs(change) * 8, 95); // Adjusted for better visibility
    if (change > 0) {
      return `rgba(52, 211, 153, ${intensity / 100})`; // Green for positive
    } else if (change < 0) {
      return `rgba(239, 68, 68, ${intensity / 100})`; // Red for negative
    }
    return `rgba(148, 163, 184, ${intensity / 100})`; // Gray for neutral
  };

  // Sort assets by value (largest first)
  const sortedAssets = [...assets].sort((a, b) => b.value - a.value);
  const totalValue = sortedAssets.reduce((sum, asset) => sum + asset.value, 0);

  const getSignalColor = (signal) => {
    switch (signal.toLowerCase()) {
      case 'strong buy':
      case 'buy':
        return theme.colors.text?.success;
      case 'sell':
        return theme.colors.text?.error;
      case 'oversold':
        return '#FFA500'; // Orange
      default:
        return theme.colors.text?.secondary;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium" style={{ color: theme.colors.text?.primary }}>
          Portfolio Heatmap
        </h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-red-500 opacity-50" />
            <span className="text-xs" style={{ color: theme.colors.text?.secondary }}>Loss</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-green-500 opacity-50" />
            <span className="text-xs" style={{ color: theme.colors.text?.secondary }}>Gain</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2" style={{ aspectRatio: '21/9' }}>
        {sortedAssets.map((asset) => {
          const sizeClass = asset.value > totalValue * 0.2
            ? 'col-span-6 row-span-2'
            : asset.value > totalValue * 0.1
              ? 'col-span-4 row-span-2'
              : asset.value > totalValue * 0.05
                ? 'col-span-3 row-span-1'
                : 'col-span-2 row-span-1';

          return (
            <div
              key={asset.symbol}
              className={`${sizeClass} p-3 rounded-lg transition-all hover:scale-[0.98] overflow-hidden cursor-pointer`}
              onClick={() => onAssetSelect(asset)}
              style={{
                background: getHeatColor(asset.change),
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg" style={{ color: theme.colors.text?.primary }}>
                      {asset.symbol}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: asset.change >= 0
                          ? theme.colors.text?.success
                          : theme.colors.text?.error
                      }}
                    >
                      {asset.change.toFixed(2)}%
                    </span>
                  </div>

                  {(asset.value > totalValue * 0.05) && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" style={{ color: theme.colors.text?.secondary }} />
                          <span style={{ color: theme.colors.text?.secondary }}>
                            {asset.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3" style={{ color: theme.colors.text?.secondary }} />
                          <span style={{ color: theme.colors.text?.secondary }}>
                            {asset.volume}
                          </span>
                        </div>
                      </div>

                      {asset.value > totalValue * 0.1 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span style={{ color: theme.colors.text?.secondary }}>Market Cap:</span>
                            <span style={{ color: theme.colors.text?.primary }}>{asset.marketCap}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span style={{ color: theme.colors.text?.secondary }}>Signal:</span>
                            <span style={{ color: getSignalColor(asset.signal) }}>{asset.signal}</span>
                          </div>
                          {asset.stakingAPY && (
                            <div className="flex justify-between text-xs">
                              <span style={{ color: theme.colors.text?.secondary }}>APY:</span>
                              <span style={{ color: theme.colors.text?.success }}>{asset.stakingAPY}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetHeatmap;