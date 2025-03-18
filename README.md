# Pool Protocol

**Twitter**: [@PoolProtocol](https://x.com/PoolProtocol)

![pool-banner](https://i.ibb.co/39gPtnb3/Designer.png)


## Table of Contents

- [Overview](#overview)
- [Integrations](#integrations)
  - [Injective Network](#injective-network)
  - [Helix](#helix)
  - [Astroport](#astroport)
  - [Frontrunner](#frontrunner)
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
- [Injective Client](https://github.com/Abraham12611/MitInject/src/utils/injective-client.ts): Core integration with Injective APIs for market data and transactions
- [Injective Wallet](https://github.com/Abraham12611/MitInject/src/utils/injective-wallet.ts): Wallet connection and management for Injective accounts
- [Injective Signing](https://github.com/Abraham12611/MitInject/src/utils/injective-signing.ts): Transaction signing and order creation functionality
- [Portfolio Analytics Service](https://github.com/Abraham12611/MitInject/src/services/portfolio-analytics.ts): Advanced portfolio tracking and risk metrics
- [Liquidity Pool Service](https://github.com/Abraham12611/MitInject/src/services/liquidity-pool.ts): Management of liquidity positions on Injective

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

While we're continuing to develop the full integration, the current implementation demonstrates the prototype capability for executing trades based on predefined conditions.

The planned full integration will include:

1. **Market Data Access**
   - Real-time price feeds from Helix markets
   - Order book monitoring
   - Trade execution confirmation

2. **Trading Capabilities**
   - Spot market order execution
   - Limit order placement
   - Position management
   - Automated strategy execution

3. **Liquidity Provision**
   - Participation in Helix liquidity pools
   - Fee earning from trading activity
   - LP token management

The current demonstration allows for basic conditional trading:

```
If $INJ is above $20.00
Then swap 0.1 USDT to USDC
```


### Astroport
Astroport is a leading automated market maker (AMM) in the Cosmos ecosystem that Pool Protocol integrates with to expand cross-chain trading capabilities. This integration enables users to access liquid trading pools across multiple Cosmos-based chains, including Terra and Injective.

The integration with Astroport is designed to work seamlessly with our automation system, allowing for condition-based trading and liquidity provision. Our mock implementation demonstrates these capabilities as we continue developing the full integration.

Key features of the Astroport integration include:

1. **Cross-Chain Liquidity Access**
   - Access to deep liquidity pools across the Cosmos ecosystem
   - Reduced slippage for large trades via concentrated liquidity
   - Support for multiple token swaps in a single transaction

2. **Automated Trading Functions**
   - Conditional swaps based on market triggers
   - Automated liquidity provision and removal
   - Fee optimization based on market conditions

3. **Asset Management**
   - Portfolio exposure to Astroport's native ASTRO token
   - Tracking of liquidity positions across multiple pools
   - Risk assessment for impermanent loss

The demonstration showcases the ability to react to market conditions with automated trades:

```
If significant holder movement takes place
Then swap 0.1 USTC to USDC
```


### Frontrunner
Frontrunner is an innovative perpetual DEX on Injective that specializes in derivatives trading with advanced features for professional traders. Pool Protocol's integration with Frontrunner enables users to execute sophisticated trading strategies through our automated trading system.

The integration is designed to leverage Frontrunner's key capabilities:

1. **Perpetual Futures Trading**
   - Access to leveraged trading positions on Injective
   - Support for long and short positions
   - Automated position entry and exit based on market conditions

2. **Risk Management Tools**
   - Automated stop-loss and take-profit execution
   - Position sizing based on portfolio risk parameters
   - Liquidation protection through conditional orders

3. **Advanced Order Types**
   - Limit, market, and conditional orders
   - Time-weighted average price (TWAP) execution
   - Multi-leg strategy execution

The current demonstration showcases the potential for condition-based trading strategies:

```
If $INJ is below is $15.00 dollars
Then enter long position with 0.2 INJ
```

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
