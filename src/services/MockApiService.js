// Mock API service to simulate responses from Injective endpoints
const INJECTIVE_TOKENS = {
  "INJ": {
    "name": "Injective",
    "symbol": "INJ",
    "price": 22.43,
    "change24h": 5.67,
    "volume24h": 187456320,
    "marketCap": 2239871500,
    "logo": "/assets/tokens/inj.png"
  },
  "USDT": {
    "name": "Tether",
    "symbol": "USDT",
    "price": 1.00,
    "change24h": 0.01,
    "volume24h": 82736450,
    "marketCap": 92837485000,
    "logo": "/assets/tokens/usdt.png"
  },
  "ETH": {
    "name": "Ethereum",
    "symbol": "ETH",
    "price": 3142.87,
    "change24h": -1.23,
    "volume24h": 345678912,
    "marketCap": 376543210000,
    "logo": "/assets/tokens/eth.png"
  },
  "ATOM": {
    "name": "Cosmos",
    "symbol": "ATOM",
    "price": 9.72,
    "change24h": 2.45,
    "volume24h": 98765432,
    "marketCap": 2876543210,
    "logo": "/assets/tokens/atom.png"
  },
  "ASTRO": {
    "name": "Astroport",
    "symbol": "ASTRO",
    "price": 0.42,
    "change24h": 12.34,
    "volume24h": 12345678,
    "marketCap": 123456789,
    "logo": "/assets/tokens/astro.png"
  }
};

// Mock user portfolio data
const USER_PORTFOLIO = {
  "assets": [
    {
      "token": "INJ",
      "balance": 123.45,
      "usdValue": 2769.08,
      "allocation": 38.5
    },
    {
      "token": "ETH",
      "balance": 1.23,
      "usdValue": 3865.73,
      "allocation": 53.7
    },
    {
      "token": "ATOM",
      "balance": 25.67,
      "usdValue": 249.51,
      "allocation": 3.5
    },
    {
      "token": "USDT",
      "balance": 307.89,
      "usdValue": 307.89,
      "allocation": 4.3
    }
  ],
  "totalValue": 7192.21,
  "change24h": 2.8
};

// Mock transaction history
const TRANSACTION_HISTORY = [
  {
    "txHash": "0x7a8d9f2c1b3e4d5a6f7c8d9e0f1a2b3c4d5e6f7a",
    "type": "Swap",
    "from": { "token": "INJ", "amount": 10.5 },
    "to": { "token": "USDT", "amount": 235.67 },
    "fee": 0.02,
    "timestamp": Date.now() - 3600000, // 1 hour ago
    "status": "Completed"
  },
  {
    "txHash": "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "type": "Deposit",
    "token": "ETH",
    "amount": 1.23,
    "fee": 0.005,
    "timestamp": Date.now() - 86400000, // 1 day ago
    "status": "Completed"
  },
  {
    "txHash": "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    "type": "Stake",
    "token": "INJ",
    "amount": 50,
    "fee": 0.01,
    "timestamp": Date.now() - 172800000, // 2 days ago
    "status": "Completed"
  }
];

// Mock liquidity pools
const LIQUIDITY_POOLS = [
  {
    "id": "inj-usdt",
    "tokenA": "INJ",
    "tokenB": "USDT",
    "reserve1": 12500,
    "reserve2": 281250,
    "fee": 0.3,
    "apr": 27.5,
    "tvl": 562500,
    "volume24h": 894250
  },
  {
    "id": "eth-usdt",
    "tokenA": "ETH",
    "tokenB": "USDT",
    "reserve1": 150,
    "reserve2": 471430.5,
    "fee": 0.3,
    "apr": 18.2,
    "tvl": 942861,
    "volume24h": 1543287
  },
  {
    "id": "atom-usdt",
    "tokenA": "ATOM",
    "tokenB": "USDT",
    "reserve1": 10000,
    "reserve2": 97200,
    "fee": 0.3,
    "apr": 12.7,
    "tvl": 194400,
    "volume24h": 523800
  }
];

// Mock oracle data (price feeds)
const ORACLE_DATA = {
  "INJ/USD": {
    "price": 22.43,
    "timestamp": Date.now() - 60000, // 1 minute ago
    "source": "Chainlink",
    "confidence": 0.95
  },
  "ETH/USD": {
    "price": 3142.87,
    "timestamp": Date.now() - 60000,
    "source": "Chainlink",
    "confidence": 0.96
  },
  "ATOM/USD": {
    "price": 9.72,
    "timestamp": Date.now() - 65000,
    "source": "Band Protocol",
    "confidence": 0.92
  }
};

// Add some random variation to prices
const addPriceVariation = (price) => {
  const variation = (Math.random() * 2 - 1) * 0.03; // Random variation between -3% and +3%
  return +(price * (1 + variation)).toFixed(2);
};

class MockApiService {
  // Get token price information
  async getTokenPrice(token) {
    // Mock data for INJ token
    const mockPriceData = {
      INJ: {
        name: 'Injective',
        symbol: 'INJ',
        price: 42.50,
        change24h: 5.2,
        volume24h: '245M',
        marketCap: '3.4B'
      }
    };

    if (mockPriceData[token]) {
      return {
        success: true,
        data: mockPriceData[token]
      };
    }

    return {
      success: false,
      error: 'Token not found'
    };
  }

  // Get all tokens
  getAllTokens() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add price variation to all tokens
        const tokens = { ...INJECTIVE_TOKENS };
        Object.keys(tokens).forEach(symbol => {
          tokens[symbol].price = addPriceVariation(tokens[symbol].price);
        });

        resolve({
          success: true,
          data: tokens
        });
      }, 1000);
    });
  }

  // Get user portfolio
  async getUserPortfolio() {
    return {
      success: true,
      data: {
        holdings: [
          {
            token: 'INJ',
            amount: 100,
            valueUsd: '4,250.00'
          },
          {
            token: 'USDT',
            amount: 5000,
            valueUsd: '5,000.00'
          },
          {
            token: 'ETH',
            amount: 1.5,
            valueUsd: '3,750.00'
          }
        ],
        totalValueUsd: '13,000.00'
      }
    };
  }

  // Get transaction history
  getTransactionHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: TRANSACTION_HISTORY
        });
      }, 900);
    });
  }

  // Get liquidity pools
  async getLiquidityPools() {
    return {
      success: true,
      data: [
        {
          tokenA: 'INJ',
          tokenB: 'USDT',
          apr: 42,
          tvl: 32450000
        },
        {
          tokenA: 'ETH',
          tokenB: 'USDT',
          apr: 38,
          tvl: 15782000
        }
      ]
    };
  }

  // Get oracle data
  getOracleData(pair) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = ORACLE_DATA[pair];
        if (data) {
          data.price = addPriceVariation(data.price);
          resolve({
            success: true,
            data
          });
        } else {
          resolve({
            success: false,
            error: "Price feed not found"
          });
        }
      }, 700);
    });
  }

  // Get swap preview
  async getSwapPreview(fromToken, toToken, amount) {
    // Mock exchange rates
    const rates = {
      'INJ/USDT': 42.50,
      'ETH/USDT': 2500,
      'INJ/ETH': 0.017
    };

    const pair = `${fromToken}/${toToken}`;
    const reversePair = `${toToken}/${fromToken}`;

    let rate = rates[pair] || (1 / rates[reversePair]);
    if (!rate) {
      return {
        success: false,
        error: 'Pair not supported'
      };
    }

    const toAmount = (amount * rate).toFixed(6);
    return {
      success: true,
      data: {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount,
        priceImpact: 0.5,
        fee: (amount * 0.001).toFixed(2)
      }
    };
  }

  // Execute swap
  async executeSwap(fromToken, toToken, amount) {
    const preview = await this.getSwapPreview(fromToken, toToken, amount);
    if (!preview.success) {
      return preview;
    }

    return {
      success: true,
      data: {
        ...preview.data,
        txHash: '0x' + Math.random().toString(36).substring(2, 15),
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Export a singleton instance
export default new MockApiService();