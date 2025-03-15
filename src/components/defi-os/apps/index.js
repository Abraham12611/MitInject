import { Wallet, Droplets, Gift, BarChart3, BarChart2, Radio, Zap } from 'lucide-react';
import PortfolioApp from './PortfolioApp';
import LiquidityApp from './LiquidityApp';
import AirdropApp from './AirdropApp';
import MarketApp from './MarketApp';
import LiveMarketFeed from './LiveMarketFeed';
import AssetHeatmap from '../AssetPerformance/AssetHeatmap';
import IFTTTApp from './IFTTTApp';

// Export the components individually
export {
  PortfolioApp,
  LiquidityApp,
  AirdropApp,
  MarketApp,
  LiveMarketFeed,
  AssetHeatmap,
  IFTTTApp
};

// Export the apps configuration array
export const apps = [
  {
    id: 'portfolio',
    icon: Wallet,
    title: 'Prtfoli9',
    content: ({ isExpanded, theme }) => (
      <PortfolioApp isExpanded={isExpanded} theme={theme} />
    )
  },
  {
    id: 'liquidity',
    icon: Droplets,
    title: 'Liquidity',
    content: ({ isExpanded, theme, onRebalance }) => (
      <LiquidityApp isExpanded={isExpanded} theme={theme} onRebalance={onRebalance} />
    )
  },
  {
    id: 'airdrop',
    icon: Gift,
    title: 'Airdrops',
    content: ({ isExpanded, theme, onChatOpen }) => (
      <AirdropApp isExpanded={isExpanded} theme={theme} onChatOpen={onChatOpen} />
    )
  },
  {
    id: 'charts',
    icon: BarChart3,
    title: 'Market News',
    content: ({ isExpanded, theme }) => (
      <MarketApp isExpanded={isExpanded} theme={theme} />
    )
  },
  {
    id: 'live-feed',
    icon: Radio,
    title: 'Live Market Feed',
    content: ({ isExpanded, theme, setIsChatOpen, onChatOpen }) => (
      <LiveMarketFeed
        isExpanded={isExpanded}
        theme={theme}
        onChatOpen={onChatOpen}
      />
    )
  },
  /* Commented out Asset Performance for future implementation
  {
    id: 'asset-performance',
    icon: BarChart2,
    title: 'Asset Performance',
    content: ({ isExpanded, theme, onAssetSelect }) => (
      <AssetHeatmap
        theme={theme}
        onAssetSelect={onAssetSelect}
      />
    )
  },
  */
  {
    id: 'ifttt',
    icon: Zap,
    title: 'IFTTT',
    content: ({ isExpanded, theme }) => (
      <IFTTTApp
        isExpanded={isExpanded}
        theme={theme}
      />
    )
  }
];