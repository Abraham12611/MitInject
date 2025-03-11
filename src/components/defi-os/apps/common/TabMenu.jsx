import React from 'react';

const TabMenu = React.memo(({ 
  activeTab, 
  onTabChange, 
  theme,
  getAccentTextColor 
}) => (
  <div className="flex p-4 gap-2">
    <button
      onClick={() => onTabChange('classic')}
      className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
      style={{ 
        backgroundColor: activeTab === 'classic' ? theme.colors.accent : theme.colors.secondary,
        color: activeTab === 'classic' 
          ? getAccentTextColor()
          : theme.colors.text.primary
      }}
    >
      Classic
    </button>
    <button
      onClick={() => onTabChange('ai')}
      className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors"
      style={{ 
        backgroundColor: activeTab === 'ai' ? theme.colors.accent : theme.colors.secondary,
        color: activeTab === 'ai'
          ? getAccentTextColor()
          : theme.colors.text.primary
      }}
    >
      AI
    </button>
  </div>
));

TabMenu.displayName = 'TabMenu';

export default TabMenu; 