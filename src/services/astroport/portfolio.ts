import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getNetworkConfig } from './config';
import { AstroportLiquidityService } from './liquidity';
import {
  AstroportPoolType,
  LiquidityPosition,
  PoolApr,
  PoolInfo
} from './types';

/**
 * Service for managing Astroport portfolio and positions
 */
export class AstroportPortfolioService {
  private client: CosmWasmClient | null = null;
  private readonly networkConfig;
  private liquidityService: AstroportLiquidityService;

  /**
   * Creates a new instance of AstroportPortfolioService
   * @param networkType The network type (mainnet or testnet)
   */
  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.networkConfig = getNetworkConfig(networkType);
    this.liquidityService = new AstroportLiquidityService(networkType);
  }

  /**
   * Initializes the CosmWasm client
   * @returns The initialized client
   */
  private async getClient(): Promise<CosmWasmClient> {
    if (!this.client) {
      this.client = await CosmWasmClient.connect(this.networkConfig.rpcEndpoint);
    }
    return this.client;
  }

  /**
   * Gets all liquidity positions for a user
   * @param userAddress The user's address
   * @param knownPools Array of known pools to check
   * @returns Array of liquidity positions
   */
  async getUserLiquidityPositions(
    userAddress: string,
    knownPools: Array<{
      lpTokenAddress: string,
      poolAddress: string,
      poolType: AstroportPoolType
    }>
  ): Promise<LiquidityPosition[]> {
    try {
      const positions: LiquidityPosition[] = [];

      for (const pool of knownPools) {
        // Get LP token balance
        const balance = await this.liquidityService.getLpTokenBalance(
          pool.lpTokenAddress,
          userAddress
        );

        // If user has LP tokens in this pool
        if (balance !== "0") {
          // Get pool info
          const poolInfo = await this.liquidityService.getPoolInfo(pool.poolAddress);

          // Calculate user's share of the pool
          const totalLpSupply = poolInfo.total_share;
          const poolShare = parseFloat(balance) / parseFloat(totalLpSupply);

          // Calculate token amounts based on share
          const tokenAAmount = (parseFloat(poolInfo.assets[0].amount) * poolShare).toString();
          const tokenBAmount = (parseFloat(poolInfo.assets[1].amount) * poolShare).toString();

          // In a real implementation, we would calculate the USD value based on token prices
          // This is simplified for the basic integration
          const dollarValue = "0";

          positions.push({
            poolAddress: pool.poolAddress,
            lpTokenAddress: pool.lpTokenAddress,
            lpTokenBalance: balance,
            poolShare: poolShare.toString(),
            tokenAAmount,
            tokenBAmount,
            dollarValue,
            poolType: pool.poolType
          });
        }
      }

      return positions;
    } catch (error) {
      console.error('Error getting user liquidity positions:', error);
      throw error;
    }
  }

  /**
   * Calculates impermanent loss for a position
   * @param initialTokenAPrice Initial price of token A
   * @param initialTokenBPrice Initial price of token B
   * @param currentTokenAPrice Current price of token A
   * @param currentTokenBPrice Current price of token B
   * @param poolType Type of the pool
   * @returns Calculated impermanent loss as a string
   */
  calculateImpermanentLoss(
    initialTokenAPrice: string,
    initialTokenBPrice: string,
    currentTokenAPrice: string,
    currentTokenBPrice: string,
    poolType: AstroportPoolType
  ): string {
    // Different formulas based on pool type
    if (poolType === AstroportPoolType.ConstantProduct) {
      // Standard IL calculation for constant product pools
      const priceRatio = parseFloat(currentTokenAPrice) / parseFloat(initialTokenAPrice) /
                       (parseFloat(currentTokenBPrice) / parseFloat(initialTokenBPrice));

      const sqrtPriceRatio = Math.sqrt(priceRatio);
      const impermanentLoss = 2 * sqrtPriceRatio / (1 + priceRatio) - 1;

      return impermanentLoss.toString();
    } else if (poolType === AstroportPoolType.Stableswap) {
      // Stableswap pools have reduced IL - this is simplified
      // In a real implementation, this would be more complex
      return "0.001";
    } else if (poolType === AstroportPoolType.PassiveConcentratedLiquidity) {
      // PCL pools IL calculation is more complex
      // This is a placeholder
      return "0.005";
    }

    return "0";
  }

  /**
   * Estimates APR for a pool
   * @param poolInfo Pool information object
   * @param dailyVolumeUsd Daily trading volume in USD
   * @param astroRewardsPerDay ASTRO rewards distributed per day
   * @param astroPrice Current ASTRO token price
   * @param poolLiquidityUsd Total pool liquidity in USD
   * @returns Pool APR breakdown
   */
  estimatePoolApr(
    poolInfo: PoolInfo,
    dailyVolumeUsd: string,
    astroRewardsPerDay: string,
    astroPrice: string,
    poolLiquidityUsd: string
  ): PoolApr {
    // Calculate fee APR
    const feePercentage = poolInfo.fees.total_fee;
    const dailyFeeUsd = parseFloat(dailyVolumeUsd) * parseFloat(feePercentage);
    const feeApr = (dailyFeeUsd * 365 / parseFloat(poolLiquidityUsd)).toString();

    // Calculate incentive APR from ASTRO rewards
    const astroRewardsUsd = parseFloat(astroRewardsPerDay) * parseFloat(astroPrice);
    const incentiveApr = (astroRewardsUsd * 365 / parseFloat(poolLiquidityUsd)).toString();

    // Calculate total APR
    const totalApr = (parseFloat(feeApr) + parseFloat(incentiveApr)).toString();

    return {
      feeApr,
      incentiveApr,
      totalApr
    };
  }
}