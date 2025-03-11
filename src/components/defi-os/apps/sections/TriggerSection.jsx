import React from 'react';

const TriggerSection = React.memo(({ 
  trigger, 
  onEdit, 
  onDelete, 
  onSelect, 
  getAccentTextColor,
  theme 
}) => {
  if (!trigger) {
    return (
      <div 
        role="button"
        tabIndex={0}
        className="w-full max-w-md p-8 rounded-2xl transition-all duration-200 
                   hover:scale-105 cursor-pointer"
        style={{ 
          backgroundColor: theme.colors.accent,
          color: getAccentTextColor()
        }}
        onClick={onSelect}
      >
        <div className="text-4xl font-bold text-center">If This</div>
      </div>
    );
  }

  const Icon = trigger.service?.icon;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {Icon && <Icon className="w-8 h-8" />}
        <div className="text-left">
          <div className="text-lg font-bold">{trigger.title}</div>
          <div className="text-sm opacity-80">
            {trigger.service?.name} • {trigger.config?.token}
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

TriggerSection.displayName = 'TriggerSection';

export default TriggerSection; 