import React, { useState } from 'react';
import NetworkStatus from './NetworkStatus';
import MarketSentiment from './MarketSentiment';
import StatusModal from './StatusModal';
import { useStatus } from './StatusContext';
import './styles.css';

const StatusIndicators = ({ theme }) => {
  const { networkStatus, marketSentiment } = useStatus();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null,
    data: null
  });

  const handleNetworkClick = (network, metrics) => {
    setModalConfig({
      isOpen: true,
      type: 'network',
      data: { 
        network,
        metrics: {
          ...networkStatus[network].metrics,
          tps: metrics.tps
        }
      }
    });
  };

  const handleSentimentClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'sentiment',
      data: { value: marketSentiment, trend: 'up' } // You can add more data here
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 px-4 overflow-x-auto status-scroll">
        <NetworkStatus 
          network="mitsui"
          status="online"
          metrics={networkStatus.mitsui.metrics}
          theme={theme}
          onClick={(metrics) => handleNetworkClick('mitsui', metrics)}
        />
        <NetworkStatus 
          network="sui"
          status="online"
          metrics={networkStatus.sui.metrics}
          theme={theme}
          onClick={(metrics) => handleNetworkClick('sui', metrics)}
        />
        {/* Commented out Solana for future implementation
        <NetworkStatus 
          network="solana"
          status="online"
          metrics={networkStatus.solana.metrics}
          theme={theme}
          onClick={() => handleNetworkClick('solana')}
        />
        */}
        <MarketSentiment 
          theme={theme}
          onClick={handleSentimentClick}
        />
      </div>

      <StatusModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: null, data: null })}
        type={modalConfig.type}
        data={modalConfig.data}
        theme={theme}
      />
    </>
  );
};

export default StatusIndicators; 