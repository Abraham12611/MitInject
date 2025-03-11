export const dynamic = 'force-static';
export const revalidate = 1200; // revalidate every 20 minutes

import { NextResponse } from 'next/server';

const fallbackData = [
  {
    coinMetadata: {
      name: 'Sui',
      symbol: 'SUI'
    },
    coinPrice: '1.23',
    percentagePriceChange24h: '5.67',
    volume24h: '45600000',
    volume1h: '459867'
  },
  {
    coinMetadata: {
      name: 'Cetus',
      symbol: 'CETUS'
    },
    coinPrice: '0.89',
    percentagePriceChange24h: '3.21',
    volume24h: '5546795',
    volume1h: '459867'
  },
  {
    coinMetadata: {
      name: 'Bucket Protocol',
      symbol: 'BUCK'
    },
    coinPrice: '0.99',
    percentagePriceChange24h: '-0.12',
    volume24h: '8900000',
    volume1h: '370833'
  },
  {
    coinMetadata: {
      name: 'USD Coin',
      symbol: 'USDC'
    },
    coinPrice: '1.00',
    percentagePriceChange24h: '0.01',
    volume24h: '234500000',
    volume1h: '9770833'
  }
];

export async function GET() {
  try {
    const response = await fetch('https://api-ex.insidex.trade/coins/trending', {
      headers: {
        'Accept': 'application/json',
        'x-api-key': process.env.INSIDEX_API_KEY,
      },
      next: { revalidate: 1200 } // 20 minutes cache
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    // Format the data and ensure percentages are handled correctly
    const formattedData = data.map(coin => ({
      ...coin,
      volume1h: coin.volume1h.toString(),
      volume24h: coin.volume24h.toString(),
      percentagePriceChange24h: (parseFloat(coin.percentagePriceChange24h) || 0).toString()
    }));
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    // Return fallback data in case of error
    return NextResponse.json(fallbackData);
  }
} 