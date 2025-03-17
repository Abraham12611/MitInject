import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useSpring } from '@react-spring/web';
import {
  ChatDrawer,
  TaskbarTerminal,
  AgentThinking
} from '@/components/defi-os';
import chatService from '@/services/ChatService';
import { getResponse, DEMO_RESPONSES } from '@/config/demo-chat';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get current formatted time
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Example component that demonstrates how to use chat services
const ChatExample = ({ theme }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [pendingMessage, setPendingMessage] = useState(null);
  const [pendingSwap, setPendingSwap] = useState(null);
  const chatContainerRef = useRef(null);

  // Spring animation for the chat drawer
  const chatDrawerSpring = useSpring({
    transform: isChatOpen ? 'translateX(0%)' : 'translateX(100%)',
    config: {
      tension: 210,
      friction: 20
    }
  });

  // Handle a new user message
  const handleSubmit = async (message) => {
    // Add user message to chat
    const userMessage = {
      id: generateId(),
      content: message,
      isUser: true,
      timestamp: getCurrentTime()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatOpen(true);

    // Check if this is a swap confirmation
    if (pendingSwap && (message.toLowerCase() === 'yes' || message.toLowerCase() === 'confirm')) {
      handleSwapConfirmation();
      return;
    }

    // First check for demo responses
    const commandLower = message.toLowerCase().trim();
    let demoResponse = null;

    // Check greetings first
    if (DEMO_RESPONSES.greetings[commandLower]) {
      demoResponse = DEMO_RESPONSES.greetings[commandLower];
    } else {
      // Check other categories
      for (const category in DEMO_RESPONSES) {
        if (category !== 'greetings' && DEMO_RESPONSES[category][commandLower]) {
          demoResponse = getResponse(category, commandLower);
          break;
        }
      }
    }

    if (demoResponse) {
      setChatMessages(prev => [...prev, {
        id: generateId(),
        content: demoResponse,
        isUser: false,
        timestamp: getCurrentTime()
      }]);
      return;
    }

    // Process the message with chatService
    try {
      // Parse intent and get responses
      const responses = await chatService.processMessage(message);

      // Add responses to chat
      setChatMessages(prev => [...prev, ...responses]);

      // Check if we're waiting for swap confirmation
      if (message.toLowerCase().includes('swap') && responses.some(r => r.content?.includes('proceed with this swap'))) {
        // Extract swap details from the message
        const swapMatch = message.match(/swap (\d+\.?\d*) (\w+) (to|for) (\w+)/i);
        if (swapMatch) {
          setPendingSwap({
            amount: parseFloat(swapMatch[1]),
            fromToken: swapMatch[2],
            toToken: swapMatch[4]
          });
        }
      } else {
        setPendingSwap(null);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setChatMessages(prev => [...prev, {
        id: generateId(),
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        isUser: false,
        timestamp: getCurrentTime()
      }]);
    }
  };

  // Handle swap confirmation
  const handleSwapConfirmation = async () => {
    if (!pendingSwap) return;

    // Process the swap confirmation
    const { fromToken, toToken, amount } = pendingSwap;

    try {
      const responses = await chatService.processSwapConfirmation(fromToken, toToken, amount);
      setChatMessages(prev => [...prev, ...responses]);
    } catch (error) {
      console.error('Error processing swap:', error);
      setChatMessages(prev => [...prev, {
        id: generateId(),
        content: "Sorry, I encountered an error while processing your swap. Please try again.",
        isUser: false,
        timestamp: getCurrentTime()
      }]);
    }

    // Clear pending swap
    setPendingSwap(null);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="h-screen w-full relative">
      {/* Example interface */}
      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center">
        <TaskbarTerminal
          isOpen={true}
          onSubmit={handleSubmit}
          theme={theme}
        />
      </div>

      {/* Chat drawer */}
      <ChatDrawer
        chatContainerRef={chatContainerRef}
        chatDrawerSpring={chatDrawerSpring}
        isChatOpen={isChatOpen}
        theme={theme}
        chatMessages={chatMessages}
        setIsChatOpen={setIsChatOpen}
        pendingMessage={pendingMessage}
      />
    </div>
  );
};

export default ChatExample;