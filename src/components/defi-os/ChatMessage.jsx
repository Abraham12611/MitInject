import React from 'react';
import ChatDataDisplay from './ChatDataDisplay';

const ChatMessage = ({ message, isUser, theme, onAgentClick }) => {
  const renderContent = () => {
    // If the message has a display object, render the appropriate display
    if (message.display) {
      return <ChatDataDisplay
        type={message.display.type}
        data={message.display.data}
        theme={theme}
        isPreview={message.display.isPreview}
      />;
    }

    // Otherwise, render text content
    return (
      <div className="whitespace-pre-wrap">
        {message.content}
      </div>
    );
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          flex
          ${isUser ? 'flex-row-reverse' : 'flex-row'}
          items-start
          gap-2
          max-w-[85%]
        `}
      >
        {/* User Avatar or Agent Avatar */}
        {!isUser ? (
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
            onClick={onAgentClick}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/assets/characters/agent.mp4" type="video/mp4" />
              <img
                src="/assets/characters/sample_for_agent.png"
                alt="Agent"
                className="w-full h-full object-cover"
              />
            </video>
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-full bg-opacity-30 flex items-center justify-center flex-shrink-0"
            style={{
              background: theme.colors.accent,
              color: theme.colors?.text?.primary || theme.colors.text
            }}
          >
            U
          </div>
        )}

        {/* Message Content */}
        <div
          className={`
            rounded-lg
            p-3
            ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'}
          `}
          style={{
            background: isUser
              ? `${theme.colors.accent}40`
              : `${theme.colors.secondary}80`,
            borderColor: theme.colors.border,
            color: theme.colors?.text?.primary || theme.colors.text,
          }}
        >
          {renderContent()}

          {/* Timestamp if available */}
          {message.timestamp && (
            <div
              className="text-xs mt-1 opacity-60"
              style={{ color: theme.colors?.text?.secondary || theme.colors.text }}
            >
              {message.timestamp}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;