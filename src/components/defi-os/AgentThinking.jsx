import React, { useState, useEffect } from 'react';

const AgentThinking = ({ theme, message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="rounded-lg p-4 mb-2 font-mono text-sm max-w-[85%]"
      style={{
        background: `${theme.colors.secondary}80`,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors?.text?.secondary || theme.colors.text,
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ background: theme.colors.accent }}
        />
        <span className="text-xs uppercase tracking-wider">Thinking{dots}</span>
      </div>

      <div className="opacity-80 leading-relaxed">
        {message}
      </div>
    </div>
  );
};

export default AgentThinking;