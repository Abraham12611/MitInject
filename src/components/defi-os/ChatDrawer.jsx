import React, { useState } from 'react';
import { animated } from '@react-spring/web';
import { Settings, X } from 'lucide-react';
import { ChatMessage } from '@/components/defi-os';
import ChatSettingsModal from './ChatSettingsModal';
import AgentThinking from './AgentThinking';

const ChatDrawer = ({
  chatContainerRef,
  chatDrawerSpring,
  isChatOpen,
  theme,
  chatMessages,
  setIsChatOpen,
  pendingMessage
}) => {
  const [showChatSettings, setShowChatSettings] = useState(false);

  return (
    <>
      <animated.div
        ref={chatContainerRef}
        style={{
          ...chatDrawerSpring,
          transformOrigin: 'right',
          pointerEvents: isChatOpen ? 'auto' : 'none',
          background: `${theme.colors.secondary}F2`,
          borderLeft: `1px solid ${theme.colors.border}`,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow
        }}
        className="
          fixed top-[33vh] right-0
          w-[33vw] h-[calc(67vh-3rem)]
          p-4 overflow-y-auto space-y-4
          shadow-xl
          z-[100]
          backdrop-blur-sm
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%)]
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:'none']
          [scrollbar-width:'none']
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>Chat</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChatSettings(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4 fade-in">
          {chatMessages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.isUser}
              theme={theme}
              onAgentClick={() => setShowChatSettings(true)}
            />
          ))}

          {/* Pending thinking message */}
          {pendingMessage && (
            <AgentThinking
              theme={theme}
              message={pendingMessage}
            />
          )}
        </div>
      </animated.div>

      <ChatSettingsModal
        isOpen={showChatSettings}
        onClose={() => setShowChatSettings(false)}
        theme={theme}
      />
    </>
  );
};

export default ChatDrawer;