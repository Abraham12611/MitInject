'use client'

import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Loader } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

const ActionConfig = ({ theme, service, action, onBack, onSave }) => {
  const [config, setConfig] = useState({
    token: '',
    amount: '',
    recipient: '',
    message: '',
    slippage: '0.5',
    tokenIn: '',
    tokenOut: '',
    amountIn: '',
    amountOut: '',
    leverage: '1',
    position: 'long',
    duration: '30',
    collateral: '',
    loanAmount: '',
    recipients: '',
    distributionType: 'equal'
  });
  
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  // Button press animation
  const [pressed, setPressed] = useState(false);
  const buttonAnimation = useSpring({
    transform: pressed ? 'scale(0.95)' : 'scale(1)',
    config: { tension: 300, friction: 10 }
  });

  const renderConfigFields = () => {
    switch (service.id) {
      case 'wallet':
        return renderWalletFields();
      case 'cetus':
        return renderCetusFields();
      case 'bluefin':
        return renderBluefinFields();
      case 'suilend':
        return renderSuilendFields();
      case 'navi':
        return renderNaviFields();
      case 'twitter':
        return renderTwitterFields();
      default:
        return null;
    }
  };

  const renderWalletFields = () => {
    switch (action.id) {
      case 'send-token':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount to send"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="Enter recipient's wallet address"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.recipient}
                onChange={(e) => setConfig({ ...config, recipient: e.target.value })}
              />
            </div>
          </div>
        );

      case 'distribute-tokens':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Total Amount
              </label>
              <input
                type="number"
                placeholder="Enter total amount to distribute"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Recipient Addresses
              </label>
              <textarea
                placeholder="Enter wallet addresses (one per line)"
                className="w-full p-3 rounded-lg resize-none h-32"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.recipients}
                onChange={(e) => setConfig({ ...config, recipients: e.target.value })}
              />
              <p className="mt-1 text-sm" style={{ color: theme.colors.text.secondary }}>
                Maximum 20 addresses
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Distribution Type
              </label>
              <select
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.distributionType}
                onChange={(e) => setConfig({ ...config, distributionType: e.target.value })}
              >
                <option value="equal">Equal Distribution</option>
                <option value="weighted">Weighted Distribution</option>
              </select>
            </div>
          </div>
        );
    }
  };

  const renderCetusFields = () => {
    switch (action.id) {
      case 'swap':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Token to Swap
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
                value={config.tokenIn}
                onChange={(e) => setConfig({ ...config, tokenIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount to Swap
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amountIn}
                onChange={(e) => setConfig({ ...config, amountIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Token to Receive
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
                value={config.tokenOut}
                onChange={(e) => setConfig({ ...config, tokenOut: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Slippage Tolerance (%)
              </label>
              <input
                type="number"
                placeholder="0.5"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.slippage}
                onChange={(e) => setConfig({ ...config, slippage: e.target.value })}
              />
            </div>
          </div>
        );

      case 'add-liquidity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                First Token
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
                value={config.tokenIn}
                onChange={(e) => setConfig({ ...config, tokenIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                First Token Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amountIn}
                onChange={(e) => setConfig({ ...config, amountIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Second Token
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
                value={config.tokenOut}
                onChange={(e) => setConfig({ ...config, tokenOut: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Second Token Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amountOut}
                onChange={(e) => setConfig({ ...config, amountOut: e.target.value })}
              />
            </div>
          </div>
        );

      case 'remove-liquidity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Pool
              </label>
              <input
                type="text"
                placeholder="Enter pool address"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.pool}
                onChange={(e) => setConfig({ ...config, pool: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount to Remove (%)
              </label>
              <input
                type="number"
                placeholder="Enter percentage"
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
          </div>
        );
    }
  };

  const renderBluefinFields = () => {
    switch (action.id) {
      case 'swap':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Token to Swap
              </label>
              <input
                type="text"
                placeholder="e.g., SUI"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.tokenIn}
                onChange={(e) => setConfig({ ...config, tokenIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount to Swap
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amountIn}
                onChange={(e) => setConfig({ ...config, amountIn: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Token to Receive
              </label>
              <input
                type="text"
                placeholder="e.g., USDC"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.tokenOut}
                onChange={(e) => setConfig({ ...config, tokenOut: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Slippage Tolerance (%)
              </label>
              <input
                type="number"
                placeholder="0.5"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.slippage}
                onChange={(e) => setConfig({ ...config, slippage: e.target.value })}
              />
            </div>
          </div>
        );
      case 'open-long':
      case 'open-short':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Trading Pair
              </label>
              <input
                type="text"
                placeholder="e.g., BTC-USDC"
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Position Size
              </label>
              <input
                type="number"
                placeholder="Enter position size"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Leverage
              </label>
              <select
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.leverage}
                onChange={(e) => setConfig({ ...config, leverage: e.target.value })}
              >
                <option value="1">1x</option>
                <option value="2">2x</option>
                <option value="5">5x</option>
                <option value="10">10x</option>
              </select>
            </div>
          </div>
        );
    }
  };

  const renderSuilendFields = () => {
    switch (action.id) {
      case 'supply':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Asset to Supply
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount to supply"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
          </div>
        );

      case 'borrow':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Asset to Borrow
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount to borrow"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
          </div>
        );
    }
  };

  const renderNaviFields = () => {
    switch (action.id) {
      case 'supply':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Asset to Supply
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount to supply"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
          </div>
        );

      case 'borrow':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Asset to Borrow
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
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Amount
              </label>
              <input
                type="number"
                placeholder="Enter amount to borrow"
                className="w-full p-3 rounded-lg"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.amount}
                onChange={(e) => setConfig({ ...config, amount: e.target.value })}
              />
            </div>
          </div>
        );
    }
  };

  const renderTwitterFields = () => {
    switch (action.id) {
      case 'post-tweet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: theme.colors.text.primary }}>
                Tweet Message
              </label>
              <textarea
                placeholder="Enter your tweet message"
                className="w-full p-3 rounded-lg resize-none h-32"
                style={{ 
                  backgroundColor: theme.colors.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`
                }}
                value={config.message}
                onChange={(e) => setConfig({ ...config, message: e.target.value })}
              />
            </div>
          </div>
        );
      // Add thread configuration...
    }
  };

  const handleSave = async () => {
    try {
      setStatus('loading');
      setError('');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pass the actual config values, not the action object
      console.log('ActionConfig saving:', { action, config });
      onSave(action, {
        token: config.token,
        amount: config.amount,
        recipient: config.recipient,
        message: config.message,
        slippage: config.slippage,
        tokenIn: config.tokenIn,
        tokenOut: config.tokenOut,
        amountIn: config.amountIn,
        amountOut: config.amountOut,
        leverage: config.leverage,
        position: config.position,
        duration: config.duration,
        collateral: config.collateral,
        loanAmount: config.loanAmount,
        recipients: config.recipients,
        distributionType: config.distributionType
      });
      setStatus('success');
      
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Failed to save action');
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b" style={{ borderColor: theme.colors.border }}>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: theme.colors.text.primary }} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
            Configure Action
          </h2>
          <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
            {action.title}
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          {renderConfigFields()}
          
          {/* Error Message */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: theme.colors.error }}>
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Save Button */}
          <animated.button
            className="w-full mt-6 p-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            style={{ 
              ...buttonAnimation,
              backgroundColor: theme.colors.accent,
              color: theme.colors.text.onAccent
            }}
            onClick={handleSave}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <Loader className="w-5 h-5 animate-spin" /> :
             status === 'success' ? <Check className="w-5 h-5" /> :
             'Save Action'}
          </animated.button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfig; 