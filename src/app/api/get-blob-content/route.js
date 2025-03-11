import { NextResponse } from 'next/server';

const WALRUS_AGGREGATOR = process.env.WALRUS_AGGREGATOR || 'https://aggregator.walrus-testnet.walrus.space';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const blobId = searchParams.get('blobId');

    if (!blobId) {
      return NextResponse.json({ error: 'No blob ID provided' }, { status: 400 });
    }

    const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${encodeURIComponent(blobId)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    const content = await response.text();
    return NextResponse.json({ content });

  } catch (error) {
    console.error('Error fetching blob content:', error);
    return NextResponse.json({ error: 'Failed to fetch blob content' }, { status: 500 });
  }
}
