import { NextResponse } from 'next/server';
import mitsuiCharacter from '@/characters/mitsui.character.json';

const WALRUS_AGGREGATOR = process.env.WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space';

async function fetchBlobContent(blobId) {
  try {
    console.log('Fetching blob content for:', blobId);
    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${encodeURIComponent(blobId)}`);
    if (!response.ok) throw new Error(`Failed to fetch blob: ${response.statusText}`);
    const content = await response.text();
    console.log('Got blob content:', content.substring(0, 100) + '...');
    return content;
  } catch (error) {
    console.error('Error fetching blob content:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message;

    const messages = [{
      role: "system",
      content: mitsuiCharacter.system
    }, {
      role: "user",
      content: message
    }];

    // Check if this is a /market command with blob ID
    const marketCommand = message.match(/^\/market\s+([^\s]+)/);
    if (marketCommand) {
      console.log('Handling /market command');
      const blobId = marketCommand[1];
      console.log('Extracted blob ID:', blobId);
      const analysis = await fetchBlobContent(blobId);
      
      if (!analysis) {
        console.log('Failed to fetch analysis');
        return NextResponse.json({
          choices: [{
            message: {
              role: "assistant",
              content: "Sorry, I couldn't fetch the market analysis. Please try again later."
            }
          }]
        });
      }

      // Return the analysis as plain text
      return NextResponse.json({
        choices: [{
          message: {
            role: "assistant",
            content: "```\n" + analysis + "\n```"
          }
        }]
      });
    }
    
    console.log('Handling regular chat message');
    // Handle regular chat messages
    const response = await fetch('https://api.atoma.network/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.ATOMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stream: false,
        model: "deepseek-ai/DeepSeek-R1",
        messages,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}