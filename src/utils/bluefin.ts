import { OnChainCalls, QueryChain, ISwapParams } from "@firefly-exchange/library-sui/dist/src/spot";
import { Ed25519Keypair, toBigNumber, SuiClient } from "@firefly-exchange/library-sui";
import { mainnet } from './config';

const client = new SuiClient({ url: "https://fullnode.mainnet.sui.io:443" });

// src/utils/bluefin.ts
export function parsePrivateKey(input: string): Uint8Array {
  if (input.startsWith('suiprivkey1')) {
    const base64Part = input.split('suiprivkey1')[1];
    const keyBytes = Buffer.from(base64Part, 'base64');
    return new Uint8Array(keyBytes.subarray(1, 33));
  }
  return new Uint8Array(Buffer.from(input.replace(/^0x/, ''), 'hex'));
}

export const getPoolInfo = async (poolId: string) => {
  const qc = new QueryChain(client);
  return qc.getPool(poolId);
};

export const executeBluefinSwap = async (
  privateKey: string,
  poolId: string,
  amount: number,
  aToB: boolean,
  byAmountIn: boolean = true,
  slippage: number = 0.1
) => {
  try {
    // Create keypair from private key using the new parsing function
    const parsedKey = parsePrivateKey(privateKey);
    console.log('Final parsed key length:', parsedKey.length);
    console.log('Final key bytes:', parsedKey);

    // Create keypair and show address
    const keyPair = Ed25519Keypair.fromSecretKey(parsedKey);
    console.log('Generated address:', keyPair.getPublicKey().toSuiAddress());

    // Initialize clients
    const oc = new OnChainCalls(client, mainnet, { signer: keyPair });
    const qc = new QueryChain(client);

    // Get pool state
    const poolState = await qc.getPool(poolId);

    // Prepare swap parameters
    const swapParams: ISwapParams = {
      pool: poolState,
      amountIn: byAmountIn == true ? toBigNumber(amount, (aToB == true ? poolState.coin_a.decimals : poolState.coin_b.decimals)) : 0,
      amountOut: byAmountIn == true ? 0 : toBigNumber(amount, (aToB == true ? poolState.coin_b.decimals : poolState.coin_a.decimals)),
      aToB,
      byAmountIn,
      slippage
    };

    // Execute swap
    const response = await oc.swapAssets(swapParams);
    return response;
  } catch (error) {
    console.error('Swap failed:', error);
    throw error;
  }
};

export async function swapBlueFin(privateKey: string, poolID: string, amount: number, aToB: boolean, byAmountIn: boolean, slippage: number) {
  const keyPair = Ed25519Keypair.fromSecretKey(privateKey);

  let oc = new OnChainCalls(client, mainnet, { signer: keyPair });
  let qc = new QueryChain(client);

  let poolState = await qc.getPool(poolID);

  let iSwapParams: ISwapParams = {
    pool: poolState,
    amountIn: byAmountIn == true ? toBigNumber(amount, (aToB == true ? poolState.coin_a.decimals : poolState.coin_b.decimals)) : 0,
    amountOut: byAmountIn == true ? 0 : toBigNumber(amount, (aToB == true ? poolState.coin_b.decimals : poolState.coin_a.decimals)),
    aToB: aToB,
    byAmountIn: byAmountIn,
    slippage: slippage
  }

  let resp = await oc.swapAssets(iSwapParams);
  console.log(resp);
  return resp
}

//e1b45a0e641b9955a20aa0ad1c1f4ad86aad8afb07296d4085e349a50e90bdca: SUI/USDC
// 0x0bd95d012d60190a6713ae51f2d833b24ae70c5fb07fcfb41db40f25549878b1 : USDT/USDC,
//0xe1b45a0e641b9955a20aa0ad1c1f4ad86aad8afb07296d4085e349a50e90bdca
// 0.1 = 0.1 USDT in
swapBlueFin('xxx', '0x0bd95d012d60190a6713ae51f2d833b24ae70c5fb07fcfb41db40f25549878b1', 0.1, true, true, 0.1)
