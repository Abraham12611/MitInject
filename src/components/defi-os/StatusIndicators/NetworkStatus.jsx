import React, { useState, useEffect } from 'react';
import { Brain, Network, Waves } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { getInjectiveTPS } from '@/utils/network';

const NetworkStatus = ({ network, status, metrics, theme, onClick }) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentTPS, setCurrentTPS] = useState(null);

  // Simulate random network activity blinks
  useEffect(() => {
    if (!network) return; // Early return if no network

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [network]); // Add network dependency

  // Fetch TPS only for Injective network
  useEffect(() => {
    // Skip effect entirely for non-Injective networks
    if (network !== 'injective') return;

    let mounted = true;  // For cleanup

    const fetchTPS = async () => {
      const tps = await getInjectiveTPS();
      console.log('NETWORK STATUS: Injective TPS:', tps);
      // Only update state if component is still mounted
      if (mounted && tps !== null) setCurrentTPS(tps);
    };

    fetchTPS();
    const interval = setInterval(fetchTPS, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []); // Empty dependency array since network is constant per instance

  // Get theme-aware styles
  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return theme.colors.text?.accent || '#4CAF50';
      case 'offline':
        return '#f44336';
      case 'warning':
        return '#FFC107';
      default:
        return theme.colors.text?.secondary;
    }
  };

  const containerStyle = {
    background: `${theme.colors.secondary}`,
    color: theme.colors.text?.primary,
    borderColor: theme.colors.border,
    boxShadow: isBlinking ? theme.colors.effects?.glow : 'none',
    transition: 'box-shadow 0.2s ease-in-out'
  };

  const getIcon = () => {
    switch (network) {
      case 'mitsui':
        return <Brain className="w-4 h-4" />;
      case 'injective':
        return <Network className="w-4 h-4" />;
      /* Comment out Solana for now
      case 'solana':
        return <Waves className="w-4 h-4" />;
      */
      default:
        return null;
    }
  };

  const getTooltipContent = () => {
    switch (network) {
      case 'mitsui':
        return (
          <div className="p-2 max-w-xs">
            <h4 className="font-medium mb-1">Mitsui AI</h4>
            <div className="text-sm opacity-90">
              <p>Response Time: {metrics.responseTime}ms</p>
              <p>Active Sessions: {metrics.activeSessions}</p>
              <p>Model: DeepSeek-R1</p>
            </div>
          </div>
        );
      case 'injective':
        return (
          <div className="p-2">
            <h4 className="font-medium mb-1">Injective Network</h4>
            <div className="text-sm opacity-90">
              <p>TPS: {currentTPS ?? 'Loading...'}</p>
              <p>Gas Price: {metrics.gasPrice} INJ</p>
              <p>Block Height: {metrics.blockHeight}</p>
            </div>
          </div>
        );
      /* Comment out Solana for now
      case 'solana':
        return (
          <div className="p-2 max-w-xs">
            <h4 className="font-medium mb-1">Solana Network</h4>
            <div className="text-sm opacity-90">
              <p>TPS: {metrics.tps}</p>
              <p>Slot: {metrics.slot}</p>
              <p>Block Time: {metrics.blockTime}ms</p>
            </div>
          </div>
        );
      */
      default:
        return null;
    }
  };

  return (
    <Tooltip content={getTooltipContent()}>
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-opacity-10 cursor-pointer hover:bg-opacity-20 transition-all"
        style={containerStyle}
        onClick={() => onClick({
          ...metrics,  // Keep original mock metrics
          tps: currentTPS // Add real TPS data
        })}
      >
        <div className={`status-indicator ${status}`} />
        {getIcon()}
        <span className="text-sm font-medium capitalize">{network}</span>
      </div>
    </Tooltip>
  );
};

export default NetworkStatus;