# Pool Protocol

**Twitter**: [@PoolProtocol](https://x.com/PoolProtocol)

![pool-banner](https://i.ibb.co/39gPtnb3/Designer.png)


## Table of Contents

- [Overview](#overview)
- [Integrations](#integrations)
  - [Injective Network](#injective-network)
  - [Helix](#helix)
  - [Astroport](#astroport)
- [NordStar Integrations](#nordstar-integrations)
  - [Trend Analysis](#trend-analysis)
  - [Technical Analysis](#technical-analysis)
- [Features](#features)
- [Run](#run)

## Contact Us
**Twitter**: [@PoolProtocol](https://x.com/PoolProtocol)



## Overview
Pool Protocol is a next-gen DeFi trading and management platform, seamlessly integrating AI-driven automation with DeFi protocols on Injective. Powered by Pool Protocol, Pool Terminal simplifies DeFi interactions, enhances market intelligence, and provides smart insights for traders, investors, and developers. Designed to be intuitive yet powerful, Pool Terminal brings together seamless tooling integrations, predictive analytics, and automated workflows to optimize trading, lending, and asset management across multiple protocols.

<img src="https://i.ibb.co/VpgLFh6f/Pool-protocol2-drawio.png" alt="Pool High Level Design" width="600"/>


With Pool Terminal, users can engage in a variety of workflows:
- **Trading Automation**: Set up AI-driven driven strategies that execute trades based on real-time market conditions.
- **Lending Optimization**: Allocate assets across multiple lending markets while minimizing risk.
- **Trend Analysis**: Analyze trends to gain competitive advantage.
- **Risk Assessment & Alerts**: Receive predictive insights and alerts on potential market downturns or opportunities based on open data sets, and real-time data (e.g. Twitter feed, RSS)
- **DeFi Portfolio Tracking**: Monitor and rebalance assets across multiple protocols with real-time updates.

## Integrations

### Injective Network
Pool Protocol implements a comprehensive integration with the Injective Network, providing a robust foundation for DeFi applications. The integration includes wallet management, transaction handling, market data access, and advanced portfolio analytics.

Implementation details can be found here:
- [Injective Client](https://github.com/Abraham12611/MitInject/blob/main/src/utils/injective-client.ts): Core integration with Injective APIs for market data and transactions
- [Injective Wallet](https://github.com/Abraham12611/MitInject/blob/main/src/utils/injective-wallet.ts): Wallet connection and management for Injective accounts
- [Injective Signing](https://github.com/Abraham12611/MitInject/blob/main/src/utils/injective-signing.ts): Transaction signing and order creation functionality
- [Portfolio Analytics Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/portfolio-analytics.ts): Advanced portfolio tracking and risk metrics
- [Liquidity Pool Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/liquidity-pool.ts): Management of liquidity positions on Injective

The integration offers several key components:

1. **Wallet Connectivity**
   - Custom wallet strategy implementation for secure connections
   - Support for account management and chain switching
   - Address derivation and transaction signing

2. **Market Data Access**
   - Real-time orderbook data from Injective's indexer API
   - Comprehensive market information for both spot and derivatives
   - Portfolio tracking and position management

3. **Transaction Handling**
   - Support for spot and derivative order creation
   - Transaction signing with proper gas estimation
   - Order cancellation and management

4. **Portfolio Analytics**
   - Advanced risk metrics calculation including Sharpe ratio
   - Historical performance tracking with volatility analysis
   - Portfolio diversification scoring

5. **Liquidity Pool Management**
   - Pool metrics monitoring including APY and impermanent loss
   - Liquidity provision with slippage protection
   - Position management for multiple pools

All integrations leverage the official Injective SDK packages with custom implementations tailored for Pool Protocol's requirements. This ensures compatibility with the latest Injective features while providing a seamless experience for users.

Beyond this, Pool Terminal leverages **Injective chain storage** to store sentiment analysis data processed in batches.
The plan is to create enough timestamp datasets that can be leveraged by the community. Implementation of this can be found here:
- [General data batch processing scripts](https://github.com/Abraham12611/repo/scripts)
- [Injective upload implementation](https://github.com/Abraham12611/repo/scripts/push-to-injective.js)


### Helix
Helix is Injective's premier decentralized exchange, providing sophisticated trading functionality for spot and derivative markets. Our Pool Protocol integrates with Helix to enable automated trading strategies through our If-This-Then-That (IFTTT) system.

We have implemented a comprehensive integration with Helix, providing a robust foundation for automated trading and liquidity provision strategies. The integration leverages the official Injective TypeScript SDK to access market data, execute trades, and manage liquidity positions.

Implementation details can be found here:
- [Types and Interfaces](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/types.ts): Core type definitions for the Helix integration
- [Configuration](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/config.ts): Network and transaction configuration settings
- [Market Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/market.ts): Real-time market data access and price monitoring
- [Trading Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/trading.ts): Order execution and position management
- [Liquidity Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/liquidity.ts):
- [Integration Index](https://github.com/Abraham12611/MitInject/blob/main/src/services/helix/index.ts): Unified exports for easy access to integration components

The integration offers several key components:

1. **Market Data Access**
   - Real-time price feeds and order book data from Helix markets
   - Streaming trade data with threshold-based triggers
   - Comprehensive market information and historical trades

2. **Trading Capabilities**
   - Spot market order execution with custom parameters
   - Conditional order creation based on price thresholds
   - Order cancellation and management

3. **Liquidity Provision**
   - Limit order creation for liquidity depth
   - Automated liquidity rebalancing with target spreads
   - Position management across multiple markets

4. **IFTTT System**
   - Flexible condition-based triggers for automated trading
   - Factory pattern for creating common conditions and actions
   - Support for custom logic and complex multi-condition strategies

The integration enables sophisticated conditional trading workflows such as:

```typescript
// Complete implementation of an INJ price-triggered swap strategy
import {
  IftttRule,
  ConditionFactory,
  ActionFactory,
  HelixMarketService
} from './services/helix';

// Initialize the factories and services
const marketService = new HelixMarketService('mainnet');
const conditionFactory = new ConditionFactory('mainnet');
const actionFactory = new ActionFactory('mainnet');

// Create a scheduled function to check price conditions and execute trades
async function runTradingStrategy() {
  // Set up price monitoring for INJ/USDT market
  const injPriceCondition = conditionFactory.createPriceAboveCondition(
    'inj_usdt_market_id',
    '20.00' // Price threshold
  );

  // Create an action to swap USDT to USDC
  const swapAction = actionFactory.createSwapAction('Swap 0.1 USDT to USDC');

  // Create and evaluate the rule
  const rule = new IftttRule(
    injPriceCondition,
    swapAction,
    {
      privateKeyHex: process.env.PRIVATE_KEY,
      marketId: 'usdt_usdc_market_id',
      orderSide: 'BUY',
      quantity: '0.1',
      price: '1.001'  // Slightly above 1:1 to ensure execution
    });
    console.log('Swap executed: 0.1 USDT to USDC');
  }
);
```

The Helix integration provides real-time market data through Injective's indexer API, allowing users to monitor prices and market conditions across multiple trading pairs:

![Markets](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/helix-int-markets.png)


The Strategies tab provides an overview of all configured automated trading rules. Each strategy shows its trigger condition, action, and last execution time. Users can easily manage their strategies by activating or pausing them.

![Strategies](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/helix-int-strategy.png)

The IFTTT system allows users to create conditional strategies. Behind the scenes, this leverages the ConditionFactory and ActionFactory components from our Helix integration.

![Strategies](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/helix-int-new-strategy.png)

![Strategies](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/helix-int-new-strategy-2.png)


This integration provides the foundation for Pool Protocol's advanced automated trading strategies, allowing users to create sophisticated conditional workflows with minimal configuration.

### Astroport
Astroport is a leading automated market maker (AMM) in the Cosmos ecosystem that Pool Protocol integrates with to expand cross-chain trading capabilities. Our comprehensive integration provides access to liquidity pools across multiple Cosmos-based chains including Injective, Terra, and Osmosis, enabling sophisticated cross-chain trading and asset management.

Implementation details can be found here:
- [Types and Interfaces](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/types.ts): Core type definitions for assets, pools, and transactions
- [Configuration](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/config.ts): Network settings for Astroport on Injective
- [Liquidity Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/liquidity.ts): Pool interactions and swap functionality
- [Portfolio Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/portfolio.ts): Position tracking and risk metrics
- [Transaction Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/transaction.ts): Transaction execution and signing
- [Cross-Chain Service](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/crosschain.ts): IBC transfers and cross-chain routing
- [Integration Index](https://github.com/Abraham12611/MitInject/blob/main/src/services/astroport/index.ts): Unified exports for the Astroport integration

The integration offers several key components:

1. **Cross-Chain Liquidity Access**
   - Pool information retrieval across multiple Cosmos chains
   - Swap simulation with price impact calculation
   - Transaction execution with slippage protection
   - IBC transfers between supported networks
   - Optimal routing for cross-chain trades

2. **Asset Management**
   - Portfolio exposure tracking across multiple pools
   - Impermanent loss calculation based on pool types
   - APR estimation including fee and incentive rewards
   - Liquidity position monitoring with real-time updates
   - Risk assessment for different pool types

3. **IFTTT Integration**
   - Seamless integration with the existing IFTTT system
   - Condition-based triggers for Astroport actions
   - Custom transaction parameters for advanced strategies

The integration supports various pool types:
- **Constant Product Pools**: Traditional x*y=k pools similar to Uniswap V2
- **Stableswap Pools**: Specialized for stable asset pairs with reduced slippage
- **Passive Concentrated Liquidity**: Enhanced capital efficiency through concentrated liquidity

#### Functional Workflow Demonstration

```typescript
// Complete workflow for cross-chain trading on Astroport
import {
  AstroportLiquidityService,
  AstroportCrossChainService,
  AstroportPortfolioService
} from './services/astroport';
import { IftttRule, ConditionFactory } from './services/helix';

// Initialize core services
const liquidityService = new AstroportLiquidityService('mainnet');
const crossChainService = new AstroportCrossChainService('mainnet');
const portfolioService = new AstroportPortfolioService('mainnet');
const conditionFactory = new ConditionFactory('mainnet');

// Initialize with user wallet
await liquidityService.initTransactionService('your-secure-mnemonic');
await crossChainService.initService('your-secure-mnemonic');

// STEP 1: Create a condition to monitor Injective asset prices
const injPriceDropCondition = conditionFactory.createPriceBelowCondition(
  'inj_usdt_market_id',
  '15.00' // Price threshold
);

// STEP 2: When condition triggers, execute a cross-chain swap sequence
async function executeCrossChainStrategy() {
  try {
    // Transfer USDT from Injective to Osmosis via IBC
    const ibcTransfer = await crossChainService.transferTokens({
      senderAddress: 'inj1...',
      recipientAddress: 'osmo1...',
      sourceChain: 'injective',
      destinationChain: 'osmosis',
      amount: '100000000', // 100 USDT
      denom: 'usdt'
    });
    console.log(`IBC transfer completed: ${ibcTransfer}`);

    // Find optimal route for trading USDT to ATOM on Osmosis
    const route = crossChainService.findOptimalRoute(
      'osmosis',
      'usdt',
      'osmosis',
      'atom'
    );

    // Execute the swap on Osmosis via Astroport
    const poolAddress = 'osmo1...'; // USDT-ATOM pool
    const swapResult = await liquidityService.executeSwap({
      senderAddress: 'osmo1...',
      poolAddress,
      tokenIn: { native_token: { denom: 'ibc/usdt...' } }, // IBC denom
      amountIn: '100000000', // 100 USDT
      minAmountOut: '3500000', // Minimum ATOM to receive
      maxSpread: '0.01' // 1% max slippage
    });

    console.log(`Swap executed: ${swapResult.transactionHash}`);
    console.log(`Received: ${swapResult.returnAmount} ATOM`);

    // Monitor position value and calculate impermanent loss
    const positions = await portfolioService.getUserLiquidityPositions(
      'inj1...',
      [{lpTokenAddress: 'inj1...', poolAddress: 'inj1...', poolType: 'constant_product'}]
    );

    console.log(`Current portfolio value: ${positions[0].dollarValue} USD`);
  } catch (error) {
    console.error('Strategy execution failed:', error);
  }
}

// STEP 3: Set up the automated rule
const rule = new IftttRule(
  injPriceDropCondition,
  {
    name: 'Cross-Chain Swap Strategy',
    description: 'Buy ATOM when INJ price drops',
    execute: executeCrossChainStrategy
  }
);

// Register the rule for automated monitoring
registerRule(rule);
```

The Astroport integration enables sophisticated cross-chain strategies that can be triggered by market conditions, time-based events, or wallet activities. This creates powerful opportunities for DeFi users to:

1. Capture arbitrage opportunities across Cosmos chains
2. Diversify portfolios with automated cross-chain rebalancing
3. Execute complex strategies involving multiple DEXs and asset types
4. Optimize yields by automatically moving liquidity to the highest APR pools

The Astroport integration enables seamless cross-chain swaps, allowing users to trade assets across different Cosmos chains. The interface shows the optimal route, estimated fees, and expected return amount.

![Astroport swap](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/astroport-int-swap.png)


The Pools tab provides an overview of all available liquidity pools across different chains. Users can see key metrics like Total Value Locked, APR, and 24-hour trading volume. The integration supports different pool types including Constant Product pools, Stableswap pools, and Concentrated Liquidity pools.

![Astroport pools](https://github.com/Abraham12611/MitInject/blob/main/public/assets/demonstration/astroport-int-pools.png)

This implementation provides the foundation for Pool Protocol's advanced cross-chain capabilities, allowing users to seamlessly access liquidity across the Cosmos ecosystem through a unified interface.


## NordStar Integrations

Pool Protocol leverages the powerful NordStar framework (based on CAMEL-AI's OWL technology) to provide advanced market analysis capabilities for Injective. Our implementation creates an agent-based society that performs complex financial analysis tasks to give users an edge in DeFi trading.

Implementation details can be found here:
- [Injective Analysis System](https://github.com/Abraham12611/MitInject/owl/examples/run_injective_analysis.py): Core market analysis engine for Injective assets
- [Agent Orchestration Utilities](https://github.com/Abraham12611/MitInject/owl/owl/utils/__init__.py): Framework for coordinating AI agents in market analysis

### Trend Analysis

Pool Protocol's trend analysis module uses NordStar to monitor market sentiment, social media trends, and on-chain activity to identify emerging patterns before they become obvious to the broader market.

The implementation utilizes a multi-agent system that employs:
- Data collection agents to gather information from diverse sources
- Analysis agents that process and interpret the data
- Strategy agents that generate actionable insights

```
                 +----------------+
                 | User Interface |
                 +----------------+
                         |
                         v
+----------------+    +----------------+    +----------------+
| Data Collection|<-->| NordStar      |<-->| Alert System   |
+----------------+    | Processing     |    +----------------+
        |             +----------------+            |
        v                     |                     v
+----------------+    +----------------+    +----------------+
| Social Feeds   |    | ML Models      |    | User Dashboard |
+----------------+    +----------------+    +----------------+
```

Our trend analysis system can:
- Monitor Twitter, Discord, and Telegram for mentions of specific tokens
- Analyze sentiment shifts in real-time
- Track wallet movements of known influencers
- Generate alerts for sudden changes in market sentiment
- Provide actionable insights through the If-This-Then-That system

### Technical Analysis

The technical analysis module uses NordStar to process market data, identify patterns, and generate trading signals based on traditional and advanced indicators.

The implementation leverages specialized agents focused on:
- Pattern recognition in price charts
- Indicator calculation and interpretation
- Signal generation based on multiple data sources

```
          +-------------------+
          |  Market Data API  |
          +-------------------+
                   |
                   v
   +--------------------------------+
   |      NordStar Processing       |
   |--------------------------------|
   | +-------------+ +------------+ |
   | | Indicator   | | Pattern    | |
   | | Calculation | | Recognition| |
   | +-------------+ +------------+ |
   |       |              |         |
   | +-------------------------+    |
   | |    Signal Generation    |    |
   | +-------------------------+    |
   +--------------------------------+
                   |
                   v
   +--------------------------------+
   |        Strategy Execution      |
   +--------------------------------+
```

Our technical analysis system includes:
- Real-time calculation of 30+ technical indicators
- Pattern recognition for chart formations
- Multi-timeframe analysis
- Backtesting capabilities
- Custom strategy builder
- Automated trade execution via If-This-Then-That

## Features

### Mini Apps
<img src="https://github.com/user-attachments/assets/7150a8a2-c45c-46b8-ba40-8eb218cbd" alt="Pool Mini App" width="600"/>

### Market Feed Example

<img src="https://github.com/user-attachments/assets/4f79a398-668e-bdad-10502f816166" alt="Pool Market Feed" width="600"/>

<img src="https://github.com/user-attachments/assets/da28bbbe-d4e13-a171-2e1718dc8a98" alt="Pool Market Feed" width="600"/>

<img src="https://github.com/user-attachments/assets/e3fefb79-48ae-a947-bee379bb29a8" alt="Pool Market Feed" width="600"/>

## Run

To fully run Pool Terminal locally, you need the following environment variables.
```
# .env.local
NEXT_PUBLIC_GOOGLE_DESKTOP_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=

OPENAI_API_KEY=
INJECTIVE_API_KEY=
INJECTIVE_NODE_URL=https://lcd.injective.network
INJECTIVE_EXPLORER_API=https://explorer.injective.network/api
NEXT_PUBLIC_PUBLIC_KEY=
NEXT_PUBLIC_SAMPLE_SEED_PHRASE=
NEXT_PUBLIC_PUBLIC_KEY2=
NEXT_PUBLIC_PRIVATE_KEY2=
NEXT_PUBLIC_BLOCKVISION_API_KEY=
NEXT_PUBLIC_BLOCKVISION_HTPPS=
NEXT_PUBLIC_BLOCKVISION_WEBSOCKETS=
```
### Steps
```
# STEP 1: Install dependencies
pnpm install

# STEP 2: Run terminal
npm run tauri dev

```
