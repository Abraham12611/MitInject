import React from 'react';
import { X } from 'lucide-react';
import { NetworkDetailView } from './NetworkDetailView';
import { SentimentDetailView } from './SentimentDetailView';

const StatusModal = ({ isOpen, onClose, type, data, theme }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[160]"
        onClick={onClose}
      />
      <div 
        className="fixed top-1/8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[161]"
        style={{
          background: theme.colors.background,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          boxShadow: theme.colors.effects?.glow
        }}
      >
        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: theme.colors.border }}>
          <h2 className="text-lg font-medium" style={{ color: theme.colors.text?.primary }}>
            {type === 'network' ? `${data.network} Status` : 'Market Sentiment Analysis'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: theme.colors.text?.secondary }} />
          </button>
        </div>
        <div className="p-6">
          {type === 'network' ? (
            <NetworkDetailView data={data} theme={theme} />
          ) : (
            <SentimentDetailView data={data} theme={theme} />
          )}
        </div>
      </div>
    </>
  );
};

export default StatusModal; 