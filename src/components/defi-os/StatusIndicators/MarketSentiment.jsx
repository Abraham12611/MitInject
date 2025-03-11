import React, { useState, useEffect } from 'react';
import { Gauge } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

const MarketSentiment = ({ theme, onClick }) => {
  const [value, setValue] = useState(75);
  const [trend, setTrend] = useState('up');

  // Simulate market sentiment changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setValue(prev => {
        const change = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, Math.min(100, prev + change));
        setTrend(change > 0 ? 'up' : 'down');
        return newValue;
      });
    }, 5000);

    return () => clearInterval(updateInterval);
  }, []);

  const getColor = (value) => {
    // Use theme colors for different sentiment levels
    if (value <= 20) return theme.colors.text?.error || '#E53935';
    if (value <= 40) return theme.colors.text?.warning || '#FB8C00';
    if (value <= 60) return theme.colors.text?.neutral || '#FDD835';
    if (value <= 80) return theme.colors.text?.success || '#7CB342';
    return theme.colors.text?.accent || '#00897B';
  };

  const getSentimentLabel = (value) => {
    if (value <= 20) return 'Extreme Fear';
    if (value <= 40) return 'Fear';
    if (value <= 60) return 'Neutral';
    if (value <= 80) return 'Greed';
    return 'Extreme Greed';
  };

  const getTooltipContent = () => {
    return (
      <div className="p-2 max-w-xs">
        <h4 className="font-medium mb-1">Market Sentiment</h4>
        <div className="text-sm opacity-90">
          <p>Fear & Greed Index: {value}</p>
          <p>Status: {getSentimentLabel(value)}</p>
          <p className="mt-1 text-xs opacity-75">
            Based on trading volume, volatility, social media, and dominance metrics
          </p>
        </div>
      </div>
    );
  };

  return (
    <Tooltip content={getTooltipContent()}>
      <div 
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-opacity-10 cursor-pointer hover:bg-opacity-20 transition-all"
        style={{ 
          background: theme.colors.accent,
          color: theme.colors.text.primary 
        }}
        onClick={onClick}
      >
        <Gauge className="w-4 h-4" />
        <div className="w-16 h-2 rounded-full bg-opacity-20" style={{ background: theme.colors.background }}>
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${value}%`,
              background: getColor(value)
            }}
          />
        </div>
      </div>
    </Tooltip>
  );
};

export default MarketSentiment; 