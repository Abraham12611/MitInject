'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const LoadingAnimation = ({ config, uiState, onConfigChange }) => {
  const router = useRouter();
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Add this useEffect to auto-start simulation on mount
  useEffect(() => {
    // Small delay to ensure everything is ready
    const timer = setTimeout(() => {
      setIsSimulating(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Use RAF for smoother loading progress
  const updateLoadingProgress = useCallback(() => {
    if (!isSimulating || config.loadingProgress >= 100) return;

    // Increment by smaller amounts for smoother animation
    const increment = 0.5;
    const newProgress = Math.min(100, config.loadingProgress + increment);
    onConfigChange('loadingProgress', newProgress);

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(updateLoadingProgress);
  }, [isSimulating, config.loadingProgress, onConfigChange]);

  // Handle simulation start
  useEffect(() => {
    if (isSimulating) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        if (progress > 100) {
          clearInterval(interval);
          return;
        }
        onConfigChange('loadingProgress', progress);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isSimulating, onConfigChange]);

  // Handle explosion and title sequence
  useEffect(() => {
    if (config.isExploding && !showTitle) {
      // Start title sequence after explosion starts
      const titleTimer = setTimeout(() => {
        setShowTitle(true);
        // Show subtitle after title
        const subtitleTimer = setTimeout(() => {
          setShowSubtitle(true);
          // Redirect after animations complete
          setTimeout(() => router.push('/desktop'), 1500);
        }, 1000);
        return () => clearTimeout(subtitleTimer);
      }, 2000);
      
      return () => clearTimeout(titleTimer);
    }
  }, [config.isExploding, router, showTitle]);

  const toggleTheme = () => {
    onConfigChange('isLightTheme', !config.isLightTheme);
  };

  const startSimulation = () => {
    setIsSimulating(true);
  };

  const handleInputChange = (key, e) => {
    let value = e.target.value;
    
    if (key === 'particleColor') {
      // Convert hex color to RGB
      const r = parseInt(value.substr(1,2), 16) / 255;
      const g = parseInt(value.substr(3,2), 16) / 255;
      const b = parseInt(value.substr(5,2), 16) / 255;
      value = { r, g, b };
    } else {
      value = parseFloat(value);
    }
    
    onConfigChange(key, value);
  };

  return (
    <>
      <div className={`title ${showTitle ? 'show-title' : ''} ${showSubtitle ? 'show-subtitle' : ''}`}>
        <h1>Mitsui</h1>
        <h2>The Agent Network</h2>
      </div>

      <button 
        id="simulate-button" 
        onClick={startSimulation}
        disabled={isSimulating}
      >
        Start Simulation
      </button>

      <button id="theme-toggle" onClick={toggleTheme}>
        {config.isLightTheme ? 'Dark Mode' : 'Light Mode'}
      </button>

      <div id="loading-text">
        Loading: {Math.round(uiState.loadingProgress)}%
      </div>

      <div id="controls" style={{ opacity: uiState.showControls ? 1 : 0 }}>
        <div className="control-group">
          <label htmlFor="speed">Animation Speed</label>
          <input 
            type="range" 
            id="speed" 
            min="0.1" 
            max="2" 
            step="0.1" 
            value={config.speed}
            onChange={(e) => handleInputChange('speed', e)}
          />
        </div>
        <div className="control-group">
          <label htmlFor="intensity">Intensity</label>
          <input 
            type="range" 
            id="intensity" 
            min="0.1" 
            max="1" 
            step="0.1" 
            value={config.intensity}
            onChange={(e) => handleInputChange('intensity', e)}
          />
        </div>
        <div className="control-group">
          <label htmlFor="particles">Particle Count</label>
          <input 
            type="range" 
            id="particles" 
            min="100" 
            max="1000" 
            step="50" 
            value={config.particles}
            onChange={(e) => handleInputChange('particles', e)}
          />
        </div>
        <div className="control-group">
          <label htmlFor="particleBrightness">Particle Brightness</label>
          <input 
            type="range" 
            id="particleBrightness" 
            min="0" 
            max="1" 
            step="0.1" 
            value={config.particleBrightness}
            onChange={(e) => handleInputChange('particleBrightness', e)}
          />
        </div>
        <div className="control-group">
          <label htmlFor="particleColor">Particle Color</label>
          <input 
            type="color" 
            id="particleColor" 
            value={`#${Math.round(config.particleColor.r * 255).toString(16).padStart(2, '0')}${
              Math.round(config.particleColor.g * 255).toString(16).padStart(2, '0')}${
              Math.round(config.particleColor.b * 255).toString(16).padStart(2, '0')}`}
            onChange={(e) => handleInputChange('particleColor', e)}
            style={{ width: '100%', height: '40px' }}
          />
        </div>
        <div className="control-group">
          <label htmlFor="loading">Loading Progress</label>
          <input 
            type="range" 
            id="loading" 
            min="0" 
            max="100" 
            step="1" 
            value={config.loadingProgress}
            onChange={(e) => handleInputChange('loadingProgress', e)}
          />
        </div>
      </div>
    </>
  );
};

export default LoadingAnimation; 