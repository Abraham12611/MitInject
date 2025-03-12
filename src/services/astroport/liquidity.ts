import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { getNetworkConfig } from './config';
import { AstroportTransactionService } from './transaction';
import {
  AstroportPoolType,
  Asset,
  AssetInfo,
  PoolInfo,
  SwapParams,
  SwapSimulationParams,
  SwapSimulationResponse
} from './types';

/**
 * Service for interacting with Astroport liquidity pools
 */
export class AstroportLiquidityService {
  private client: CosmWasmClient | null = null;
  private readonly networkConfig;
  private transactionService: AstroportTransactionService | null = null;

  /**
   * Creates a new instance of AstroportLiquidityService
   * @param networkType The network type (mainnet or testnet)
   */
  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.networkConfig = getNetworkConfig(networkType);
    this.transactionService = new AstroportTransactionService(networkType);
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
   * Initializes the transaction service with the provided mnemonic
   * @param mnemonic The mnemonic phrase for the wallet
   */
  async initTransactionService(mnemonic: string): Promise<void> {
    if (this.transactionService) {
      await this.transactionService.initClient(mnemonic);
    }
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
   * Executes a swap transaction
   * @param params Swap parameters
   * @returns Transaction hash and return amount
   */
  async executeSwap(params: SwapParams): Promise<{
    transactionHash: string;
    returnAmount: string;
  }> {
    if (!this.transactionService) {
      throw new Error('Transaction service not available');
    }

    // Simulate the swap first to ensure it meets requirements
    const simulation = await this.simulateSwap({
      poolAddress: params.poolAddress,
      tokenIn: params.tokenIn,
      amountIn: params.amountIn
    });

    console.log(`Simulated swap return: ${simulation.return_amount}`);

    // Check if return amount meets minimum requirements
    if (parseFloat(simulation.return_amount) < parseFloat(params.minAmountOut)) {
      throw new Error(
        `Insufficient return amount: ${simulation.return_amount} < ${params.minAmountOut}`
      );
    }

    // Execute the swap
    return await this.transactionService.executeSwap(params);
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

  /**
   * Provides liquidity to a pool
   * @param senderAddress The sender's address
   * @param poolAddress The pool contract address
   * @param assets Assets to provide as liquidity
   * @param slippageTolerance Maximum slippage tolerance (e.g. 0.01 for 1%)
   * @returns Transaction hash and LP tokens received
   */
  async provideLiquidity(
    senderAddress: string,
    poolAddress: string,
    assets: {
      info: AssetInfo;
      amount: string;
    }[],
    slippageTolerance: string = '0.01'
  ): Promise<{
    transactionHash: string;
    lpTokensReceived: string;
  }> {
    if (!this.transactionService) {
      throw new Error('Transaction service not available');
    }

    return await this.transactionService.provideLiquidity(
      senderAddress,
      poolAddress,
      assets,
      slippageTolerance
    );
  }

  /**
   * Withdraws liquidity from a pool
   * @param senderAddress The sender's address
   * @param lpTokenAddress The LP token contract address
   * @param amount The amount of LP tokens to withdraw
   * @returns Transaction hash and withdrawn assets
   */
  async withdrawLiquidity(
    senderAddress: string,
    lpTokenAddress: string,
    amount: string
  ): Promise<{
    transactionHash: string;
    withdrawnAssets: {
      info: AssetInfo;
      amount: string;
    }[];
  }> {
    if (!this.transactionService) {
      throw new Error('Transaction service not available');
    }

    return await this.transactionService.withdrawLiquidity(
      senderAddress,
      lpTokenAddress,
      amount
    );
  }
}