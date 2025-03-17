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

NordStar is a sophisticated network of AI agents specifically configured for Pool Protocol to provide advanced market analysis capabilities for the Injective ecosystem. This purpose-built system integrates multiple specialized tools, data sources, and analytical frameworks to deliver actionable financial intelligence. NordStar's agent-based architecture enables complex financial analysis tasks that give users a significant edge in DeFi trading environments.

Implementation details can be found here:

Core Toolkit Integrations:
- [Toolkit Configuration](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/toolkits/__init__.py): Central registry of specialized analysis toolkits
- [Injective Toolkit](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/toolkits/injective_toolkit.py): Advanced tools for Injective Protocol interactions
- [Web3 Analysis Toolkit](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/toolkits/web3_analysis_toolkit.py): Comprehensive blockchain analytics toolkit

Core Agent Framework:
- [Agent Orchestration Framework](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/utils/__init__.py): Coordination system for AI agent interactions
- [Common Utilities](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/utils/common.py): Shared utilities for data processing
- [Document Processing](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/utils/document_toolkit.py): Tools for analyzing documentation and research
- [Enhanced Role Playing](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/utils/enhanced_role_playing.py): Advanced agent interaction protocols
- [GAIA Framework](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/utils/gaia.py): General AI Assistant integration framework

Core System Components:
- [Web Application](https://github.com/Abraham12611/MitInject/blob/main/nordstar/nordstar/webapp.py): User interface for NordStar analysis system

### Trend Analysis

Pool Protocol's trend analysis module leverages NordStar to monitor market sentiment, social media trends, and on-chain activity to identify emerging patterns before they become obvious to the broader market.

The system operates through multiple specialized agent teams:

1. **Data Collection Agents**
   - **Social Media Monitors**: Track Twitter, Discord, and Telegram content using platform-specific APIs
   - **News Aggregators**: Collect and categorize financial news from over 50 crypto publications
   - **On-Chain Activity Trackers**: Monitor blockchain transactions across multiple networks with a focus on Injective
   - **Community Sentiment Analyzers**: Process community discussions to gauge market sentiment

2. **Processing Agents**
   - **Language Processors**: Filter and analyze textual content to extract meaningful signals
   - **Pattern Recognizers**: Identify recurring patterns across multiple data sources
   - **Context Analyzers**: Understand relationships between different market events
   - **Timeline Correlators**: Map temporal relationships between events and market movements

3. **Intelligence Synthesis Agents**
   - **Insight Generators**: Combine signals into actionable trading intelligence
   - **Alert Prioritizers**: Rank alerts by potential market impact and confidence level
   - **Strategy Formulators**: Convert trend insights into potential trading strategies
   - **Anomaly Detectors**: Identify unusual patterns that might indicate major market shifts

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

#### Real-World Implementation Workflow

When running a prompt, NordStar initiates a comprehensive but resource-efficient DeFi analysis workflow:

1. The system first establishes secure connections to key data sources:
   - Public APIs like DeFiLlama for TVL and protocol metrics
   - Etherscan for gas prices and network activity when API keys are available
   - Blockchain RPCs for direct on-chain data when appropriate credentials exist

2. NordStar's data collection agents then:
   - Gather time-series TVL data across multiple chains with historical context
   - Track protocol-specific metrics including dominance and growth rates
   - Monitor network conditions that might affect transaction viability
   - Compile data into structured formats optimized for analysis

3. For persistent data and enhanced analysis:
   - Historical data is stored in vector databases using pgvector for efficient retrieval
   - Semantic search capabilities enable rapid comparison with past market conditions
   - Cached results provide performance optimization while maintaining data freshness
   - Privacy-preserving mechanisms ensure user data security

4. The intelligence layer then:
   - Identifies chains and protocols with momentum shifts
   - Compares current market structure with historical patterns
   - Generates forward-looking hypotheses about market movements
   - Delivers actionable insights through the Pool Protocol interface

Our trend analysis system can:
- Monitor mentions of specific tokens across platforms, with sensitivity tuning for signal strength
- Track sentiment shifts with granular time-series capabilities to identify inflection points
- Monitor wallet movements of known influencers and institutional players
- Generate real-time alerts when sentiment metrics cross configurable thresholds
- Deliver actionable insights to users through both the UI and automated strategy execution

### Technical Analysis

The technical analysis module relies on NordStar's specialized agent networks to process market data, identify patterns, and generate trading signals based on both traditional and advanced indicators.

The implementation employs several agent teams:

1. **Data Engineering Agents**
   - **Market Data Collectors**: Gather price, volume, and order book data across exchanges
   - **Timeframe Specialists**: Process data at multiple timeframes from 1-minute to weekly
   - **Normalization Experts**: Standardize data formats for consistent analysis
   - **Quality Assurance Monitors**: Ensure data completeness and accuracy

2. **Analytical Processing Agents**
   - **Indicator Calculators**: Compute technical indicators (RSI, MACD, Bollinger Bands, etc.)
   - **Chart Pattern Recognizers**: Identify classic patterns (Head & Shoulders, Double Tops, etc.)
   - **Volatility Assessors**: Analyze market volatility components and trends
   - **Volume Profile Analyzers**: Examine trading volumes at price levels

3. **Signal Generation Agents**
   - **Multi-Factor Evaluators**: Combine indicators to generate robust signals
   - **False Signal Filters**: Reduce noise through confirmation requirements
   - **Confidence Scorers**: Assign probability metrics to potential signals
   - **Trading Logic Implementers**: Convert signals to precise entry/exit rules

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

#### Technical analysis Workflow

For technical analysis, NordStar implements a focused market analysis sequence:

1. The system first establishes connections to essential market data:
   - Exchange APIs (via ccxt) to access current and historical price data
   - Injective-specific data providers for specialized market metrics
   - Reference databases of historical performance patterns

2. NordStar's technical analysis agents then:
   - Calculate essential indicators based on retrieved market data
   - Compare current market conditions with historical contexts
   - Identify potential price action patterns with statistical relevance
   - Generate a consolidated view of market conditions with confidence levels

3. For enhanced analysis when appropriate credentials exist:
   - Price data is enriched with order book depth metrics
   - Volume is analyzed for divergence patterns and unusual activity
   - Market microstructure is examined for institutional footprints
   - Correlations with related assets are established

4. The intelligence layer then:
   - Synthesizes technical indicators into clear market signals
   - Assigns confidence levels based on indicator convergence
   - Generates specific price targets and risk levels
   - Delivers actionable trading recommendations

In a full implementation, NordStar technical analysis includes:
- Real-time calculation of over 50 technical indicators with optimized algorithms
- Pattern recognition with machine learning models trained on historical price action
- Multi-timeframe analysis with intelligent timeframe correlation
- Comprehensive backtesting against historical data with performance metrics
- Custom strategy building with adjustable parameters and risk controls
- Automated trade execution via Pool Protocol's If-This-Then-That system

### Agent Collaboration Framework

NordStar's true power comes from its agent collaboration framework, where specialized agents work together to create insights greater than the sum of their parts:

1. **Hierarchical Collaboration**
   - Specialized agents focus on narrow tasks within their expertise
   - Supervisor agents coordinate activity and resolve conflicts
   - Synthesis agents combine insights from multiple domains
   - Executive agents translate insights into actionable recommendations

2. **Multi-Modal Analysis**
   - Technical indicators provide quantitative market structure insights
   - Sentiment analysis captures qualitative market psychology
   - On-chain analytics reveal actual fund movements and contract interactions
   - Economic metrics provide contextual macro environment understanding

3. **Temporal Integration**
   - Short-term signals (minutes to hours) capture immediate opportunities
   - Medium-term analysis (days to weeks) identifies developing trends
   - Long-term studies (weeks to months) establish market context
   - Time-series correlations enhance prediction capabilities

4. **Adaptive Learning**
   - Performance metrics track prediction accuracy
   - Feedback loops refine analytical methods
   - Weighting algorithms prioritize consistently successful signals
   - Environmental context shifts analytical focus based on market conditions

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
npm run dev

```
