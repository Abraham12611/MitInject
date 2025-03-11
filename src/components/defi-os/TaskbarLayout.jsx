import React, { useState, useEffect } from 'react';
import { Terminal, Bell, Settings } from 'lucide-react';
import { TaskbarTerminal } from '@/components/defi-os';
import StatusIndicators from './StatusIndicators';
import { StatusProvider } from './StatusIndicators/StatusContext';
import SettingsPopup from './SettingsPopup';

const TaskbarLayout = ({ 
  theme,
  showStartMenu,
  setShowStartMenu,
  openApps,
  activeApp,
  setActiveApp,
  isTerminalOpen,
  setIsTerminalOpen,
  setIsChatOpen,
  apps,
  handleTerminalSubmit,
  currentTheme,
  setCurrentTheme
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true 
      }));
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatusProvider>
      <div 
        className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-[150]"
        style={{ 
          backgroundColor: `${theme.colors.background}CC`,
          borderColor: theme.colors.border,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow
        }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowStartMenu(!showStartMenu)} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Terminal className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
            <div className="h-4 w-px" style={{ backgroundColor: theme.colors.border }} />
            {openApps.map(appId => {
              const app = apps.find(a => a.id === appId);
              return (
                <button
                  key={appId}
                  onClick={() => setActiveApp(appId)}
                  className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                    activeApp === appId ? 'bg-white/10' : ''
                  }`}
                >
                  <app.icon className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
                </button>
              );
            })}
            <div className="h-4 w-px" style={{ backgroundColor: theme.colors.border }} />
            <button
              onClick={() => setIsTerminalOpen(!isTerminalOpen)}
              className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${
                isTerminalOpen ? 'bg-white/10' : ''
              }`}
            >
              <Terminal className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
            <TaskbarTerminal
              isOpen={isTerminalOpen}
              onClose={() => {
                setIsTerminalOpen(false);
                setIsChatOpen(false);
              }}
              onSubmit={handleTerminalSubmit}
              onChange={(value) => {
                if (value.trim().length > 0) {
                  setIsChatOpen(true);
                }
              }}
              theme={theme}
            />
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicators theme={theme} />
            <div className="h-4 w-px" style={{ backgroundColor: theme.colors.border }} />
            <Bell className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
            </button>
            <div className="text-sm" style={{ color: theme.colors?.text?.primary || theme.colors.text }}>{currentTime}</div>
          </div>
        </div>
      </div>

      <SettingsPopup 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        theme={theme}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      />

      {isTerminalOpen && (
        <TaskbarTerminal 
          onClose={() => setIsTerminalOpen(false)} 
          onSubmit={handleTerminalSubmit}
          onChange={(value) => {
            if (value.trim().length > 0) {
              setIsChatOpen(true);
            }
          }}
          theme={theme}
        />
      )}
    </StatusProvider>
  );
};

export default TaskbarLayout;