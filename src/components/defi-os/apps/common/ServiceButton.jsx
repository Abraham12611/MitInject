import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const ServiceButton = React.memo(({ service, onSelect, getServiceColors }) => {
  const [pressed, setPressed] = useState(false);
  const colors = getServiceColors(service.color);
  
  const pressAnimation = useSpring({
    transform: pressed ? 'scale(0.95)' : 'scale(1)',
    config: {
      tension: 300,
      friction: 10
    }
  });

  return (
    <button
      className="w-full aspect-square rounded-lg transition-transform hover:scale-105"
      style={{ 
        backgroundColor: colors.background,
      }}
      onClick={() => onSelect(service)}
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <service.icon className="w-8 h-8 mb-2 text-white" />
        <div className="text-sm font-medium text-white text-center">
          {service.name}
        </div>
      </div>
    </button>
  );
});

ServiceButton.displayName = 'ServiceButton';

export default ServiceButton; 