import React from 'react';

const DesktopIcons = ({ apps, openApp, theme }) => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 w-24">
      {apps.map(app => (
        <button
          key={app.id}
          onClick={() => openApp(app.id)}
          className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: theme.colors?.text?.primary || theme.colors.text }}
        >
          <app.icon className="w-8 h-8" />
          <span className="text-xs text-center">{app.title}</span>
        </button>
      ))}
    </div>
  );
};

export default DesktopIcons; 