// import { SuiClient } from '@mysten/sui/client';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

let lastTotal: number | null = null;
let lastTimestamp: number | null = null;

// Create a single client instance
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

export async function getSuiTPS() {
  try {
    // const client = new SuiClient({ url: process.env.SUI_RPC_URL });
    const currentTimestamp = Date.now();
    const totalTx = Number(await client.getTotalTransactionBlocks());

    if (lastTotal && lastTimestamp) {
      const txDiff = totalTx - lastTotal;
      const timeDiff = (currentTimestamp - lastTimestamp) / 1000; // Convert to seconds
      const tps = Math.round(txDiff / timeDiff);

      // Update values for next calculation
      lastTotal = totalTx;
      lastTimestamp = currentTimestamp;

      console.log('Sui TPS:', tps);
      return tps;
    }

    // First call - store values and return null
    lastTotal = totalTx;
    lastTimestamp = currentTimestamp;
    return null;
  } catch (error) {
    console.error('Error calculating Sui TPS:', error);
    return null;
  }
}

export async function getSuiMetrics() {
  try {
    const checkpoint = await client.getLatestCheckpointSequenceNumber();
    const referenceGasPrice = await client.getReferenceGasPrice();

    const metrics = {
      checkpoint: checkpoint.toString(),
      gasPrice: (Number(referenceGasPrice) / 1_000_000_000).toFixed(9)
    };

    console.log('Sui metrics:', metrics); // Debug log
    return metrics;
  } catch (error) {
    console.error('Error getting Sui metrics:', error);
    return null;
  }
} 