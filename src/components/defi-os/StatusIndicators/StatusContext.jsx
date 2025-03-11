import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSuiMetrics } from '../../../utils/network';

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [networkStatus, setNetworkStatus] = useState({
    mitsui: {
      status: 'online',
      metrics: { responseTime: 150, activeSessions: 24, model: 'DeepSeek-R1' }
    },
    sui: {
      status: 'online',
      metrics: { tps: 4521, gasPrice: '0.000000231', checkpoint: '12445213' }
    }
    /* Comment out Solana for future implementation
    solana: {
      status: 'online',
      metrics: { tps: 3245, slot: '234523411', blockTime: 400 }
    }
    */
  });

  const [marketSentiment, setMarketSentiment] = useState(75);

  // Function to update network status and metrics
  const updateNetworkStatus = (network, data) => {
    setNetworkStatus(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        ...data
      }
    }));
  };

  // Function to update specific network metrics
  const updateNetworkMetrics = (network, metrics) => {
    setNetworkStatus(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        metrics: { ...prev[network].metrics, ...metrics }
      }
    }));
  };

  // Function to update network connection status
  const updateConnectionStatus = (network, status) => {
    setNetworkStatus(prev => ({
      ...prev,
      [network]: {
        ...prev[network],
        status
      }
    }));
  };

  // Function to update market sentiment
  const updateMarketSentiment = (newValue) => {
    setMarketSentiment(newValue);
  };

  // Function to handle websocket messages
  const handleWebSocketMessage = (message) => {
    const { type, network, data } = message;
    
    switch (type) {
      case 'network_status':
        updateNetworkStatus(network, data);
        break;
      case 'network_metrics':
        updateNetworkMetrics(network, data);
        break;
      case 'connection_status':
        updateConnectionStatus(network, data.status);
        break;
      case 'market_sentiment':
        updateMarketSentiment(data.value);
        break;
      default:
        console.warn('Unknown message type:', type);
    }
  };

  // Example usage with WebSocket (to be implemented)
  // useEffect(() => {
  //   const ws = new WebSocket('wss://your-websocket-endpoint');
  //   
  //   ws.onmessage = (event) => {
  //     const message = JSON.parse(event.data);
  //     handleWebSocketMessage(message);
  //   };
  //
  //   return () => ws.close();
  // }, []);

  // For development/testing - simulate updates
  useEffect(() => {
    const updateSuiMetrics = async () => {
      const metrics = await getSuiMetrics();
      console.log('Updating Sui metrics:', metrics); // Debug log
      if (metrics) {
        // Preserve TPS when updating other metrics
        updateNetworkMetrics('sui', {
          ...metrics,
          tps: networkStatus.sui.metrics.tps // Keep existing TPS
        });
      }
    };

    updateSuiMetrics();
    const interval = setInterval(updateSuiMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StatusContext.Provider value={{ 
      networkStatus, 
      marketSentiment,
      updateNetworkStatus,
      updateNetworkMetrics,
      updateConnectionStatus,
      updateMarketSentiment,
      handleWebSocketMessage
    }}>
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext);

// Example usage:
// const { updateNetworkMetrics, updateConnectionStatus } = useStatus();
// 
// // Update Sui TPS
// updateNetworkMetrics('sui', { tps: 5000 });
// 
// // Mark Solana as having issues
// updateConnectionStatus('solana', 'warning');
// 
// // Update multiple metrics for Mitsui
// updateNetworkMetrics('mitsui', { 
//   responseTime: 120,
//   activeSessions: 30
// }); 