import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getNetworkConfig } from './config';
import {
  AstroportPoolType,
  Asset,
  AssetInfo,
  PoolInfo,
  SwapSimulationParams,
  SwapSimulationResponse
} from './types';

/**
 * Service for interacting with Astroport liquidity pools
 */
export class AstroportLiquidityService {
  private client: CosmWasmClient | null = null;
  private readonly networkConfig;

  /**
   * Creates a new instance of AstroportLiquidityService
   * @param networkType The network type (mainnet or testnet)
   */
  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.networkConfig = getNetworkConfig(networkType);
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
   * Gets the pool address for a token pair
   * @param tokenA First token info
   * @param tokenB Second token info
   * @returns The pool contract address
   */
  async getPoolAddress(
    tokenA: AssetInfo,
    tokenB: AssetInfo
  ): Promise<string> {
    try {
      const client = await this.getClient();
      const queryMsg = {
        pair: {
          asset_infos: [tokenA, tokenB]
        }
      };

      const result = await client.queryContractSmart(
        this.networkConfig.factoryContract,
        queryMsg
      );

      return result.contract_addr;
    } catch (error) {
      console.error('Error getting pool address:', error);
      throw error;
    }
  }

  /**
   * Gets pool information
   * @param poolAddress The pool contract address
   * @returns Pool information including reserves and fees
   */
  async getPoolInfo(poolAddress: string): Promise<PoolInfo> {
    try {
      const client = await this.getClient();
      const queryMsg = { pool: {} };

      return await client.queryContractSmart(poolAddress, queryMsg);
    } catch (error) {
      console.error('Error getting pool info:', error);
      throw error;
    }
  }

  /**
   * Simulates a swap to calculate expected return amount
   * @param params Swap simulation parameters
   * @returns Simulation results including return amount
   */
  async simulateSwap(
    params: SwapSimulationParams
  ): Promise<SwapSimulationResponse> {
    try {
      const client = await this.getClient();
      const queryMsg = {
        simulation: {
          offer_asset: {
            info: params.tokenIn,
            amount: params.amountIn
          }
        }
      };

      return await client.queryContractSmart(params.poolAddress, queryMsg);
    } catch (error) {
      console.error('Error simulating swap:', error);
      throw error;
    }
  }

  /**
   * Gets the LP token address for a pool
   * @param poolAddress The pool contract address
   * @returns The LP token contract address
   */
  async getLpTokenAddress(poolAddress: string): Promise<string> {
    try {
      const client = await this.getClient();
      const queryMsg = { pair_info: {} };

      const result = await client.queryContractSmart(poolAddress, queryMsg);
      return result.liquidity_token;
    } catch (error) {
      console.error('Error getting LP token address:', error);
      throw error;
    }
  }

  /**
   * Gets an LP token balance for a user
   * @param lpTokenAddress The LP token contract address
   * @param userAddress The user's address
   * @returns The LP token balance
   */
  async getLpTokenBalance(
    lpTokenAddress: string,
    userAddress: string
  ): Promise<string> {
    try {
      const client = await this.getClient();
      const queryMsg = {
        balance: {
          address: userAddress
        }
      };

      const result = await client.queryContractSmart(lpTokenAddress, queryMsg);
      return result.balance;
    } catch (error) {
      console.error('Error getting LP token balance:', error);
      throw error;
    }
  }
}