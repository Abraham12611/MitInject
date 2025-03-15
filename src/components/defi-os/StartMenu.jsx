import React from 'react';
import { animated } from '@react-spring/web';
import { Radio, BarChart2 } from 'lucide-react';

const StartMenu = ({
  showStartMenu,
  startMenuSpring,
  theme,
  apps,
  openApp,
  selectedAppIndex
}) => {
  if (!showStartMenu) return null;

  return (
    <animated.div
      style={{
        ...startMenuSpring,
        backgroundColor: `${theme.colors.background}F2`,
        borderColor: theme.colors.border,
        boxShadow: theme.colors.effects?.glow,
        color: theme.colors?.text?.primary || theme.colors.text
      }}
      className="fixed bottom-16 left-4 w-[400px] rounded-xl border backdrop-blur-xl z-[160] overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Radio className="w-5 h-5" style={{ color: theme.colors.accent }} />
            <div
              className="absolute inset-0 animate-ping"
              style={{
                background: `${theme.colors.accent}40`,
                borderRadius: '50%'
              }}
            />
          </div>
          <span className="text-lg font-medium">DeFi OS</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {apps.map((app, index) => {
            const Icon = app.icon;
            const isSelected = index === selectedAppIndex;

            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${isSelected ? 'bg-white/20' : 'hover:bg-white/10'}
                `}
                style={{
                  outline: isSelected ? `1px solid ${theme.colors.accent}` : 'none',
                  boxShadow: isSelected ? `0 0 10px ${theme.colors.accent}40` : 'none'
                }}
              >
                <Icon className="w-5 h-5" style={{ color: theme.colors.accent }} />
                <span className="text-sm">{app.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </animated.div>
  );
};

export default StartMenu;