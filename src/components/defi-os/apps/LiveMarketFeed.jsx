import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Coins, Loader2, ArrowUpRight, ArrowDownRight, MessageCircle, Users, Bot, ArrowUp, ArrowDown, RefreshCw, TrendingDown } from 'lucide-react';
import Image from 'next/image';
import { 
  getSpotMarkets, 
  getDerivativeMarkets, 
  getMarketOrderbook 
} from '@/utils/injective-client';
import TransactionSigning from './common/TransactionSigning';
import { MarketType } from '@/utils/injective-signing';

const TokenIcon = ({ theme }) => (
  <div 
    className="w-8 h-8 flex items-center justify-center rounded-full"
    style={{ 
      background: `${theme.colors.accent}20`,
      border: `1px solid ${theme.colors.border}`
    }}
  >
    <Coins className="w-5 h-5" style={{ color: theme.colors.accent }} />
  </div>
);

const formatNumber = (num) => {
  if (!num) return '0.00';
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return num.toFixed(2);
};

const formatPercentage = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.00';
  return num.toFixed(2);
};

const TokenRow = ({ market, theme, onSelect }) => {
  const [orderbook, setOrderbook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTradeForm, setShowTradeForm] = useState(false);

  useEffect(() => {
    const fetchOrderbook = async () => {
      try {
        const ob = await getMarketOrderbook(market.marketId, market.isDerivative);
        setOrderbook(ob);
      } catch (error) {
        console.error('Failed to fetch orderbook:', error);
      }
    };
    
    fetchOrderbook();
    const interval = setInterval(fetchOrderbook, 10000); // Update every 10s
    return () => clearInterval(interval);
  }, [market.marketId, market.isDerivative]);

  const lastPrice = orderbook?.lastPrice || market.lastPrice || 0;
  const priceChange = market.priceChange24h || 0;
  const volume = market.volume24h || 0;

  // Toggle trade form
  const toggleTradeForm = (e) => {
    e.stopPropagation();
    setShowTradeForm(!showTradeForm);
  };

  // Handle successful transaction
  const handleTransactionSuccess = (txHash) => {
    console.log('Transaction successful:', txHash);
    // You could refresh the orderbook here
    fetchOrderbook();
  };

  // Handle transaction error
  const handleTransactionError = (error) => {
    console.error('Transaction error:', error);
  };

  return (
    <div className="mb-2">
      <div 
        className="flex items-center justify-between p-3 rounded-lg cursor-pointer"
        style={{ 
          backgroundColor: theme.colors.secondary,
          border: `1px solid ${theme.colors.border}`
        }}
        onClick={() => onSelect && onSelect(market)}
      >
        <div className="flex items-center">
          <div className="mr-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" 
              style={{ backgroundColor: theme.colors.accent + '20' }}>
              <span style={{ color: theme.colors.accent }}>{market.ticker.slice(0, 2)}</span>
            </div>
          </div>
          <div>
            <div style={{ color: theme.colors.text.primary }} className="font-medium">
              {market.ticker}
            </div>
            <div style={{ color: theme.colors.text.secondary }} className="text-xs">
              {market.type === 'spot' ? 'Spot' : 'Perpetual'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div style={{ color: theme.colors.text.primary }}>
            ${parseFloat(market.lastPrice).toFixed(market.priceDecimals || 2)}
          </div>
          <div className={`text-xs ${market.priceChange24H >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {market.priceChange24H >= 0 ? '+' : ''}{market.priceChange24H.toFixed(2)}%
          </div>
        </div>
        <div className="ml-4">
          <button
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.accent + '20',
              color: theme.colors.accent
            }}
            onClick={toggleTradeForm}
          >
            Trade
          </button>
        </div>
      </div>

      {/* Trade Form */}
      {showTradeForm && (
        <div 
          className="mt-2 p-4 rounded-lg"
          style={{ 
            backgroundColor: theme.colors.secondary,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ color: theme.colors.text.primary }} className="font-medium">
              Trade {market.ticker}
            </h3>
            <button
              className="p-1 rounded-full"
              style={{ 
                backgroundColor: theme.colors.accent + '20',
                color: theme.colors.accent
              }}
              onClick={toggleTradeForm}
            >
              ✕
            </button>
          </div>
          
          <TransactionSigning 
            marketId={market.marketId}
            marketType={market.type === 'spot' ? MarketType.SPOT : MarketType.DERIVATIVE}
            defaultPrice={market.lastPrice}
            theme={theme}
            onSuccess={handleTransactionSuccess}
            onError={handleTransactionError}
          />
        </div>
      )}
    </div>
  );
};

const LoadingState = ({ theme }) => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin" style={{ color: theme.colors.accent }} />
  </div>
);

const FeedToggleButton = ({ active, onClick, icon: Icon, label, theme }) => (
  <button
    onClick={(e) => {
      e.stopPropagation(); // Prevent event from bubbling up
      onClick();
    }}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
      active ? 'opacity-100' : 'opacity-70 hover:opacity-90'
    }`}
    style={{
      background: active ? `${theme.colors.accent}20` : 'transparent',
      border: `1px solid ${active ? theme.colors.accent : theme.colors.border}`,
      color: active ? theme.colors.accent : theme.colors.text?.primary
    }}
  >
    <Icon className="w-4 h-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const TweetCard = ({ tweet, theme }) => {
  // Format the date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="p-4 rounded-lg mb-3"
      style={{ 
        background: `${theme.colors.background}40`,
        border: `1px solid ${theme.colors.border}` 
      }}
    >
      <div className="flex items-start gap-3">
        {tweet.profile_image_url ? (
          <Image
            src={tweet.profile_image_url}
            alt={`@${tweet.username}'s profile`}
            width={40}
            height={40}
            className="rounded-full"
            style={{ border: `1px solid ${theme.colors.border}` }}
          />
        ) : (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              background: `${theme.colors.accent}20`,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <Users className="w-6 h-6" style={{ color: theme.colors.accent }} />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium" style={{ color: theme.colors.text?.primary }}>
              @{tweet.username}
            </span>
            <span className="text-sm" style={{ color: theme.colors.text?.secondary }}>
              • {formatDate(tweet.created_at)}
            </span>
          </div>
          <p 
            className="mt-2 text-sm whitespace-pre-wrap"
            style={{ color: theme.colors.text?.primary }}
          >
            {tweet.text}
          </p>
          <div 
            className="mt-2 text-sm flex items-center gap-4"
            style={{ color: theme.colors.text?.secondary }}
          >
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" /> {tweet.retweets || 0}
            </span>
            <span className="flex items-center gap-1">
              ❤️ {tweet.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getTweets = async (category) => {
  try {
    const response = await fetch('/data/tweets.json');
    const allTweets = await response.json();
    
    // Filter tweets from the last 12 hours
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
    
    console.log('Category:', category);
    console.log('Total tweets:', allTweets.length);
    console.log('All tweets:', allTweets);
    
    const filteredTweets = allTweets.filter(tweet => {
      // Parse the date correctly
      const tweetDate = new Date(tweet.created_at.replace(' ', 'T'));
      const isRecent = tweetDate >= twelveHoursAgo;
      
      // Simple category match
      const categoryMatches = tweet.category === category;
      
      if (!categoryMatches) {
        console.log(`Tweet category mismatch for ${tweet.username}:`, tweet.category, 'expected:', category);
      }
      if (!isRecent) {
        console.log('Tweet filtered out due to age:', tweet.created_at);
      }
      
      return categoryMatches && isRecent;
    });
    
    console.log(`Found ${filteredTweets.length} matching tweets for category ${category}`);
    console.log('Matching tweets:', filteredTweets);
    
    return filteredTweets
      .sort((a, b) => new Date(b.created_at.replace(' ', 'T')) - new Date(a.created_at.replace(' ', 'T')))
      .slice(0, 50);
  } catch (error) {
    console.error('Error loading tweets:', error);
    return [];
  }
};

const MitsuiChatButton = ({ theme, onClick }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
    className="absolute top-4 right-8 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 overflow-hidden"
    style={{ 
      background: `${theme.colors.accent}20`,
      border: `1px solid ${theme.colors.accent}`,
    }}
  >
    <img 
      src="/assets/characters/sample_for_agent.png"
      alt="Mitsui"
      className="w-full h-full object-cover"
    />
  </button>
);

const LiveMarketFeed = ({ isExpanded, theme, onChatOpen }) => {
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState('market');
  const [tweets, setTweets] = useState([]);
  const [isTweetsLoading, setIsTweetsLoading] = useState(false);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setIsLoading(true);
        const [spotMarkets, derivativeMarkets] = await Promise.all([
          getSpotMarkets(),
          getDerivativeMarkets()
        ]);
        
        // Format and combine markets
        const formattedMarkets = [
          ...spotMarkets.map(market => ({
            marketId: market.marketId,
            ticker: market.ticker,
            lastPrice: market.lastPrice,
            priceChange24h: market.priceChange24H,
            volume24h: market.volume24H,
            isDerivative: false
          })),
          ...derivativeMarkets.map(market => ({
            marketId: market.marketId,
            ticker: market.ticker,
            lastPrice: market.lastPrice,
            priceChange24h: market.priceChange24H,
            volume24h: market.volume24H,
            isDerivative: true
          }))
        ];

        // Sort by volume
        const sortedMarkets = formattedMarkets.sort((a, b) => 
          (b.volume24h || 0) - (a.volume24h || 0)
        );

        setMarkets(sortedMarkets);
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchTweets = async (category) => {
    try {
      setIsTweetsLoading(true);
      console.log('Fetching tweets for category:', category);
      const tweets = await getTweets(category);
      console.log(`Received ${tweets.length} tweets for ${category}`);
      setTweets(tweets);
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setTweets([]);
    } finally {
      setIsTweetsLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'kol') {
      fetchTweets('KOLs');  
    } else if (activeView === 'project') {
      fetchTweets('Projects');
    }
  }, [activeView]);

  return (
    <div className={`h-full overflow-hidden ${isExpanded ? 'w-[67vw]' : ''}`}>
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-xl font-bold">
              Injective Markets
            </h2>
            <button
              className="p-2 rounded-lg flex items-center"
              style={{ 
                backgroundColor: theme.colors.accent + '20',
                color: theme.colors.accent
              }}
              onClick={fetchMarkets}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Mitsui Chat Button */}
          <MitsuiChatButton 
            theme={theme} 
            onClick={() => onChatOpen?.()} 
          />

          {/* Main content area */}
          <div 
            className="rounded-xl overflow-hidden flex-1"
            style={{ 
              background: theme.colors.secondary,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.colors.effects?.glow
            }}
          >
            <div className="h-full overflow-y-auto custom-scrollbar">
              {/* Market view */}
              {activeView === 'market' && (
                isLoading ? (
                  <LoadingState theme={theme} />
                ) : (
                  markets.map((market, index) => (
                    <TokenRow 
                      key={market.marketId} 
                      market={market}
                      theme={theme}
                    />
                  ))
                )
              )}

              {/* Tweet views */}
              {(activeView === 'kol' || activeView === 'project') && (
                <div className="p-4">
                  {isTweetsLoading ? (
                    <LoadingState theme={theme} />
                  ) : tweets.length > 0 ? (
                    tweets.map((tweet, index) => (
                      <TweetCard 
                        key={index}
                        tweet={tweet}
                        theme={theme}
                      />
                    ))
                  ) : (
                    <div 
                      className="text-center py-8"
                      style={{ color: theme.colors.text?.secondary }}
                    >
                      No tweets found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Feed toggle buttons (only show when expanded) */}
          {isExpanded && (
            <div className="mt-4 flex justify-center gap-3">
              <FeedToggleButton
                active={activeView === 'market'}
                onClick={() => setActiveView('market')}
                icon={TrendingUp}
                label="Market Feed"
                theme={theme}
              />
              <FeedToggleButton
                active={activeView === 'kol'}
                onClick={() => setActiveView('kol')}
                icon={Users}
                label="KOL Feed"
                theme={theme}
              />
              <FeedToggleButton
                active={activeView === 'project'}
                onClick={() => setActiveView('project')}
                icon={MessageCircle}
                label="Project Feed"
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMarketFeed; 
