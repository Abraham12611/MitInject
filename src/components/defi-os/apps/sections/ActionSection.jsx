import React from 'react';

const ActionSection = React.memo(({ 
  action, 
  onEdit, 
  onDelete, 
  onSelect,
  isEnabled,
  theme 
}) => {
  if (!action?.service) {
    return (
      <div 
        role="button"
        tabIndex={0}
        className="w-full max-w-md p-8 rounded-2xl transition-all duration-200"
        style={{ 
          backgroundColor: theme.colors.secondary,
          color: isEnabled ? theme.colors.text.primary : theme.colors.text.secondary,
          opacity: isEnabled ? 1 : 0.5,
          cursor: isEnabled ? 'pointer' : 'not-allowed'
        }}
        onClick={onSelect}
      >
        <div className="text-4xl font-bold text-center">Then That</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <action.service.icon 
          className="w-8 h-8" 
          style={{ color: action.service.color }}
        />
        <div className="text-left">
          <div className="text-lg font-bold">{action.title}</div>
          <div className="text-sm opacity-80">
            {action.service.name} • {' '}
            {action.config?.token || action.config?.amount || 'No config'}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="p-2 rounded-lg hover:bg-black/10 transition-colors"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
});

ActionSection.displayName = 'ActionSection';

export default ActionSection; 