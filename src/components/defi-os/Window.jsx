import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Card } from "@/components/ui/card";
import { Maximize2, Minus, X } from 'lucide-react';

const Window = ({ 
  title, 
  children, 
  isActive, 
  isExpanded,
  onClose, 
  onMinimize, 
  onMaximize,
  onActivate,
  style,
  index,
  totalWindows,
  layoutMode = 'default',
  icon: Icon,
  theme,
  openApps,
  activeApp,
  appId
}) => {
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate window positions based on layout mode
  const getLayoutPosition = () => {
    const padding = 20;
    const defaultWidth = 320;
    const defaultHeight = 400;
    const columnsPerRow = 3;
    const minimizedHeight = 40;
    
    if (layoutMode === 'expanded') {
      if (isActive) {
        return {
          x: padding,
          y: padding
        };
      } else {
        const nonActiveWindows = openApps.filter(id => id !== activeApp);
        const stackIndex = nonActiveWindows.indexOf(appId);
        
        return {
          x: padding + (stackIndex * (defaultWidth + 8)),
          y: window.innerHeight - (minimizedHeight + 80)
        };
      }
    } else if (layoutMode === 'minimized') {
      return {
        x: padding + (index * (defaultWidth + 8)),
        y: window.innerHeight - (minimizedHeight + 80)
      };
    }

    const column = index % columnsPerRow;
    const row = Math.floor(index / columnsPerRow);
    
    return {
      x: padding + (column * (defaultWidth + padding)),
      y: padding + (row * (defaultHeight + padding))
    };
  };

  const [{ x, y, scale, opacity }, api] = useSpring(() => ({
    x: getLayoutPosition().x,
    y: getLayoutPosition().y,
    scale: 1,
    opacity: 1,
    config: {
      tension: 220,
      friction: 24,
      precision: 0.001,
    }
  }));

  useEffect(() => {
    if (!isDragging) {
      const newPosition = getLayoutPosition();
      api.start({
        x: newPosition.x,
        y: newPosition.y,
        immediate: false
      });
    }
  }, [layoutMode, isActive, index, totalWindows]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - x.get(),
        y: e.clientY - y.get()
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      api.start({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
        immediate: true
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleClose = () => {
    api.start({
      scale: 0.8,
      opacity: 0,
      onRest: onClose
    });
  };

  const getWindowDimensions = () => {
    if (isExpanded) {
      return 'w-[66vw] h-[80vh]';
    } else if (layoutMode === 'minimized') {
      return 'w-48 h-32';
    }
    return 'w-[320px] h-[400px]';
  };

  const handleHeaderDoubleClick = (e) => {
    e.stopPropagation();
    onMaximize();
  };

  const handleWindowClick = (e) => {
    // Only activate if clicking outside the header
    if (!e.target.closest('.window-handle')) {
      onActivate();
    }
  };

  return (
    <animated.div
      ref={windowRef}
      style={{
        x,
        y,
        scale,
        opacity,
        position: 'absolute',
        ...style
      }}
      onMouseDown={handleMouseDown}
      onClick={handleWindowClick}
      className={`
        ${isDragging ? 'cursor-grabbing' : 'cursor-default'}
        ${isActive ? 'z-50' : 'z-10'}
      `}
    >
      <Card 
        className={`
          bg-white/95 backdrop-blur border-white/20 shadow-xl
          transform-origin-center rounded-xl
          ${isActive ? 'ring-1 ring-white/50' : ''}
          ${layoutMode === 'expanded' && !isActive 
            ? 'w-[320px] h-[40px] overflow-hidden' 
            : getWindowDimensions()}
          ${theme ? `bg-${theme.colors.background}F2` : ''}
        `}
        style={{
          borderColor: theme ? theme.colors.border : 'transparent',
          color: theme ? theme.colors?.text?.primary || theme.colors.text : 'inherit',
          boxShadow: theme.colors.effects?.glow,
          backgroundImage: theme.colors.effects?.scanline,
        }}
      >
        <div 
          className="window-handle flex items-center justify-between p-3 border-b border-white/10 cursor-grab active:cursor-grabbing bg-white/5"
          onDoubleClick={handleHeaderDoubleClick}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5" style={{ color: theme?.colors?.text?.secondary || theme?.colors?.text || 'inherit' }} />
            <span className="text-sm font-medium" style={{ color: theme?.colors?.text?.primary || theme?.colors?.text || 'inherit' }}>{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {!isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Maximize2 className="w-4 h-4" style={{ color: theme?.colors?.text?.secondary || theme?.colors?.text || 'inherit' }} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Minus className="w-4 h-4" style={{ color: theme?.colors?.text?.secondary || theme?.colors?.text || 'inherit' }} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" style={{ color: theme?.colors?.text?.secondary || theme?.colors?.text || 'inherit' }} />
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-3rem)] overflow-hidden">
          <div className="h-full">
            {children}
          </div>
        </div>
      </Card>
    </animated.div>
  );
};

export default Window; 