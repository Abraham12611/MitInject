import React from 'react';
import { Line } from 'recharts';
import { Loader2, TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';
import { PortfolioAnalytics as PortfolioAnalyticsType } from '@/services/portfolio-analytics';

interface Props {
  analytics: PortfolioAnalyticsType;
  isLoading: boolean;
  error: string | null;
  theme: any;
}

const PortfolioAnalytics: React.FC<Props> = ({
  analytics,
  isLoading,
  error,
  theme
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.colors.accent }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">{error}</div>
    );
  }

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(parseFloat(value));
  };

  const formatPercentage = (value: string) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Risk Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="p-4 rounded-lg"
          style={{ background: theme.colors.secondary }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4" style={{ color: theme.colors.accent }} />
            <h3 style={{ color: theme.colors?.text?.primary }}>Sharpe Ratio</h3>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: theme.colors?.text?.primary }}
          >
            {parseFloat(analytics.riskMetrics.sharpeRatio).toFixed(2)}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: theme.colors?.text?.secondary }}
          >
            Risk-adjusted return
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{ background: theme.colors.secondary }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: theme.colors.accent }} />
            <h3 style={{ color: theme.colors?.text?.primary }}>Volatility</h3>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: theme.colors?.text?.primary }}
          >
            {formatPercentage(analytics.riskMetrics.volatility)}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: theme.colors?.text?.secondary }}
          >
            30-day rolling
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{ background: theme.colors.secondary }}
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4" style={{ color: theme.colors.accent }} />
            <h3 style={{ color: theme.colors?.text?.primary }}>Diversification</h3>
          </div>
          <div
            className="text-2xl font-bold"
            style={{ color: theme.colors?.text?.primary }}
          >
            {formatPercentage(analytics.riskMetrics.diversificationScore)}
          </div>
          <div
            className="text-sm mt-1"
            style={{ color: theme.colors?.text?.secondary }}
          >
            Portfolio score
          </div>
        </div>
      </div>

      {/* Historical Performance */}
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.colors.secondary }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: theme.colors?.text?.primary }}
        >
          Historical Performance
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.historicalPerformance}>
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                style={{ fill: theme.colors?.text?.secondary }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                style={{ fill: theme.colors?.text?.secondary }}
              />
              <Tooltip
                contentStyle={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px'
                }}
                formatter={(value: any) => [formatCurrency(value), 'Portfolio Value']}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.colors.accent}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Position Analysis */}
      <div
        className="p-4 rounded-lg"
        style={{ background: theme.colors.secondary }}
      >
        <h3
          className="text-lg font-medium mb-4"
          style={{ color: theme.colors?.text?.primary }}
        >
          Position Analysis
        </h3>
        <div className="space-y-4">
          {analytics.positions.map((position, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: theme.colors.background }}
            >
              <div>
                <div
                  className="font-medium"
                  style={{ color: theme.colors?.text?.primary }}
                >
                  {position.denom}
                </div>
                <div
                  className="text-sm"
                  style={{ color: theme.colors?.text?.secondary }}
                >
                  {position.quantity} tokens • {position.type}
                </div>
              </div>
              <div className="text-right">
                <div style={{ color: theme.colors?.text?.primary }}>
                  {formatCurrency(position.value)}
                </div>
                <div
                  className={parseFloat(position.pnl) >= 0 ? 'text-green-500' : 'text-red-500'}
                >
                  {parseFloat(position.pnl) >= 0 ? '+' : ''}{formatCurrency(position.pnl)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;