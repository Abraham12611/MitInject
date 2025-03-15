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
        backgroundColor: `${theme.colors.background}CC`,
        borderColor: theme.colors.border,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 0 1px ${theme.colors.border}`,
        color: theme.colors?.text?.primary || theme.colors.text
      }}
      className="fixed bottom-16 left-4 w-[420px] rounded-2xl border backdrop-blur-2xl z-[160] overflow-hidden"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
          <div className="relative">
            <Radio
              className="w-6 h-6 transition-transform hover:scale-110"
              style={{ color: theme.colors.accent }}
            />
            <div
              className="absolute inset-0 animate-ping"
              style={{
                background: `${theme.colors.accent}30`,
                borderRadius: '50%'
              }}
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">DeFi OS</span>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-2 gap-3">
          {apps.map((app, index) => {
            const Icon = app.icon;
            const isSelected = index === selectedAppIndex;

            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                  transform hover:scale-[1.02] active:scale-[0.98]
                  ${isSelected ? 'bg-white/15' : 'hover:bg-white/10'}
                `}
                style={{
                  outline: isSelected ? `1px solid ${theme.colors.accent}` : 'none',
                  boxShadow: isSelected
                    ? `0 0 20px ${theme.colors.accent}20, inset 0 0 0 1px ${theme.colors.accent}40`
                    : 'none'
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5">
                  <Icon
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    style={{ color: theme.colors.accent }}
                  />
                </div>
                <span className="text-sm font-medium">{app.title}</span>
              </button>
            );
          })}
        </div>

        {/* Footer Section */}
        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50 text-center">
          Press ESC to close
        </div>
      </div>
    </animated.div>
  );
};

export default StartMenu;