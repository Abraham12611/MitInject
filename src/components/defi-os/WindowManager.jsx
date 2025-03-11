import React from 'react';
import { Window } from '@/components/defi-os';

const WindowManager = ({ 
  openApps,
  activeApp,
  expandedApp,
  layoutMode,
  theme,
  apps,
  handleWindowClick,
  closeApp,
  minimizeApp
}) => {
  const handleWindowActivate = (appId) => {
    if (activeApp !== appId) {
      handleWindowClick(appId);
    }
  };

  const handleWindowMaximize = (appId) => {
    if (activeApp === appId) {
      if (expandedApp === appId) {
        minimizeApp(appId);
      } else {
        handleWindowClick(appId);
      }
    } else {
      handleWindowActivate(appId);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {openApps.map((appId, index) => {
          const app = apps.find(a => a.id === appId);
          const isActive = activeApp === appId;
          const isExpanded = expandedApp === appId;
          
          return (
            <Window
              key={appId}
              appId={appId}
              title={app.title}
              icon={app.icon}
              isActive={isActive}
              isExpanded={isExpanded}
              onClose={() => closeApp(appId)}
              onMinimize={() => minimizeApp(appId)}
              onMaximize={() => handleWindowMaximize(appId)}
              onActivate={() => handleWindowActivate(appId)}
              index={index}
              totalWindows={openApps.length}
              layoutMode={layoutMode}
              theme={theme}
              openApps={openApps}
              activeApp={activeApp}
            >
              {app.content({ 
                isExpanded,
                theme,
                setIsChatOpen: app.setIsChatOpen,
                onChatOpen: app.onChatOpen,
                onRebalance: app.onRebalance,
                onAssetSelect: app.onAssetSelect
              })}
            </Window>
          );
        })}
      </div>
    </div>
  );
};

export default WindowManager; 