import mockApiService from './MockApiService';
import { getThinkingMessage } from '@/config/demo-chat';

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper to get current formatted time
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

// Detect user intent from message text
const detectIntent = (text) => {
  const lowerText = text.toLowerCase();

  // Check for price inquiries
  if (/price of (\w+)|(\w+) price|how much is (\w+)|what is (\w+) worth/i.test(lowerText)) {
    const matches = lowerText.match(/price of (\w+)|(\w+) price|how much is (\w+)|what is (\w+) worth/i);
    let token = '';

    for (let i = 1; i < matches.length; i++) {
      if (matches[i]) {
        token = matches[i];
        break;
      }
    }

    return { type: 'price', token };
  }

  // Check for portfolio requests
  if (/portfolio|my holdings|my assets|my tokens|my balance/i.test(lowerText)) {
    return { type: 'portfolio' };
  }

  // Check for swap requests
  if (/swap (\d+\.?\d*) (\w+) (to|for) (\w+)|exchange (\d+\.?\d*) (\w+) (to|for) (\w+)/i.test(lowerText)) {
    const swapMatch = lowerText.match(/swap (\d+\.?\d*) (\w+) (to|for) (\w+)/i) ||
                      lowerText.match(/exchange (\d+\.?\d*) (\w+) (to|for) (\w+)/i);

    if (swapMatch) {
      return {
        type: 'swap',
        amount: parseFloat(swapMatch[1]),
        fromToken: swapMatch[2],
        toToken: swapMatch[4]
      };
    }
  }

  // Check for pool/liquidity requests
  if (/pools|liquidity pools|best pools|highest yield/i.test(lowerText)) {
    return { type: 'pools' };
  }

  // Default - couldn't determine intent
  return { type: 'unknown' };
};

class ChatService {
  // Process a user message and generate an appropriate response
  async processMessage(message) {
    const intent = detectIntent(message);
    const messages = [];

    switch (intent.type) {
      case 'price':
        return this.handlePriceRequest(intent.token);

      case 'portfolio':
        return this.handlePortfolioRequest();

      case 'swap':
        return this.handleSwapRequest(intent.fromToken, intent.toToken, intent.amount);

      case 'pools':
        return this.handlePoolsRequest();

      default:
        // For unknown intents, return a simple acknowledgment
        return [{
          id: generateId(),
          content: "I'm not sure what you're asking for. You can try asking for token prices, your portfolio, or making a swap.",
          isUser: false,
          timestamp: getCurrentTime()
        }];
    }
  }

  // Handle price request
  async handlePriceRequest(token) {
    const messages = [];

    // Add thinking message
    const thinkingMsg = {
      id: generateId(),
      content: getThinkingMessage('price'),
      isUser: false,
      timestamp: getCurrentTime(),
      isThinking: true
    };
    messages.push(thinkingMsg);

    try {
      // Fetch token price
      const response = await mockApiService.getTokenPrice(token);

      if (response.success) {
        // Remove thinking message and add price display
        messages.pop();

        // Add text response
        messages.push({
          id: generateId(),
          content: `Here's the current price information for ${response.data.name} (${response.data.symbol}):`,
          isUser: false,
          timestamp: getCurrentTime()
        });

        // Add data display
        messages.push({
          id: generateId(),
          display: {
            type: 'token-price',
            data: response.data
          },
          isUser: false,
          timestamp: getCurrentTime()
        });
      } else {
        // Replace thinking with error message
        messages.pop();
        messages.push({
          id: generateId(),
          content: `I couldn't find information for ${token}. Injective supports INJ, ATOM, ETH, USDT, and other major tokens. Could you try one of these?`,
          isUser: false,
          timestamp: getCurrentTime()
        });
      }
    } catch (error) {
      // Replace thinking with error message
      messages.pop();
      messages.push({
        id: generateId(),
        content: "Sorry, there was an error fetching the price data. Please try again later.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    }

    return messages;
  }

  // Handle portfolio request
  async handlePortfolioRequest() {
    const messages = [];

    // Add thinking message
    const thinkingMsg = {
      id: generateId(),
      content: getThinkingMessage('portfolio'),
      isUser: false,
      timestamp: getCurrentTime(),
      isThinking: true
    };
    messages.push(thinkingMsg);

    try {
      // Fetch portfolio data
      const response = await mockApiService.getUserPortfolio();

      if (response.success) {
        // Remove thinking message
        messages.pop();

        // Add text response
        messages.push({
          id: generateId(),
          content: "Here's your current portfolio on Injective:",
          isUser: false,
          timestamp: getCurrentTime()
        });

        // Add portfolio display
        messages.push({
          id: generateId(),
          display: {
            type: 'portfolio',
            data: response.data
          },
          isUser: false,
          timestamp: getCurrentTime()
        });
      } else {
        // Replace thinking with error message
        messages.pop();
        messages.push({
          id: generateId(),
          content: "I couldn't retrieve your portfolio information. Make sure your wallet is connected to Injective.",
          isUser: false,
          timestamp: getCurrentTime()
        });
      }
    } catch (error) {
      // Replace thinking with error message
      messages.pop();
      messages.push({
        id: generateId(),
        content: "Sorry, there was an error fetching your portfolio data. Please try again later.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    }

    return messages;
  }

  // Handle swap request
  async handleSwapRequest(fromToken, toToken, amount) {
    const messages = [];

    // Add thinking message
    const thinkingMsg = {
      id: generateId(),
      content: getThinkingMessage('swap'),
      isUser: false,
      timestamp: getCurrentTime(),
      isThinking: true
    };
    messages.push(thinkingMsg);

    try {
      // Fetch token rates first
      const fromTokenData = await mockApiService.getTokenPrice(fromToken);
      const toTokenData = await mockApiService.getTokenPrice(toToken);

      if (!fromTokenData.success || !toTokenData.success) {
        // Replace thinking with error message
        messages.pop();
        messages.push({
          id: generateId(),
          content: `I couldn't find information for one of the tokens you mentioned. Injective supports INJ, ATOM, ETH, USDT, and other major tokens.`,
          isUser: false,
          timestamp: getCurrentTime()
        });
        return messages;
      }

      // Calculate the estimated swap result (this would come from the API in a real implementation)
      const rate = toTokenData.data.price / fromTokenData.data.price;
      const estimatedAmount = amount * rate * 0.995; // Apply 0.5% slippage

      // Simulate swap preview
      const previewData = {
        from: { token: fromToken.toUpperCase(), amount },
        to: { token: toToken.toUpperCase(), amount: estimatedAmount },
        fee: amount * 0.003, // 0.3% fee
        priceImpact: "0.5%"
      };

      // Remove thinking message
      messages.pop();

      // Add swap preview
      messages.push({
        id: generateId(),
        content: `Here's a preview of your swap from ${fromToken.toUpperCase()} to ${toToken.toUpperCase()}:`,
        isUser: false,
        timestamp: getCurrentTime()
      });

      messages.push({
        id: generateId(),
        display: {
          type: 'swap',
          data: previewData,
          isPreview: true
        },
        isUser: false,
        timestamp: getCurrentTime()
      });

      // Add confirmation message
      messages.push({
        id: generateId(),
        content: "Would you like to proceed with this swap? Type 'yes' to confirm or 'no' to cancel.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    } catch (error) {
      // Replace thinking with error message
      messages.pop();
      messages.push({
        id: generateId(),
        content: "Sorry, there was an error preparing your swap. Please try again later.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    }

    return messages;
  }

  // Process swap confirmation
  async processSwapConfirmation(fromToken, toToken, amount) {
    const messages = [];

    // Add thinking message for transaction processing
    const thinkingMsg = {
      id: generateId(),
      content: getThinkingMessage('transaction'),
      isUser: false,
      timestamp: getCurrentTime(),
      isThinking: true
    };
    messages.push(thinkingMsg);

    try {
      // Execute the swap
      const response = await mockApiService.executeSwap(fromToken, toToken, amount);

      if (response.success) {
        // Remove thinking message
        messages.pop();

        // Add success message
        messages.push({
          id: generateId(),
          content: "Your swap has been completed successfully!",
          isUser: false,
          timestamp: getCurrentTime()
        });

        // Add transaction receipt
        messages.push({
          id: generateId(),
          display: {
            type: 'swap',
            data: response.data,
            isPreview: false
          },
          isUser: false,
          timestamp: getCurrentTime()
        });
      } else {
        // Replace thinking with error message
        messages.pop();
        messages.push({
          id: generateId(),
          content: "There was an error processing your swap. This could be due to insufficient liquidity or a network issue. Please try again.",
          isUser: false,
          timestamp: getCurrentTime()
        });
      }
    } catch (error) {
      // Replace thinking with error message
      messages.pop();
      messages.push({
        id: generateId(),
        content: "Sorry, there was an error executing your swap. Please try again later.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    }

    return messages;
  }

  // Handle liquidity pools request
  async handlePoolsRequest() {
    const messages = [];

    // Add thinking message
    const thinkingMsg = {
      id: generateId(),
      content: getThinkingMessage('pools'),
      isUser: false,
      timestamp: getCurrentTime(),
      isThinking: true
    };
    messages.push(thinkingMsg);

    try {
      // Fetch pool data
      const response = await mockApiService.getLiquidityPools();

      if (response.success) {
        // Remove thinking message
        messages.pop();

        // Format pool information as a text response
        const poolsInfo = response.data.map(pool =>
          `• ${pool.tokenA}-${pool.tokenB}: ${pool.apr}% APR, TVL $${(pool.tvl/1000).toFixed(1)}K`
        ).join('\n');

        messages.push({
          id: generateId(),
          content: `Here are the top liquidity pools on Injective:\n\n${poolsInfo}\n\nWould you like more detailed information about any specific pool?`,
          isUser: false,
          timestamp: getCurrentTime()
        });
      } else {
        // Replace thinking with error message
        messages.pop();
        messages.push({
          id: generateId(),
          content: "I couldn't retrieve liquidity pool data at the moment. Please try again later.",
          isUser: false,
          timestamp: getCurrentTime()
        });
      }
    } catch (error) {
      // Replace thinking with error message
      messages.pop();
      messages.push({
        id: generateId(),
        content: "Sorry, there was an error fetching liquidity pool data. Please try again later.",
        isUser: false,
        timestamp: getCurrentTime()
      });
    }

    return messages;
  }
}

// Create and export a singleton instance
const chatService = new ChatService();
export default chatService;