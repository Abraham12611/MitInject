import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { usePrivyAuth } from '@/contexts/PrivyAuthContext';
import { getAccountPortfolio, getSpotMarkets, getDerivativeMarkets } from '@/utils/injective-client';

const PortfolioApp = ({ isExpanded, theme }) => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const { walletAddress } = usePrivyAuth();

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!walletAddress) {
        setError('Please connect your wallet');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch portfolio data
        const portfolio = await getAccountPortfolio(walletAddress);
        const [spotMarkets, derivativeMarkets] = await Promise.all([
          getSpotMarkets(),
          getDerivativeMarkets()
        ]);

        // Create a map of market data for quick lookup
        const marketMap = new Map();
        spotMarkets.forEach(market => marketMap.set(market.marketId, { 
          ...market, 
          type: 'spot' 
        }));
        derivativeMarkets.forEach(market => marketMap.set(market.marketId, { 
          ...market, 
          type: 'derivative' 
        }));

        // Calculate total portfolio value and format positions
        let total = 0;
        let weightedChange = 0;

        // Format spot positions
        const spotPositions = portfolio.spotPositions.map(position => {
          const market = marketMap.get(position.marketId);
          const value = parseFloat(position.quantity) * parseFloat(market?.lastPrice || 0);
          total += value;
          weightedChange += (market?.priceChange24H || 0) * value;

          return {
            name: market?.ticker || position.marketId,
            value,
            quantity: position.quantity,
            price: market?.lastPrice || 0,
            change: market?.priceChange24H || 0,
            type: 'spot'
          };
        });

        // Format derivative positions
        const derivativePositions = portfolio.derivativePositions.map(position => {
          const market = marketMap.get(position.marketId);
          const value = parseFloat(position.quantity) * parseFloat(market?.lastPrice || 0);
          total += value;
          weightedChange += (market?.priceChange24H || 0) * value;

          return {
            name: market?.ticker || position.marketId,
            value,
            quantity: position.quantity,
            price: market?.lastPrice || 0,
            change: market?.priceChange24H || 0,
            type: 'derivative'
          };
        });

        // Combine and format all positions
        const allPositions = [...spotPositions, ...derivativePositions]
          .filter(position => position.value > 0)
          .map(position => ({
            ...position,
            percentage: (position.value / total) * 100,
            color: getRandomColor(position.name)
          }))
          .sort((a, b) => b.value - a.value);

        // Calculate final weighted change
        const finalWeightedChange = total > 0 ? weightedChange / total : 0;

        // Separate main holdings and small holdings
        const mainHoldings = allPositions.filter(pos => pos.percentage >= 1);
        const smallHoldings = allPositions.filter(pos => pos.percentage < 1);

        // Create final portfolio data
        const formattedData = mainHoldings;
        if (smallHoldings.length > 0) {
          const othersValue = smallHoldings.reduce((sum, pos) => sum + pos.value, 0);
          const othersPercentage = (othersValue / total) * 100;
          formattedData.push({
            name: 'Others',
            value: othersValue,
            color: '#808080',
            percentage: othersPercentage,
            isOthers: true,
            tokens: smallHoldings
          });
        }

        setTotalValue(total);
        setTotalChange(finalWeightedChange);
        setPortfolioData(formattedData);
      } catch (err) {
        console.error('Portfolio fetch error:', err);
        setError('Failed to load portfolio data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [walletAddress]);

  // Generate consistent colors based on token symbol
  const getRandomColor = (symbol) => {
    const colors = {
      'INJ': '#7C3AED', // Injective purple
      'USDT': '#26A17B', // USDT green
      'WETH': '#627EEA', // Ethereum blue
    };
    return colors[symbol] || `#${Math.floor(Math.random()*16777215).toString(16)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.colors.accent }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-red-500 mb-2">{error}</div>
        {!walletAddress && (
          <div className="text-sm" style={{ color: theme.colors?.text?.secondary }}>
            Connect your wallet to view portfolio
          </div>
        )}
      </div>
    );
  }

  if (!portfolioData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div style={{ color: theme.colors?.text?.secondary }}>No positions found in portfolio</div>
        <div className="text-sm mt-2" style={{ color: theme.colors?.text?.secondary }}>
          Start trading to see your portfolio
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-hidden ${isExpanded ? 'w-[67vw]' : ''}`}>
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="p-6 space-y-8">
          {/* Total Value Section */}
          <div className={`${isExpanded ? 'grid grid-cols-2 gap-6' : 'space-y-6'}`}>
            <div>
              <h2 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="font-medium">
                Total Value
              </h2>
              <div style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-3xl font-bold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <h2 style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="font-medium">
                24h Change
              </h2>
              <div className={`text-3xl font-bold ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && portfolioData.length > 0 && (
            <>
              {/* Pie Chart */}
              <div className="h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} ${percentage.toFixed(1)}%`}
                      labelLine={false}
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          stroke={theme.colors.background}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Legend 
                      formatter={(value, entry) => {
                        const position = portfolioData.find(d => d.name === value);
                        return (
                          <span style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                            {value} - ${position?.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({position?.percentage.toFixed(1)}%)
                          </span>
                        );
                      }}
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Position List */}
              <div className="space-y-4 mt-8">
                {portfolioData.map((position, index) => (
                  <React.Fragment key={index}>
                    <div 
                      className="flex justify-between items-center p-4 rounded-lg" 
                      style={{ 
                        background: theme.colors.secondary,
                        border: `1px solid ${theme.colors.border}`,
                        borderLeft: `4px solid ${position.color}`
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: position.color }}></div>
                          <div style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="font-medium">
                            {position.name}
                          </div>
                          {position.type && (
                            <div style={{ color: theme.colors?.text?.secondary }} className="text-xs px-2 py-1 rounded-full bg-white/10">
                              {position.type}
                            </div>
                          )}
                          <div style={{ color: theme.colors?.text?.secondary }} className="text-sm">
                            {position.percentage.toFixed(1)}%
                          </div>
                        </div>
                        {!position.isOthers && (
                          <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="text-sm">
                            {position.quantity} @ ${position.price.toFixed(4)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div style={{ color: theme.colors?.text?.primary || theme.colors.text }}>
                          ${position.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        {!position.isOthers && (
                          <div className={`text-sm ${position.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {position.change >= 0 ? '+' : ''}{position.change.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </div>
                    {position.isOthers && position.tokens && (
                      <div className="ml-4 space-y-2">
                        {position.tokens.map((token, tokenIndex) => (
                          <div 
                            key={tokenIndex}
                            className="flex justify-between items-center p-3 rounded-lg" 
                            style={{ 
                              background: theme.colors.secondary,
                              border: `1px solid ${theme.colors.border}`,
                              opacity: 0.8
                            }}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <div style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-sm">
                                  {token.name}
                                </div>
                                {token.type && (
                                  <div style={{ color: theme.colors?.text?.secondary }} className="text-xs px-2 py-1 rounded-full bg-white/10">
                                    {token.type}
                                  </div>
                                )}
                                <div style={{ color: theme.colors?.text?.secondary }} className="text-xs">
                                  {token.percentage.toFixed(1)}%
                                </div>
                              </div>
                              <div style={{ color: theme.colors?.text?.secondary || theme.colors.text }} className="text-xs">
                                {token.quantity} @ ${token.price.toFixed(4)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div style={{ color: theme.colors?.text?.primary || theme.colors.text }} className="text-sm">
                                ${token.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                              <div className={`text-xs ${token.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {token.change >= 0 ? '+' : ''}{token.change.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioApp;