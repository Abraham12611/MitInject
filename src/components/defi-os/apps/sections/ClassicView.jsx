import React from 'react';
import { Zap } from 'lucide-react';
import TriggerSection from './TriggerSection';
import ActionSection from './ActionSection';

const ConnectorLine = React.memo(({ theme }) => (
  <div 
    className="w-8 h-2 border-2 rounded"
    style={{ borderColor: theme.colors.border }}
  />
));

const CreateFlowButton = React.memo(({ 
  onClick, 
  isLoading, 
  theme,
  getAccentTextColor,
  triggerTitle,
  actionTitle 
}) => (
  <div className="w-full max-w-md">
    <button
      className="w-full p-4 rounded-xl font-medium transition-all duration-200 
                flex items-center justify-center gap-2 hover:scale-105"
      style={{ 
        backgroundColor: theme.colors.accent,
        color: getAccentTextColor()
      }}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent 
                      rounded-full animate-spin" />
          Creating Flow...
        </>
      ) : (
        <>
          <Zap className="w-5 h-5" />
          Create Flow
        </>
      )}
    </button>

    <div className="mt-4 text-center text-sm" style={{ color: theme.colors.text.secondary }}>
      This will create an automated flow that triggers {triggerTitle?.toLowerCase()} 
      and {actionTitle?.toLowerCase()}
    </div>
  </div>
));

const ClassicView = React.memo(({ 
  configuredTrigger,
  configuredAction,
  onTriggerSelect,
  onTriggerEdit,
  onTriggerDelete,
  onActionSelect,
  onActionEdit,
  onActionDelete,
  onCreateFlow,
  isSaving,
  theme,
  getAccentTextColor
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <TriggerSection 
        trigger={configuredTrigger}
        onSelect={onTriggerSelect}
        onEdit={onTriggerEdit}
        onDelete={onTriggerDelete}
        getAccentTextColor={getAccentTextColor}
        theme={theme}
      />

      <ConnectorLine theme={theme} />

      <ActionSection 
        action={configuredAction}
        onSelect={onActionSelect}
        onEdit={onActionEdit}
        onDelete={onActionDelete}
        isEnabled={!!configuredTrigger}
        theme={theme}
      />

      {configuredTrigger && configuredAction && (
        <>
          <ConnectorLine theme={theme} />
          <CreateFlowButton 
            onClick={onCreateFlow}
            isLoading={isSaving}
            theme={theme}
            getAccentTextColor={getAccentTextColor}
            triggerTitle={configuredTrigger.title}
            actionTitle={configuredAction.title}
          />
        </>
      )}
    </div>
  );
});

ClassicView.displayName = 'ClassicView';
ConnectorLine.displayName = 'ConnectorLine';
CreateFlowButton.displayName = 'CreateFlowButton';

export default ClassicView; 