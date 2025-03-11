import React from 'react';
import { Settings } from 'lucide-react';
import { THEMES } from '@/config/themes';

const ThemeSwitcher = ({ currentTheme, setCurrentTheme, theme }) => {
  return (
    <div className="fixed top-4 left-4 z-[90]">
      <button
        onClick={() => setCurrentTheme(current => {
          const themes = Object.keys(THEMES);
          const currentIndex = themes.indexOf(current);
          const nextIndex = (currentIndex + 1) % themes.length;
          return themes[nextIndex];
        })}
        className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-xl border"
        style={{ 
          background: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors?.text?.primary || theme.colors.text,
          boxShadow: theme.colors.effects?.glow
        }}
      >
        <Settings className="w-4 h-4" style={{ color: theme.colors?.text?.secondary || theme.colors.text }} />
        <span className="text-sm">{theme.name}</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher; 