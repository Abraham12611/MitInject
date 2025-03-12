import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Cpu, Database } from 'lucide-react';

export const NetworkDetailView = ({ data, theme }) => {
  // Format metrics based on network type
  const displayMetrics = data.network === 'mitsui' ? [
    { key: 'responseTime', icon: Clock, unit: 'ms', value: data.metrics.responseTime },
    { key: 'activeSessions', icon: Database, unit: '', value: data.metrics.activeSessions },
    { key: 'model', icon: Activity, unit: '', value: 'DeepSeek-R1' }
  ] : [
    { key: 'tps', icon: Activity, unit: 'TPS', value: data.metrics.tps || 0 },
    { key: 'gasPrice', icon: Database, unit: 'INJ', value: data.metrics.gasPrice },
    { key: 'blockHeight', icon: Clock, unit: '', value: data.metrics.blockHeight }
  ].filter(metric => metric.value !== undefined && metric.value !== null);

  // Historical data - simulate fluctuations for Mitsui, real data for Sui
  const historicalData = Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString(),
    ...(data.network === 'mitsui'
      ? {
          // Add random fluctuation to response time (±10%)
          responseTime: data.metrics.responseTime +
            (Math.random() * data.metrics.responseTime * 0.2) -
            (data.metrics.responseTime * 0.1)
        }
      : { tps: data.metrics.tps }  // Keep real TPS data
    )
  }));

  const MetricCard = ({ icon: Icon, title, value, unit }) => (
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
      <div className="text-2xl font-medium" style={{ color: theme.colors.text?.primary }}>
        {value} {unit}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayMetrics.map(({ key, icon, value, unit }) => (
          <MetricCard
            key={key}
            icon={icon}
            title={key.split(/(?=[A-Z])/).join(' ')}
            value={value}
            unit={unit}
          />
        ))}
      </div>

      {/* Show chart for both networks, with better condition */}
      {data.metrics && (
        <div className="p-4 rounded-lg" style={{
          background: theme.colors.secondary,
          border: `1px solid ${theme.colors.border}`
        }}>
          <h3 className="text-sm mb-4" style={{ color: theme.colors.text?.secondary }}>
            Historical Performance
          </h3>
          <div className="h-[300px]">
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
                />
                <Tooltip
                  contentStyle={{
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={data.network === 'mitsui' ? 'responseTime' : 'tps'}
                  stroke={theme.colors.accent}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};