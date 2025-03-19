import React from 'react';
import { ArrowUpRight, ArrowDownRight, Repeat, ExternalLink, BarChart3, ChevronRight } from 'lucide-react';

// Token Price Display
export const TokenPriceDisplay = ({ data, theme }) => {
  const { symbol, name, price, change24h, volume24h, marketCap } = data;

  const isPositive = change24h > 0;

  return (
    <div
      className="rounded-lg overflow-hidden mb-2"
      style={{
        background: `${theme.colors.secondary}80`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: `${theme.colors.background}CC` }}
          >
            {data.logo ? (
              <img src={data.logo} alt={symbol} className="w-7 h-7" />
            ) : (
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: theme.colors.accent }}
              >
                {symbol.substring(0, 2)}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              {name} ({symbol})
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="font-mono"
                style={{ color: theme.colors?.text?.secondary || theme.colors.text }}
              >
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </span>

              <span
                className="flex items-center gap-0.5"
                style={{ color: isPositive ? '#4ADE80' : '#F87171' }}
              >
                {isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(change24h).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              24h Volume
            </div>
            <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              ${(volume24h / 1000000).toFixed(2)}M
            </div>
          </div>

          <div>
            <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              Market Cap
            </div>
            <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              ${(marketCap / 1000000).toFixed(2)}M
            </div>
          </div>
        </div>
      </div>

      <div
        className="px-4 py-2 text-xs flex justify-end items-center gap-1"
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          color: theme.colors?.text?.secondary || theme.colors.text
        }}
      >
        Data from Injective Oracle
        <BarChart3 className="w-3 h-3" />
      </div>
    </div>
  );
};

// Portfolio Display
export const PortfolioDisplay = ({ data, theme }) => {
  const { assets, totalValue, change24h } = data;
  const isPositive = change24h > 0;

  return (
    <div
      className="rounded-lg overflow-hidden mb-2"
      style={{
        background: `${theme.colors.secondary}80`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3
            className="font-medium"
            style={{ color: theme.colors?.text?.primary || theme.colors.text }}
          >
            Your Portfolio
          </h3>

          <div className="flex flex-col items-end">
            <div
              className="text-lg font-mono"
              style={{ color: theme.colors?.text?.primary || theme.colors.text }}
            >
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div
              className="flex items-center gap-0.5 text-xs"
              style={{ color: isPositive ? '#4ADE80' : '#F87171' }}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {Math.abs(change24h).toFixed(2)}% today
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {assets.map((asset, index) => (
            <div key={index} className="flex justify-between items-center pb-2" style={{
              borderBottom: index < assets.length - 1 ? `1px solid ${theme.colors.border}` : 'none'
            }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: theme.colors.accent }}
                >
                  {asset.token.substring(0, 2)}
                </div>

                <div>
                  <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                    {asset.token}
                  </div>
                  <div className="text-xs" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                    {asset.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                  ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs" style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                  {asset.allocation}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-4 py-2 text-xs flex justify-between items-center"
        style={{
          borderTop: `1px solid ${theme.colors.border}`,
          color: theme.colors?.text?.secondary || theme.colors.text
        }}
      >
        <span>Updated just now</span>
        <div className="flex items-center gap-1">
          View on Injective <ExternalLink className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

// Swap Transaction Display
export const SwapDisplay = ({ data, theme, isPreview }) => {
  const { from, to, fee, txHash, route, priceImpact, status } = data;

  return (
    <div
      className="rounded-lg overflow-hidden mb-2"
      style={{
        background: `${theme.colors.secondary}80`,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="p-4">
        <h3
          className="font-medium mb-4 flex items-center gap-1"
          style={{ color: theme.colors?.text?.primary || theme.colors.text }}
        >
          <Repeat className="w-4 h-4" style={{ color: theme.colors.accent }} />
          {isPreview ? 'Swap Preview' : 'Swap Transaction'}
        </h3>

        <div className="flex items-center justify-between py-4">
          <div className="text-center">
            <div
              className="text-lg font-mono"
              style={{ color: theme.colors?.text?.primary || theme.colors.text }}
            >
              {from.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </div>
            <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              {from.token}
            </div>
          </div>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: theme.colors.accent }}
          >
            <ChevronRight className="w-5 h-5" color="#FFF" />
          </div>

          <div className="text-center">
            <div
              className="text-lg font-mono"
              style={{ color: theme.colors?.text?.primary || theme.colors.text }}
            >
              {to.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
            </div>
            <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              {to.token}
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm mt-4">
          <div className="flex justify-between">
            <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
              Fee
            </div>
            <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
              {fee} {from.token}
            </div>
          </div>

          {priceImpact && (
            <div className="flex justify-between">
              <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                Price Impact
              </div>
              <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                {priceImpact}
              </div>
            </div>
          )}

          {!isPreview && status && (
            <div className="flex justify-between">
              <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }}>
                Status
              </div>
              <div
                className="flex items-center gap-1"
                style={{ color: status === "Completed" ? "#4ADE80" : theme.colors?.text?.primary || theme.colors.text }}
              >
                {status}
                {status === "Completed" && (
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isPreview && (
        <div
          className="px-4 py-2 text-xs flex justify-between items-center"
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            color: theme.colors?.text?.secondary || theme.colors.text
          }}
        >
          <div className="font-mono truncate max-w-[150px]">
            TX: {txHash.substring(0, 8)}...{txHash.substring(txHash.length - 6)}
          </div>
          <div className="flex items-center gap-1">
            View on Explorer <ExternalLink className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
};

// Generic Data Display Container
const ChatDataDisplay = ({ type, data, theme, isPreview }) => {
  switch (type) {
    case 'token-price':
      return <TokenPriceDisplay data={data} theme={theme} />;
    case 'portfolio':
      return <PortfolioDisplay data={data} theme={theme} />;
    case 'swap':
      return <SwapDisplay data={data} theme={theme} isPreview={isPreview} />;
    default:
      return null;
  }
};

export default ChatDataDisplay;