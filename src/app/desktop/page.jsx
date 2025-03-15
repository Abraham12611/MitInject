'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Card } from "@/components/ui/card";
import {
  Wallet, Gift, BarChart3, Terminal, Settings,
  Radio, Bell, Maximize2, Minus, X,
  Droplets, Clock, Timer, BarChart2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import {
  Window,
  TimeWidgets,
  TaskbarTerminal,
  FloatingHeart,
  HeartGroup,
  ChatMessage,
  ChatDrawer,
  TaskbarLayout,
  DesktopIcons,
  DesktopBackground,
  AnimationStyles,
  StartMenu,
  WindowManager,
  SettingsPopup
} from '@/components/defi-os';
import { THEMES } from '@/config/themes';
import { apps as appsConfig } from '@/components/defi-os/apps';
import { useRouter } from 'next/navigation';
import { DEMO_RESPONSES, getResponse } from '@/config/demo-chat';
import AssetHeatmap from '@/components/defi-os/AssetPerformance/AssetHeatmap';
import AssetDetailModal from '@/components/defi-os/AssetPerformance/AssetDetailModal';

const DefiDesktop = () => {
  const [openApps, setOpenApps] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [expandedApp, setExpandedApp] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [layoutMode, setLayoutMode] = useState('default');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [utcTime, setUtcTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const chatContainerRef = useRef(null);
  const [heartGroups, setHeartGroups] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('default');
  const theme = THEMES[currentTheme];
  const [showSettings, setShowSettings] = useState(false);
  const [selectedAppIndex, setSelectedAppIndex] = useState(-1);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const startMenuTimerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fade in animation
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: mounted ? 1 : 0 },
    config: { duration: 500 },
  });

  // Add function to handle start menu timer
  const resetStartMenuTimer = () => {
    if (startMenuTimerRef.current) {
      clearTimeout(startMenuTimerRef.current);
    }
    startMenuTimerRef.current = setTimeout(() => {
      setShowStartMenu(false);
      setSelectedAppIndex(-1);
    }, 3000);
  };

  // Update UTC time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update countdown timer every second
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(now);
      target.setUTCHours(Math.ceil(now.getUTCHours() / 3) * 3, 0, 0, 0);
      if (target <= now) target.setUTCHours(target.getUTCHours() + 3);

      const diff = target - now;
      const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
      setCountdown(`${hours}:${minutes}:${seconds}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Chat drawer animation
  const chatDrawerSpring = useSpring({
    transform: isChatOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: isChatOpen ? 0.95 : 0,
    scale: isChatOpen ? 1 : 0.95,
    config: {
      tension: 160,
      friction: 35,
      mass: 1.2,
      duration: 400,
      easing: t => t * (2 - t)
    },
    onRest: () => {
      if (!isChatOpen) {
        setChatMessages([]);
      }
    }
  });

  const addHeartGroup = () => {
    // Get the chat container's right edge position
    const x = window.innerWidth - (window.innerWidth * 0.33) + 60; // Align with agent messages
    const id = Date.now();
    setHeartGroups(prev => [...prev, { id, x }]);

    setTimeout(() => {
      setHeartGroups(prev => prev.filter(group => group.id !== id));
    }, 3000);
  };

  // Update showStartMenu effect to handle timer
  useEffect(() => {
    if (showStartMenu) {
      resetStartMenuTimer();
    } else if (startMenuTimerRef.current) {
      clearTimeout(startMenuTimerRef.current);
    }
    return () => {
      if (startMenuTimerRef.current) {
        clearTimeout(startMenuTimerRef.current);
      }
    };
  }, [showStartMenu]);

  const handleTerminalSubmit = async (command) => {
    const timestamp = new Date().toLocaleTimeString();

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: command,
      timestamp,
      isUser: true
    };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatOpen(true);

    // Check if message is a thank you
    const isThankYou = /^(thanks|thank you|❤️|🧡|💛|💚|💙|💜|🤎|🖤|🤍|♥️|thank|ty|tysm)$/i.test(command.trim());

    if (isThankYou) {
      // First add the agent's heart message
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          text: "❤️",
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        };
        setChatMessages(prev => [...prev, aiMessage]);
        // Then trigger the floating hearts animation
        setTimeout(addHeartGroup, 100);
      }, 500);
      return;
    }

    // Add immediate thinking message
    const thinkingMessageId = Date.now() + 1;
    const initialThinkingMessage = {
      id: thinkingMessageId,
      text: "Let me think about that...",
      timestamp: new Date().toLocaleTimeString(),
      isUser: false
    };
    setChatMessages(prev => [...prev, initialThinkingMessage]);

    // Handle /market command
    const marketCommand = command.match(/^\/market\s+([^\s]+)/);
    if (marketCommand) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: command
          })
        });

        if (!response.ok) throw new Error('Failed to fetch market analysis');

        const data = await response.json();
        setChatMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
          return [...withoutThinking, {
            id: Date.now() + 2,
            text: data.choices[0].message.content,
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          }];
        });
        return;
      } catch (error) {
        console.error('Error fetching market analysis:', error);
        setChatMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
          return [...withoutThinking, {
            id: Date.now() + 2,
            text: "Sorry, I couldn't fetch the market analysis. Please try again later.",
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          }];
        });
        return;
      }
    }

    // First check for demo responses
    const commandLower = command.toLowerCase().trim();
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
      // Remove thinking message and show demo response immediately
      setChatMessages(prev => {
        const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
        return [...withoutThinking, {
          id: Date.now() + 2,
          text: demoResponse,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        }];
      });
      return;
    }

    // If no demo response match, check for commands
    if (command.startsWith('/')) {
      // Check for exact command match in demo responses first
      if (DEMO_RESPONSES.commands[commandLower]) {
        setChatMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
          return [...withoutThinking, {
            id: Date.now() + 2,
            text: DEMO_RESPONSES.commands[commandLower],
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          }];
        });
        return;
      }

      // If no exact match, try to match the command pattern
      const parts = command.toLowerCase().split(' ');
      const action = parts[1];
      const target = parts[2];

      // Construct the full command to check in demo responses
      const fullCommand = parts.slice(0, 3).join(' ');
      if (DEMO_RESPONSES.commands[fullCommand]) {
        setChatMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
          return [...withoutThinking, {
            id: Date.now() + 2,
            text: DEMO_RESPONSES.commands[fullCommand],
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          }];
        });
        return;
      }

      // Fallback to default command responses if no match in demo responses
      if (action === 'check') {
        if (target === 'airdrops') {
          setChatMessages(prev => {
            const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
            return [...withoutThinking, {
              id: Date.now() + 2,
              text: "Here are the latest airdrops I'm tracking:\n\n1. Walrus - Decentralized storage protocol\n2. MovEX - DEX with upcoming token\n3. SuiPad - Launchpad platform\n\nWhich one would you like to know more about?",
              timestamp: new Date().toLocaleTimeString(),
              isUser: false
            }];
          });
          return;
        }
        if (target === 'liquidity') {
          setChatMessages(prev => {
            const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
            return [...withoutThinking, {
              id: Date.now() + 2,
              text: "Your active liquidity positions:\n\n• SUI/USDC: $32,450 (42% APR)\n• BLUR/USDC: $15,782 (38% APR)\n\nWould you like to check any specific pool's metrics?",
              timestamp: new Date().toLocaleTimeString(),
              isUser: false
            }];
          });
          return;
        }
      }

      if (action === 'market') {
        if (target === 'sui') {
          setChatMessages(prev => {
            const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
            return [...withoutThinking, {
              id: Date.now() + 2,
              text: "SUI Market News:\n\n• Price: $1.23 (+5.2%)\n• 24h Volume: $245M\n• TVL: $456M\n• Active Addresses: 125k\n\nKey Events:\n• Mainnet upgrade next week\n• New DEX launching soon",
              timestamp: new Date().toLocaleTimeString(),
              isUser: false
            }];
          });
          return;
        }
        if (target === 'trends') {
          setChatMessages(prev => {
            const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
            return [...withoutThinking, {
              id: Date.now() + 2,
              text: "Current DeFi Trends on Sui:\n\n1. Liquid staking protocols gaining traction\n2. Real-world asset protocols emerging\n3. AI-powered DEX aggregators launching\n4. Cross-chain bridges expanding\n\nWould you like to explore any of these trends?",
              timestamp: new Date().toLocaleTimeString(),
              isUser: false
            }];
          });
          return;
        }
      }

      if (command.toLowerCase() === '/help') {
        setChatMessages(prev => {
          const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
          return [...withoutThinking, {
            id: Date.now() + 2,
            text: "Available commands:\n\n• /check airdrops - View available airdrops\n• /check liquidity - Check your liquidity positions\n• /market - See current DeFi trends\n\nYou can also ask me anything in natural language!",
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          }];
        });
        return;
      }
    }

    // If no demo response or command match, use LLM
    const llmResponse = await getLLMResponse(command);

    if (llmResponse.thinking) {
      // Replace thinking message with the <think> content
      setChatMessages(prev => {
        const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
        return [...withoutThinking, {
          id: Date.now() + 2,
          text: llmResponse.thinking,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        }];
      });

      // Add final response after delay
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now() + 3,
          text: llmResponse.response,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        }]);
      }, 2000);
    } else {
      // Just show response immediately
      setChatMessages(prev => {
        const withoutThinking = prev.filter(msg => msg.id !== thinkingMessageId);
        return [...withoutThinking, {
          id: Date.now() + 2,
          text: llmResponse.response,
          timestamp: new Date().toLocaleTimeString(),
          isUser: false
        }];
      });
    }
  };

  // Function to handle chat opening with custom message
  const handleChatOpen = (message) => {
    setIsChatOpen(true);
    if (message) {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        isUser: false
      }]);
    }
  };

  const handleRebalanceAndChat = React.useCallback((poolName) => {
    setIsChatOpen(true);
    handleTerminalSubmit('/check liquidity');
  }, [setIsChatOpen, handleTerminalSubmit]);

  // Apps configuration with chat support
  const apps = useMemo(() => {
    return appsConfig.map(app => ({
      ...app,
      content: (props) => app.content({
        ...props,
        theme,
        onAssetSelect: setSelectedAsset,
        onRebalance: handleRebalanceAndChat,
        onChatOpen: handleChatOpen,
        setIsChatOpen
      })
    }));
  }, [theme, handleRebalanceAndChat, handleChatOpen, setSelectedAsset, setIsChatOpen]);

  // Update openApp function to clear timer when app is opened
  const openApp = (appId) => {
    if (startMenuTimerRef.current) {
      clearTimeout(startMenuTimerRef.current);
    }
    if (appId === 'terminal') {
      setIsTerminalOpen(true);
      return;
    }

    if (openApps.includes(appId)) {
      // Close the app if it's already open
      closeApp(appId);
    } else {
      // Open the app if it's closed
      setOpenApps([...openApps, appId]);
      setActiveApp(appId);
    }
    // Start a new timer after opening the app
    resetStartMenuTimer();
  };

  // Update keyboard event handler to reset timer on navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Reset timer when navigating the menu
      if (showStartMenu) {
        resetStartMenuTimer();
      }

      // Tab to toggle terminal
      if (e.code === 'Tab') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
        return;
      }

      // Shift + Space to toggle menu
      if (e.shiftKey && e.code === 'Space') {
        e.preventDefault();
        setShowStartMenu(prev => !prev);
        if (!showStartMenu) {
          setSelectedAppIndex(0);
        } else {
          setSelectedAppIndex(-1);
        }
        return;
      }

      // Only handle navigation if menu is open
      if (!showStartMenu) return;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          e.preventDefault();
          setSelectedAppIndex(prev => {
            const newIndex = prev - 2;
            return newIndex < 0 ? prev : newIndex;
          });
          break;
        case 'KeyS':
        case 'ArrowDown':
          e.preventDefault();
          setSelectedAppIndex(prev => {
            const newIndex = prev + 2;
            return newIndex >= apps.length ? prev : newIndex;
          });
          break;
        case 'KeyA':
        case 'ArrowLeft':
          e.preventDefault();
          setSelectedAppIndex(prev => {
            const newIndex = prev - 1;
            return (prev % 2 === 0) ? prev : newIndex;
          });
          break;
        case 'KeyD':
        case 'ArrowRight':
          e.preventDefault();
          setSelectedAppIndex(prev => {
            const newIndex = prev + 1;
            return (prev % 2 === 1 || newIndex >= apps.length) ? prev : newIndex;
          });
          break;
        case 'Enter':
        case 'Space':
          e.preventDefault();
          if (selectedAppIndex >= 0 && selectedAppIndex < apps.length) {
            openApp(apps[selectedAppIndex].id);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowStartMenu(false);
          setSelectedAppIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showStartMenu, selectedAppIndex, apps, openApp, resetStartMenuTimer]);

  const getLLMResponse = async (userInput) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;

        // Extract think and response parts
        const thinkMatch = content.match(/<think>(.*?)<\/think>/s);
        const responseText = content.replace(/<think>.*?<\/think>/s, '').trim();

        // If the entire content is within think tags, use it as both thinking and response
        if (thinkMatch && !responseText) {
          return {
            thinking: thinkMatch[1].trim(),
            response: thinkMatch[1].trim()
          };
        }

        return {
          thinking: thinkMatch ? thinkMatch[1].trim() : "Let me think about that...",
          response: responseText || "I'm having trouble processing that right now. Could you try again?"
        };
      }

      return {
        thinking: "Let me think about that...",
        response: "I'm having trouble processing that right now. Could you try again?"
      };

    } catch (error) {
      console.error('Error calling chat API:', error);
      return {
        thinking: "Let me think about that...",
        response: "Sorry, I encountered an error. Please try again later."
      };
    }
  };

  const handleWindowClick = (appId) => {
    setActiveApp(appId);
    if (expandedApp === appId) {
      setExpandedApp(null);
      setLayoutMode('default');
    } else {
      setExpandedApp(appId);
      setLayoutMode('expanded');
    }
  };

  const closeApp = (appId) => {
    setOpenApps(openApps.filter(id => id !== appId));
    if (activeApp === appId) {
      setActiveApp(null);
    }
    if (expandedApp === appId) {
      setExpandedApp(null);
      setLayoutMode('default');
    }
  };

  const minimizeApp = (appId) => {
    if (appId === activeApp || appId === expandedApp) {
      setLayoutMode('default');
      setActiveApp(null);
      setExpandedApp(null);
    } else {
      setLayoutMode(prevMode => prevMode === 'expanded' ? 'expanded' : 'minimized');
    }
  };

  // Spring animation for start menu
  const startMenuSpring = useSpring({
    opacity: showStartMenu ? 1 : 0,
    transform: showStartMenu ? 'translateY(0%)' : 'translateY(100%)',
    config: { tension: 300, friction: 30 }
  });

  // Add scroll effect when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Remove asset-performance from openApps on mount
  useEffect(() => {
    setOpenApps(prevApps => prevApps.filter(appId => appId !== 'asset-performance'));
  }, []);

  // Filter out commented apps
  const availableApps = useMemo(() => {
    return appsConfig.filter(app => app && app.id !== 'asset-performance');
  }, []);

  return (
    <animated.div style={fadeIn} className="w-screen h-screen">
      <div
        className="min-h-screen overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        <DesktopBackground theme={theme} />

        {/* Settings Popup */}
        <SettingsPopup
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          theme={theme}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />

        {/* Top Terminal */}
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[200]">
          <TaskbarTerminal
            isOpen={true}
            onSubmit={handleTerminalSubmit}
            theme={theme}
          />
        </div>

        <DesktopIcons
          apps={availableApps}
          openApp={openApp}
          theme={theme}
        />

        <WindowManager
          openApps={openApps}
          activeApp={activeApp}
          expandedApp={expandedApp}
          layoutMode={layoutMode}
          theme={theme}
          apps={availableApps}
          handleWindowClick={handleWindowClick}
          closeApp={closeApp}
          minimizeApp={minimizeApp}
        />

        <TaskbarLayout
          theme={theme}
          showStartMenu={showStartMenu}
          setShowStartMenu={setShowStartMenu}
          openApps={openApps}
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          isTerminalOpen={isTerminalOpen}
          setIsTerminalOpen={setIsTerminalOpen}
          setIsChatOpen={setIsChatOpen}
          apps={availableApps}
          handleTerminalSubmit={handleTerminalSubmit}
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
        />

        <StartMenu
          showStartMenu={showStartMenu}
          startMenuSpring={startMenuSpring}
          theme={theme}
          apps={availableApps}
          openApp={openApp}
          selectedAppIndex={selectedAppIndex}
        />

        <TimeWidgets theme={theme} />

        <ChatDrawer
          chatContainerRef={chatContainerRef}
          chatDrawerSpring={chatDrawerSpring}
          isChatOpen={isChatOpen}
          theme={theme}
          chatMessages={chatMessages}
          setShowSettings={setShowSettings}
          setIsChatOpen={setIsChatOpen}
        />

        <div className="fixed inset-0 pointer-events-none z-[200]">
          {heartGroups.map(group => (
            <HeartGroup key={group.id} x={group.x} />
          ))}
        </div>

        <AnimationStyles />

        <AssetDetailModal
          asset={selectedAsset}
          isOpen={selectedAsset !== null}
          onClose={() => setSelectedAsset(null)}
          theme={theme}
        />
      </div>
    </animated.div>
  );
};

export default DefiDesktop;