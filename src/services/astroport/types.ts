/**
 * Types for Astroport integration
 */

/**
 * Defines the different types of liquidity pools available in Astroport
 */
export enum AstroportPoolType {
  ConstantProduct = 'constant_product',
  Stableswap = 'stableswap',
  PassiveConcentratedLiquidity = 'concentrated'
}

/**
 * Information about a token asset
 */
export interface AssetInfo {
  native_token?: {
    denom: string;
  };
  token?: {
    contract_addr: string;
  };
}

/**
 * A token asset with its amount
 */
export interface Asset {
  info: AssetInfo;
  amount: string;
}

/**
 * Represents the details of a liquidity pool
 */
export interface PoolInfo {
  assets: Asset[];
  total_share: string;
  pool_type: AstroportPoolType;
  fees: {
    lp_fee: string;  // Fee going to LPs
    protocol_fee: string; // Fee going to protocol
    total_fee: string; // Total fee percentage
  };
}

/**
 * Parameters for swap simulation
 */
export interface SwapSimulationParams {
  poolAddress: string;
  tokenIn: AssetInfo;
  amountIn: string;
}

/**
 * Response from swap simulation
 */
export interface SwapSimulationResponse {
  return_amount: string;
  spread_amount: string;
  commission_amount: string;
}

/**
 * Parameters for executing a swap
 */
export interface SwapParams {
  senderAddress: string;
  poolAddress: string;
  tokenIn: AssetInfo;
  amountIn: string;
  minAmountOut: string;
  maxSpread?: string;
  beliefPrice?: string;
}

/**
 * Information about a liquidity position
 */
export interface LiquidityPosition {
  poolAddress: string;
  lpTokenAddress: string;
  lpTokenBalance: string;
  poolShare: string;
  tokenAAmount: string;
  tokenBAmount: string;
  dollarValue: string;
  poolType: AstroportPoolType;
}

/**
 * Pool APR information
 */
export interface PoolApr {
  feeApr: string;
  incentiveApr: string;
  totalApr: string;
}

/**
 * Network configuration for Astroport
 */
export interface AstroportNetworkConfig {
  network: string;
  factoryContract: string;
  rpcEndpoint: string;
  chainId: string;
}