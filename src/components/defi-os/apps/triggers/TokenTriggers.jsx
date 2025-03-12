'use client'

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import TokenTriggerConfig from './TokenTriggerConfig';

const tokenTriggers = [
  {
    id: 'price-below',
    title: 'Price drops below',
    description: 'This Trigger fires when a token\'s price falls below your specified threshold.',
    isPro: true
  },
  {
    id: 'price-above',
    title: 'Price increases above',
    description: 'This Trigger fires when a token\'s price rises above your specified threshold.',
    isPro: true
  },
  {
    id: 'price-change',
    title: 'Price changes rapidly',
    description: 'This Trigger fires when a token\'s price changes by X% within Y hours.',
    isPro: false
  },
  {
    id: 'volume-spike',
    title: 'Volume spike detected',
    description: 'This Trigger fires when trading volume exceeds normal levels by your specified threshold.',
    isPro: true
  },
  {
    id: 'perp-funding',
    title: 'Funding rate change',
    description: 'This Trigger fires when a perpetual market\'s funding rate exceeds your specified threshold.',
    isPro: true
  },
  {
    id: 'cex-listing',
    title: 'New CEX listing',
    description: 'This Trigger fires when the token gets listed on a new centralized exchange.',
    isPro: false
  },
  {
    id: 'verification',
    title: 'Token verification',
    description: 'This Trigger fires when the token gets verified on Injective Explorer.',
    isPro: false
  }
];

const TokenTriggers = ({ theme, onBack, isExpanded, onSaveTrigger }) => {
  const [selectedTrigger, setSelectedTrigger] = useState(null);

  // Show pro banner if trigger is pro
  const renderProBanner = (trigger) => {
    if (!trigger?.isPro) return null;

    return (
      <div
        className="w-full p-4 text-center text-white"
        style={{ backgroundColor: '#0096FF' }}
      >
        <div>This Applet uses features only available to Pro users.</div>
        <div>You need to upgrade to enable this Applet.</div>
      </div>
    );
  };

  if (selectedTrigger) {
    return (
      <>
        {renderProBanner(selectedTrigger)}
        <TokenTriggerConfig
          theme={theme}
          trigger={selectedTrigger}
          onBack={() => setSelectedTrigger(null)}
          onSave={(config) => onSaveTrigger(selectedTrigger, config)}
        />
      </>
    );
  }

  // Add helper function for Pro badge text color
  const getProBadgeTextColor = () => {
    // For Matrix theme, use dark text
    if (theme.name?.toLowerCase() === 'matrix') {
      return '#000000';
    }
    // For specific themes where we want light text
    if (theme.name?.toLowerCase().includes('synthwave') ||
        theme.name?.toLowerCase().includes('purple')) {
      return '#FFFFFF';
    }
    // For all other themes, use white text
    return '#FFFFFF';
  };

  const TriggerCard = ({ trigger, isExpanded }) => {
    const baseStyles = {
      backgroundColor: theme.colors.secondary,
      border: `1px solid ${theme.colors.border}`
    };

    const proBadgeStyles = {
      backgroundColor: theme.colors.accent,
      color: getProBadgeTextColor()  // Use our new helper function
    };

    if (isExpanded) {
      // Grid view (expanded)
      return (
        <button
          onClick={() => setSelectedTrigger(trigger)}
          className="aspect-square w-full p-6 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left relative"
          style={baseStyles}
        >
          <div className="h-full flex flex-col">
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              {trigger.title}
            </h3>
            <p
              className="text-sm flex-grow"
              style={{ color: theme.colors.text.secondary }}
            >
              {trigger.description}
            </p>
            {trigger.isPro && (
              <span
                className="absolute bottom-6 right-6 px-2 py-1 rounded text-xs font-medium"
                style={proBadgeStyles}  // Apply our new styles
              >
                Pro
              </span>
            )}
          </div>
        </button>
      );
    }

    // List view (minimized)
    return (
      <button
        onClick={() => setSelectedTrigger(trigger)}
        className="w-full p-4 rounded-xl transition-all duration-200 hover:scale-[1.01] text-left"
        style={baseStyles}
      >
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3
              className="font-semibold mb-1"
              style={{ color: theme.colors.text.primary }}
            >
              {trigger.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              {trigger.description}
            </p>
          </div>
          {trigger.isPro && (
            <span
              className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
              style={proBadgeStyles}  // Apply our new styles
            >
              Pro
            </span>
          )}
        </div>
      </button>
    );
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
            Choose a trigger
          </h2>
          <p
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            Token Price & Activity Triggers
          </p>
        </div>
      </div>

      {/* Responsive Triggers Layout */}
      <div className="flex-1 overflow-auto p-4">
        <div className={isExpanded
          ? "grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
          : "flex flex-col space-y-3 max-w-2xl mx-auto"
        }>
          {tokenTriggers.map(trigger => (
            <TriggerCard
              key={trigger.id}
              trigger={trigger}
              isExpanded={isExpanded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenTriggers;