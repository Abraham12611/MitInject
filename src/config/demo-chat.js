// Demo chat responses for different scenarios
export const DEMO_RESPONSES = {
  // General greetings and common interactions
  greetings: {
    "hi": "Hello! I'm Mitsui, your DeFi companion. How can I help you today?",
    "hello": "Hi there! Ready to explore the world of DeFi together?",
    "gm": "Hi Alice, ready to print? 😊",
    "help": "I can help you with portfolio tracking, liquidity management, airdrop hunting, and market news. What would you like to explore?",
    "open chat window": "Would you like me to summarize the key points from the feed?",
    "Do you want me to summarize the information?": "I'd be happy to help summarize the key points from the KOL feed! Would you like me to focus on:\n\n1. Latest market trends\n2. Project updates\n3. Trading opportunities\n\nJust let me know what interests you most!"
  },

  // Command responses
  commands: {
    "/check airdrops": "Would you like me to check what projects without tokens are available to interact with?",
    "/check liquidity": "Let me check your active liquidity positions and their performance metrics.",
    "/market": "I'll analyze the current DeFi market trends and opportunities for you.",
    "/help": "Available commands:\n\n• /check airdrops - View available airdrops\n• /check liquidity - Check your liquidity positions\n• /market - See current DeFi trends\n\nYou can also ask me anything in natural language!"
  },

  // Airdrop-related responses
  airdrops: {
    "Walrus": [
      "Let me check your eligibility for the Walrus airdrop...",
      "Here's what you need to do for the Walrus airdrop:\n1. Bridge assets to Sui\n2. Interact with the testnet\n3. Join Discord & follow Twitter\n4. Complete 3 test transactions",
      "Would you like me to guide you through these steps?"
    ],
    "MovEX": [
      "Checking MovEX airdrop requirements...",
      "For MovEX, you should:\n1. Trade on their DEX\n2. Provide liquidity\n3. Participate in governance\n4. Hold their testnet tokens",
      "Want me to help you track these tasks?"
    ]
  },

  // Liquidity management responses
  liquidity: {
    "SUI/USDC": [
      "Analyzing your SUI/USDC position...",
      "Your position is currently:\n• IL: -2.3%\n• Fees earned: $142.88\n• APR: 42%\n\nRecommendation: Hold position, fees are offsetting IL.",
      "Would you like me to set up alerts for optimal rebalancing points?"
    ],
    "BLUR/USDC": [
      "Checking BLUR/USDC pool metrics...",
      "Current status:\n• IL: -1.8%\n• Fees earned: $89.32\n• APR: 38%\n\nSuggestion: Consider rebalancing if BLUR price increases by 5%.",
      "Should I monitor this position for rebalancing opportunities?"
    ]
  },

  // Market news responses
  market: {
    "sui": "SUI is showing strong momentum with:\n• 24h Volume: ↑ 15%\n• TVL: $456M\n• Active addresses: 125k\n\nKey events:\n• Mainnet upgrade next week\n• New DEX launching soon",
    "trends": "Current DeFi trends on Sui:\n1. Liquid staking gaining traction\n2. RWA protocols emerging\n3. AI-powered DEX aggregators\n4. Cross-chain bridges expansion",
  },

  // Error handling and fallbacks
  errors: {
    default: "I'm not sure about that. Could you rephrase or ask something else?",
    "not_implemented": "That feature isn't available yet, but I'm learning new things every day!",
    "technical_error": "Oops! Something went wrong. Let's try that again.",
  },

  // Fun interactions
  fun: {
    "gn": "Good night! 🌙 Don't forget to check your positions tomorrow!",
    "wagmi": "We're all gonna make it! 🚀",
    "ngmi": "Stay positive! Every dip is a buying opportunity 📈",
    "wen moon": "Focus on building! The moon will come when you least expect it 🌕",
  }
};

// Helper function to get a response
export const getResponse = (category, key) => {
  if (!DEMO_RESPONSES[category]) return DEMO_RESPONSES.errors.default;
  
  const response = DEMO_RESPONSES[category][key];
  if (!response) return DEMO_RESPONSES.errors.default;
  
  // If response is an array, return a random item
  return Array.isArray(response) ? response[Math.floor(Math.random() * response.length)] : response;
}; 