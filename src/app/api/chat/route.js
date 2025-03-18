import { NextResponse } from 'next/server';
import mitsuiCharacter from '@/characters/mitsui.character.json';
import mockApiService from '@/services/MockApiService';

// Helper function to detect intent
function detectIntent(message) {
  const lowerMessage = message.toLowerCase();

  // Check for price request
  if (lowerMessage.includes('price') && lowerMessage.includes('inj')) {
    return { type: 'price', token: 'INJ' };
  }

  // Check for portfolio request
  if (lowerMessage.includes('portfolio') || lowerMessage.includes('my holdings')) {
    return { type: 'portfolio' };
  }

  // Check for swap request
  const swapMatch = message.match(/swap (\d+\.?\d*) (\w+) (to|for) (\w+)/i);
  if (swapMatch) {
    return {
      type: 'swap',
      amount: parseFloat(swapMatch[1]),
      fromToken: swapMatch[2].toUpperCase(),
      toToken: swapMatch[4].toUpperCase()
    };
  }

  // Default to conversation
  return { type: 'conversation' };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message;
    const intent = detectIntent(message);

    switch (intent.type) {
      case 'price': {
        const response = await mockApiService.getTokenPrice(intent.token);
        if (response.success) {
          return NextResponse.json({
            choices: [{
              message: {
                role: "assistant",
                content: `Here's the current price information for ${response.data.name} (${response.data.symbol}):\n\nPrice: $${response.data.price}\n24h Change: ${response.data.change24h}%\n24h Volume: $${response.data.volume24h}\nMarket Cap: $${response.data.marketCap}`
              }
            }]
          });
        }
        break;
      }

      case 'portfolio': {
        const response = await mockApiService.getUserPortfolio();
        if (response.success) {
          const portfolioText = response.data.holdings
            .map(h => `${h.token}: ${h.amount} ($${h.valueUsd})`)
            .join('\n');
          return NextResponse.json({
            choices: [{
              message: {
                role: "assistant",
                content: `Here's your current portfolio:\n\n${portfolioText}\n\nTotal Value: $${response.data.totalValueUsd}`
              }
            }]
          });
        }
        break;
      }

      case 'swap': {
        const response = await mockApiService.getSwapPreview(
          intent.fromToken,
          intent.toToken,
          intent.amount
        );
        if (response.success) {
          return NextResponse.json({
            choices: [{
              message: {
                role: "assistant",
                content: `Here's the swap preview:\n\nFrom: ${intent.amount} ${intent.fromToken}\nTo: ${response.data.toAmount} ${intent.toToken}\nPrice Impact: ${response.data.priceImpact}%\nFee: $${response.data.fee}\n\nWould you like to proceed with this swap?`
              }
            }]
          });
        }
        break;
      }
    }

    // Default response for unknown intents or failed API calls
    return NextResponse.json({
      choices: [{
        message: {
          role: "assistant",
          content: mitsuiCharacter.defaultResponse || "I'm here to help you with trading, portfolio management, and market analysis. What would you like to know?"
        }
      }]
    });

  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      {
        choices: [{
          message: {
            role: "assistant",
            content: "I apologize, but I encountered an error processing your request. Could you try again?"
          }
        }]
      },
      { status: 200 }
    );
  }
}