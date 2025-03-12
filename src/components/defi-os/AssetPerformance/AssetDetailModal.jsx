import React from 'react';
import {
  X, TrendingUp, TrendingDown, DollarSign, BarChart2,
  Wallet, Lock, Building2, ArrowUpRight, Clock, Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AssetDetailModal = ({ asset, isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  // Sample historical data - in real app, fetch from API
  const historicalData = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(),
    price: asset.price * (1 + Math.sin(i/3) * 0.1)
  }));

  // Sample holdings distribution - in real app, fetch from user's data
  const holdings = [
    {
      type: 'Wallet',
      amount: asset.holdings * 0.4,
      value: asset.value * 0.4,
      location: 'Injective Wallet',
      icon: Wallet
    },
    {
      type: 'Staked',
      amount: asset.holdings * 0.3,
      value: asset.value * 0.3,
      location: 'Validator: Figment',
      apy: asset.stakingAPY,
      icon: Lock
    },
    {
      type: 'Lending',
      amount: asset.holdings * 0.2,
      value: asset.value * 0.2,
      location: 'Helix Protocol',
      apy: '8.2%',
      icon: Building2
    },
    {
      type: 'LP',
      amount: asset.holdings * 0.1,
      value: asset.value * 0.1,
      location: 'Astroport INJ/USDT',
      apy: '12.4%',
      icon: ArrowUpRight
    }
  ];

  return (
    <div className="fixed inset-0 z-[200]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="absolute inset-8 rounded-xl overflow-hidden"
        style={{
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.colors.effects?.glow
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.colors.border }}>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.text?.primary }}>
              {asset.name} ({asset.symbol})
            </h2>
            <div
              className="px-3 py-1 rounded-lg text-sm"
              style={{
                background: asset.change >= 0 ? 'rgba(52, 211, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: asset.change >= 0 ? theme.colors.text?.success : theme.colors.text?.error
              }}
            >
              {asset.change >= 0 ? <TrendingUp className="w-4 h-4 inline mr-1" /> : <TrendingDown className="w-4 h-4 inline mr-1" />}
              {asset.change.toFixed(2)}%
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" style={{ color: theme.colors.text?.secondary }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100%-5rem)] overflow-y-auto">
          {/* Price Chart */}
          <div className="col-span-8 rounded-lg p-4" style={{ background: theme.colors.secondary }}>
            <h3 className="text-lg font-medium mb-4" style={{ color: theme.colors.text?.primary }}>
              Price Chart
            </h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                  <XAxis
                    dataKey="time"
                    stroke={theme.colors.text?.secondary}
                    tick={{ fill: theme.colors.text?.secondary }}
                  />
                  <YAxis
                    stroke={theme.colors.text?.secondary}
                    tick={{ fill: theme.colors.text?.secondary }}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip
                    contentStyle={{
                      background: theme.colors.background,
                      border: `1px solid ${theme.colors.border}`
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={theme.colors.accent}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Stats */}
          <div className="col-span-4 space-y-4">
            <div className="rounded-lg p-4" style={{ background: theme.colors.secondary }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: theme.colors.text?.primary }}>
                Market Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text?.secondary }}>Price</span>
                  <span style={{ color: theme.colors.text?.primary }}>${asset.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text?.secondary }}>Market Cap</span>
                  <span style={{ color: theme.colors.text?.primary }}>{asset.marketCap}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text?.secondary }}>24h Volume</span>
                  <span style={{ color: theme.colors.text?.primary }}>{asset.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text?.secondary }}>Volatility</span>
                  <span style={{ color: theme.colors.text?.primary }}>{asset.volatility}</span>
                </div>
              </div>
            </div>

            {/* Holdings Distribution */}
            <div className="rounded-lg p-4" style={{ background: theme.colors.secondary }}>
              <h3 className="text-lg font-medium mb-4" style={{ color: theme.colors.text?.primary }}>
                Your Holdings
              </h3>
              <div className="space-y-4">
                {holdings.map((holding, index) => {
                  const Icon = holding.icon;
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-lg"
                      style={{ background: `${theme.colors.background}80` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" style={{ color: theme.colors.accent }} />
                        <span className="font-medium" style={{ color: theme.colors.text?.primary }}>
                          {holding.type}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span style={{ color: theme.colors.text?.secondary }}>Amount</span>
                          <span style={{ color: theme.colors.text?.primary }}>
                            {holding.amount.toLocaleString()} {asset.symbol}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: theme.colors.text?.secondary }}>Value</span>
                          <span style={{ color: theme.colors.text?.primary }}>
                            ${holding.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: theme.colors.text?.secondary }}>Location</span>
                          <span style={{ color: theme.colors.text?.primary }}>{holding.location}</span>
                        </div>
                        {holding.apy && (
                          <div className="flex justify-between">
                            <span style={{ color: theme.colors.text?.secondary }}>APY</span>
                            <span style={{ color: theme.colors.text?.success }}>{holding.apy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailModal;