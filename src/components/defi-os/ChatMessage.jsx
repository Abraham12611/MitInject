import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const ChatMessage = ({ message, isUser = true, theme, onAgentClick }) => {
  const messageSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: {
      tension: 220,
      friction: 24
    }
  });

  return (
    <animated.div 
      style={messageSpring} 
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div 
        className={`
          flex-shrink-0 w-8 h-8 rounded-full 
          flex items-center justify-center
          backdrop-blur-sm border overflow-hidden
          ${!isUser && 'cursor-pointer hover:scale-105 transition-transform'}
        `}
        style={{
          background: theme ? `${theme.colors.secondary}80` : 'transparent',
          borderColor: theme ? theme.colors.border : 'transparent',
          color: theme ? theme.colors?.text?.primary || theme.colors.text : 'inherit',
          boxShadow: theme.colors.effects?.glow
        }}
        onClick={() => !isUser && onAgentClick?.()}
      >
        {isUser ? (
          '👤'
        ) : (
          <img 
            src="/assets/characters/sample_for_agent.png"
            alt="AI Agent"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div 
        className={`
          max-w-[80%] 
          backdrop-blur-sm rounded-2xl px-4 py-2
          border
        `}
        style={{
          background: theme ? `${theme.colors.secondary}80` : 'transparent',
          borderColor: theme ? theme.colors.border : 'transparent',
          color: theme ? theme.colors?.text?.primary || theme.colors.text : 'inherit',
          boxShadow: theme.colors.effects?.glow
        }}
      >
        <p className="text-sm" style={{ color: theme ? theme.colors?.text?.primary || theme.colors.text : 'inherit' }}>
          {message.text}
        </p>
        <span className="text-xs mt-1 block" style={{ color: theme ? theme.colors?.text?.secondary || theme.colors.text : 'inherit' }}>
          {message.timestamp}
        </span>
      </div>
    </animated.div>
  );
};

export default ChatMessage; 