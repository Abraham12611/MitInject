# Mitsui Terminal 

**Twitter**: [@MitsuiProtocol](https://x.com/MitsuiProtocol)   
**Website**: [https://www.mitsuiprotocol.ai](https://www.mitsuiprotocol.ai)

![mitsui-banner](https://github.com/user-attachments/assets/41f52c06-4ac3-4357-918c-27b684841551)


## Table of Contentsa

- [Overview](#overview)
- [Integrations](#integrations)
  - [Sui Network](#sui-network)
  - [Atoma Network](#atoma-network)
  - [Eliza Framework](#eliza-framework)
  - [Bluefin](#bluefin)
  - [Navi Protocol](#navi-protocol)
  - [Suilend](#suilend)
- [Features](#features)
- [Run](#run)

## Contact Us
**Twitter**: [@MitsuiProtocol](https://x.com/MitsuiProtocol)   
**Website**: [https://www.mitsuiprotocol.ai](https://www.mitsuiprotocol.ai)


## Overview
Mitsui Terminal is a next-gen DeFi trading and management desktop app (for Mac and Windows), seamlessly integrating AI-driven automation with DeFi protocols on Sui. Powered by Mitsui Protocol, Mitsui Terminal simplifies DeFi interactions, enhances market intelligence, and provides smart insights for traders, investors, and developers. Designed to be intuitive yet powerful, Mitsui Terminal brings together seamless tooling integrations, predictive analytics, and automated workflows to optimize trading, lending, and asset management across multiple protocols.

<img src="https://github.com/user-attachments/assets/264211f3-7c46-45f2-acb0-d9b836a40617" alt="Mitsui High Level Design" width="600"/>

Unlike other AI-driven automation tools, Mitsui Terminal is a self-hosted and non-custodial platform, meaning users maintain full control over their assets at all times. Mitsui Terminal does not store private keys or require third-party trust, which ensures maximum security and privacy. Users can deploy and manage their own instance of the terminal, giving them the flexibility to customize workflows, integrate new protocols, leverage mini apps, and retain full sovereignty over their DeFi interactions.
With Mitsui Terminal, users can engage in a variety of workflows:
- **Trading Automation**: Set up AI-driven driven strategies that execute trades based on real-time market conditions through its If-This-Then-That (IFTTT) mini app. 
- **Lending Optimization**: Allocate assets across multiple lending markets while minimizing risk.
- **Airdrop Management**: Track, qualify for, and automatically claim upcoming airdrops such Walrus.
- **Risk Assessment & Alerts**: Receive predictive insights and alerts on potential market downturns or opportunities based on open data sets, and real-time data (e.g. Twitter feed, RSS)
- **DeFi Portfolio Tracking**: Monitor and rebalance assets across multiple protocols with real-time updates.

## Integrations

### Sui Network
Mitsui Terminal implements two non-custodial login methods:
1. **ZK Login** through Google OAuth
2. Import & wallet creation

Implementation details can be found here:
- [Google Sign In](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/components/auth/GoogleSignIn.tsx)
- [ZK Login Local Service](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/utils/zkLogin.ts)
- [ZK Login JWTAddress + Proof](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/app/api/zk-login/route.ts)

Beyond this, Mitsui Terminal leverages **Walrus devnet storage** to store sentiment analysis data processed in batches.
The plan is to create enough timestamp datasets that can be leveraged by the community. Implementaton of this can be found here:
- [General data batch procesing scripts](https://github.com/Mitsui-Protocol/mitsui-terminal/tree/main/scripts)
- [Walrus upload implementation](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/scripts/push-to-walrus.js)




https://github.com/user-attachments/assets/1f745c34-3252-4ee4-a449-11c1745446f0



### Atoma Network
Mitsui Terminal has the ability to leverage local open source models ran on-device, and also remotely access models such as DeepSeek offered by Atoma Network. 

Implementation of the agent functionality can be found here:
- [Atoma agent queries](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/app/api/chat/route.js)

We further leverage Atoma's model to analyze tweets:
- [Analyzer scripts](https://github.com/Mitsui-Protocol/mitsui-terminal/tree/main/scripts)
- [Tweet analyzer](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/scripts/analyze-tweets.js)



https://github.com/user-attachments/assets/a4b67752-910b-4794-8b84-b10121f761e9


### Eliza Framework
To afford Mitsui Terminal with a personality the Eliza Framework is used to create multiple characters. Additionally, we leverage their Twitter service to scrape tweets.

The initial Eliza character sheet can be found here:
- [Character sheet](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/characters/mitsui.character.json)

### Bluefin
We showcase the automated interaction of our If-This-Then-That tool with Bluefin in the video below, the source code can be found here:

- [Bluefin Mitsui service hook](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/utils/bluefin.ts)

```
If significant holder movement takes place
Then swap 0.1 USDT to USDC
```

https://github.com/user-attachments/assets/ad8a89ab-60b8-4f92-af6b-3a11ae8c4a14


### Navi Protocol
We showcase the automated interaction of our If-This-Then-That tool with NAVI Protocol in the video below, the source code can be found here:

- [Navi Protocol Mitsui service hook](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/utils/navi.ts)

```
If $SUI is above $3.00
Then supply 0.5 $SUI to Navi protocol
```

https://github.com/user-attachments/assets/f4c589c7-2deb-4a0f-9dc2-0b26b98331a8


### Suilend
We showcase the automated interaction of our If-This-Then-That tool with Suilend in the video below, the source code can be found here:

- [Suilend Mitsui service hook](https://github.com/Mitsui-Protocol/mitsui-terminal/blob/main/src/utils/suilend.ts)

```

If $SUI is below is $2.00 dollars
Then deposit 0.2 SUI
```

https://github.com/user-attachments/assets/86761f95-961d-4683-a2e3-af614f40d413

## Features

### Mini Apps
<img src="https://github.com/user-attachments/assets/7150a8a2-c45c-46b8-ba40-8eb10e218cbd" alt="Mitsui Mini App" width="600"/>

### Market Feed Example

<img src="https://github.com/user-attachments/assets/4f79a398-665c-4a8e-bdad-10502f816166" alt="Mitsui Market Feed" width="600"/>

<img src="https://github.com/user-attachments/assets/da28bbbe-df87-4e13-a171-2e1718dc8a98" alt="Mitsui Market Feed" width="600"/>

<img src="https://github.com/user-attachments/assets/e3fefb7a-7399-48ae-a947-bee379bb29a8" alt="Mitsui Market Feed" width="600"/>

## Run

To fully run Mitsui Terminal locally, you need the following environment variables. 
```
# .env.local
NEXT_PUBLIC_GOOGLE_DESKTOP_CLIENT_ID=
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=

ATOMA_API_KEY=
INSIDEX_API_KEY=
OPENAI_API_KEY=
WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
SUI_RPC_URL=https://fullnode.mainnet.sui.io
SUI_SCAN_API=https://api.suiscan.xyz
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
# STEP 1: Install depedencies
pnpm install

# STEP 2: Run terminal 
npm run tauri dev

```

