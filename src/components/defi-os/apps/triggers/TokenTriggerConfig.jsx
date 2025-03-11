'use client'

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const TokenTriggerConfig = ({ theme, trigger, onBack, onSave }) => {
  const [config, setConfig] = useState({
    token: '',
    threshold: '',
    timeframe: '1h',
    percentage: ''
  });

  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const renderConfigFields = () => {
    switch (trigger.id) {
      case 'price-below':
      case 'price-above':
        return (
          <div className="space-y-4">
            <div>
              <label 
                className="block mb-2 text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Token
              </label>
              <input
                type="text"
                placeholder="Enter token symbol or address"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
              />
            </div>
            <div>
              <label 
                className="block mb-2 text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Price Threshold (USD)
              </label>
              <input
                type="number"
                placeholder="Enter price threshold"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.threshold}
                onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
              />
            </div>
          </div>
        );

      case 'price-change':
        return (
          <div className="space-y-4">
            <div>
              <label 
                className="block mb-2 text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Token
              </label>
              <input
                type="text"
                placeholder="Enter token symbol or address"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label 
                  className="block mb-2 text-sm font-medium"
                  style={{ color: theme.colors.text.primary }}
                >
                  Change Percentage
                </label>
                <input
                  type="number"
                  placeholder="e.g., 5"
                  className="w-full p-3 rounded-lg"
                  style={{ 
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border}`
                  }}
                  value={config.percentage}
                  onChange={(e) => setConfig({ ...config, percentage: e.target.value })}
                />
              </div>
              <div>
                <label 
                  className="block mb-2 text-sm font-medium"
                  style={{ color: theme.colors.text.primary }}
                >
                  Time Frame
                </label>
                <select
                  className="w-full p-3 rounded-lg"
                  style={{ 
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border}`
                  }}
                  value={config.timeframe}
                  onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                >
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="4h">4 hours</option>
                  <option value="24h">24 hours</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'volume-spike':
        return (
          <div className="space-y-4">
            <div>
              <label 
                className="block mb-2 text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Token
              </label>
              <input
                type="text"
                placeholder="Enter token symbol or address"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
              />
            </div>
            <div>
              <label 
                className="block mb-2 text-sm font-medium"
                style={{ color: theme.colors.text.primary }}
              >
                Volume Threshold (Multiple of average)
              </label>
              <input
                type="number"
                placeholder="e.g., 3 (3x average volume)"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.threshold}
                onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
              />
            </div>
          </div>
        );

      // For whale-movement, cex-listing, and verification
      // these don't need additional configuration beyond token selection
      default:
        return (
          <div>
            <label 
              className="block mb-2 text-sm font-medium"
              style={{ color: theme.colors.text.primary }}
            >
              Token
            </label>
            <input
              type="text"
              placeholder="Enter token symbol or address"
              className="w-full p-3 rounded-lg"
              style={{ 
                backgroundColor: theme.colors.secondary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.border}`
              }}
              value={config.token}
              onChange={(e) => setConfig({ ...config, token: e.target.value })}
            />
          </div>
        );
    }
  };

  const handleSave = async () => {
    // Validate fields
    if (!config.token.trim()) {
      setError('Please enter a token');
      return;
    }

    // ... other validation ...

    try {
      setStatus('loading');
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave(config);  // Pass config back up
      setStatus('success');
      
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to save trigger');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div 
        className="flex items-center gap-4 p-4 border-b" 
        style={{ borderColor: theme.colors.border }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.colors.text.primary }} />
        </button>
        <div>
          <h2 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Configure Trigger
          </h2>
          <p 
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            {trigger.title}
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {renderConfigFields()}
          
          {/* Save Button */}
          <button
            className="w-full mt-6 p-4 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: theme.colors.accent,
              color: theme.colors.text.onAccent
            }}
            onClick={handleSave}
          >
            Save Trigger
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenTriggerConfig; 