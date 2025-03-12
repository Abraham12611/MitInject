import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Gauge, Volume2, Activity, BarChart2 } from 'lucide-react';

export const SentimentDetailView = ({ data, theme }) => {
  const { value, trend } = data;

  // Simulated historical data
  const historicalData = Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() - (23 - i) * 3600000).toLocaleTimeString(),
    value: Math.max(0, Math.min(100, value + Math.sin(i) * 20))
  }));

  const getGaugeRotation = (value) => {
    // Convert 0-100 to -90 to 90 degrees
    return (value / 100) * 180 - 90;
  };

  const MetricCard = ({ icon: Icon, title, value, trend }) => (
    <div
      className="p-4 rounded-lg"
      style={{
        background: theme.colors.secondary,
        border: `1px solid ${theme.colors.border}`
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: theme.colors.text?.secondary }} />
        <span className="text-sm" style={{ color: theme.colors.text?.secondary }}>{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-medium" style={{ color: theme.colors.text?.primary }}>
          {value}
        </span>
        {trend && (
          <span
            className="text-sm mb-1"
            style={{
              color: trend === 'up'
                ? theme.colors.text?.success || '#4CAF50'
                : theme.colors.text?.error || '#f44336'
            }}
          >
            {trend === 'up' ? '↑' : '↓'} {Math.round(Math.random() * 5)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Gauge Section */}
      <div className="flex justify-center">
        <div className="relative w-48 h-24">
          <div
            className="absolute inset-0 rounded-t-full"
            style={{
              background: `conic-gradient(
                ${theme.colors.text?.error || '#f44336'} 0deg,
                ${theme.colors.text?.warning || '#FB8C00'} 60deg,
                ${theme.colors.text?.neutral || '#FDD835'} 120deg,
                ${theme.colors.text?.success || '#4CAF50'} 180deg
              )`,
              clipPath: 'polygon(0 50%, 100% 50%, 100% 0, 0 0)'
            }}
          />
          <div
            className="absolute left-1/2 bottom-0 w-1 h-[60%] origin-bottom"
            style={{
              background: theme.colors.text?.primary,
              transform: `translateX(-50%) rotate(${getGaugeRotation(value)}deg)`,
              transition: 'transform 0.5s ease-out'
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-bold"
            style={{ color: theme.colors.text?.primary }}
          >
            {value}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          icon={Volume2}
          title="Trading Volume"
          value="$2.4B"
          trend="up"
        />
        <MetricCard
          icon={Activity}
          title="Perp Activity"
          value="32.5"
          trend="down"
        />
        <MetricCard
          icon={BarChart2}
          title="INJ Sentiment"
          value="8.4"
          trend="up"
        />
      </div>

      {/* Historical Chart */}
      <div
        className="p-4 rounded-lg"
        style={{
          background: theme.colors.secondary,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <h3 className="text-sm mb-4" style={{ color: theme.colors.text?.secondary }}>24h Sentiment History</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
              <XAxis
                dataKey="time"
                stroke={theme.colors.text?.secondary}
                tick={{ fill: theme.colors.text?.secondary }}
              />
              <YAxis
                domain={[0, 100]}
                stroke={theme.colors.text?.secondary}
                tick={{ fill: theme.colors.text?.secondary }}
              />
              <Tooltip
                contentStyle={{
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.colors.text?.accent}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};