'use client'

import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import ActionConfig from './ActionConfig';

const ActionList = ({ theme, service, onBack, onSaveAction, isExpanded }) => {
  const [selectedAction, setSelectedAction] = useState(null);

  // Get the appropriate text color for accent backgrounds
  const getAccentTextColor = () => {
    // Special case for Matrix theme's green accent
    if (theme.name?.toLowerCase() === 'matrix') {
      return '#000000';
    }
    // For dark themes like Warm Monochrome
    if (theme.name?.toLowerCase().includes('warm')) {
      return '#FFFFFF';
    }
    return theme.colors.text?.onAccent || theme.colors.text?.primary || '#FFFFFF';
  };

  // Show pro banner if action is pro
  const renderProBanner = (action) => {
    if (!action?.isPro) return null;

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

  if (selectedAction) {
    return (
      <>
        {renderProBanner(selectedAction)}
        <ActionConfig
          theme={theme}
          service={service}
          action={selectedAction}
          onBack={() => setSelectedAction(null)}
          onSave={(action, config) => {
            console.log('ActionList saving:', { action, config });
            onSaveAction(action, config);
          }}
        />
      </>
    );
  }

  const ActionCard = ({ action }) => {
    if (!action) return null;
    
    const ActionIcon = action.icon || Zap;

    return (
      <button
        onClick={() => setSelectedAction(action)}
        className={`w-full p-6 rounded-xl transition-all duration-200 hover:scale-[1.02] text-left
                   ${isExpanded ? '' : 'mb-3'}`}
        style={{ 
          backgroundColor: theme.colors.secondary,
          border: `1px solid ${theme.colors.border}`
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: service.color + '20' }}
          >
            <ActionIcon 
              className="w-6 h-6"
              style={{ color: service.color }}
            />
          </div>
          <div>
            <h3 
              className="text-lg font-semibold mb-1"
              style={{ color: theme.colors.text.primary }}
            >
              {action.title || 'Unknown Action'}
            </h3>
            <p 
              className="text-sm"
              style={{ color: theme.colors.text.secondary }}
            >
              {action.description || 'No description available'}
            </p>
            {action.isPro && (
              <span 
                className="inline-block px-2 py-1 rounded text-xs font-medium mt-2"
                style={{ 
                  backgroundColor: theme.colors.accent,
                  color: getAccentTextColor()
                }}
              >
                Pro
              </span>
            )}
          </div>
        </div>
      </button>
    );
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
          <h2 
            className="text-2xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Choose an action
          </h2>
          <p 
            className="text-sm"
            style={{ color: theme.colors.text.secondary }}
          >
            {service?.name || 'Service'} Actions
          </p>
        </div>
      </div>

      {/* Actions Layout */}
      <div className="flex-1 overflow-auto p-4">
        <div className={isExpanded 
          ? "grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto"
          : "flex flex-col max-w-2xl mx-auto"
        }>
          {(service?.actions || []).map(action => (
            <ActionCard 
              key={action?.id || Math.random()} 
              action={action}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionList; 