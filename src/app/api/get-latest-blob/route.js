import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const transactionsPath = path.join(process.cwd(), 'data/analysis/walrus-transactions.json');
    const transactions = JSON.parse(fs.readFileSync(transactionsPath, 'utf8'));
    
    // Sort by timestamp and get the latest
    const sortedTransactions = transactions.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    return NextResponse.json({ blobId: sortedTransactions[0]?.blobId || null });
  } catch (error) {
    console.error('Error fetching latest blob ID:', error);
    return NextResponse.json({ error: 'Could not fetch latest blob ID' }, { status: 500 });
  }
}
