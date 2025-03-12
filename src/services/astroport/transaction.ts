import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { getNetworkConfig } from './config';
import { SwapParams } from './types';

/**
 * Service for transaction execution with Astroport contracts
 */
export class AstroportTransactionService {
  private client: SigningCosmWasmClient | null = null;
  private wallet: DirectSecp256k1HdWallet | null = null;
  private readonly networkConfig;
  private readonly gasPrice = GasPrice.fromString('0.025inj');

  /**
   * Creates a new instance of AstroportTransactionService
   * @param networkType The network type (mainnet or testnet)
   */
  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.networkConfig = getNetworkConfig(networkType);
  }

  /**
   * Initializes the signing client with the provided mnemonic
   * @param mnemonic The mnemonic phrase for the wallet
   * @returns The initialized client
   */
  async initClient(mnemonic: string): Promise<SigningCosmWasmClient> {
    if (!this.client) {
      // Create a wallet from mnemonic
      this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
        prefix: 'inj' // Injective address prefix
      });

      // Create a signing client
      this.client = await SigningCosmWasmClient.connectWithSigner(
        this.networkConfig.rpcEndpoint,
        this.wallet,
        { gasPrice: this.gasPrice }
      );
    }
    return this.client;
  }

  /**
   * Gets the wallet address from the initialized wallet
   * @returns The wallet's first address
   */
  async getAddress(): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not initialized. Call initClient first.');
    }
    const accounts = await this.wallet.getAccounts();
    return accounts[0].address;
  }

  /**
   * Executes a swap transaction on an Astroport pool
   * @param params Swap parameters
   * @returns Transaction hash and result
   */
  async executeSwap(params: SwapParams): Promise<{
    transactionHash: string;
    returnAmount: string;
  }> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initClient first.');
    }

    try {
      // Prepare the swap message
      const swapMsg = {
        swap: {
          offer_asset: {
            info: params.tokenIn,
            amount: params.amountIn
          },
          belief_price: params.beliefPrice || null,
          max_spread: params.maxSpread || '0.01', // Default 1% max spread
          to: params.senderAddress // Optional - if different from sender
        }
      };

      // Need to handle native token transfers for the swap
      const funds = [];
      if (params.tokenIn.native_token) {
        funds.push({
          denom: params.tokenIn.native_token.denom,
          amount: params.amountIn
        });
      }

      // Execute the contract call
      const result = await this.client.execute(
        params.senderAddress,
        params.poolAddress,
        swapMsg,
        'auto',
        'Astroport Swap',
        funds
      );

      // Parse the logs to get the return amount
      // In a real implementation, we would need to parse the event attributes
      // This is simplified for the basic integration
      const returnAmount = this.parseReturnAmountFromLogs(result.logs);

      return {
        transactionHash: result.transactionHash,
        returnAmount
      };
    } catch (error) {
      console.error('Error executing swap transaction:', error);
      throw error;
    }
  }

  /**
   * Parses return amount from transaction logs
   * @param logs Transaction logs
   * @returns Extracted return amount
   */
  private parseReturnAmountFromLogs(logs: any[]): string {
    try {
      // In a real implementation, we would parse the wasm event logs
      // to find the return amount from the swap operation
      // This is a placeholder implementation
      for (const log of logs) {
        for (const event of log.events) {
          if (event.type === 'wasm') {
            for (const attribute of event.attributes) {
              if (attribute.key === 'return_amount') {
                return attribute.value;
              }
            }
          }
        }
      }
      return '0';
    } catch (error) {
      console.error('Error parsing return amount from logs:', error);
      return '0';
    }
  }

  /**
   * Provides liquidity to an Astroport pool
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
      info: any;
      amount: string;
    }[],
    slippageTolerance: string = '0.01'
  ): Promise<{
    transactionHash: string;
    lpTokensReceived: string;
  }> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initClient first.');
    }

    try {
      // Prepare the provide liquidity message
      const provideLiquidityMsg = {
        provide_liquidity: {
          assets,
          slippage_tolerance: slippageTolerance,
          auto_stake: false, // Don't auto-stake LP tokens
          receiver: senderAddress // Optional - receiver of LP tokens
        }
      };

      // Need to handle native token transfers for liquidity provision
      const funds = [];
      for (const asset of assets) {
        if (asset.info.native_token) {
          funds.push({
            denom: asset.info.native_token.denom,
            amount: asset.amount
          });
        }
      }

      // Execute the contract call
      const result = await this.client.execute(
        senderAddress,
        poolAddress,
        provideLiquidityMsg,
        'auto',
        'Astroport Provide Liquidity',
        funds
      );

      // Parse the logs to get the LP tokens received
      // In a real implementation, we would need to parse the event attributes
      // This is simplified for the basic integration
      const lpTokensReceived = this.parseLpTokensFromLogs(result.logs);

      return {
        transactionHash: result.transactionHash,
        lpTokensReceived
      };
    } catch (error) {
      console.error('Error providing liquidity:', error);
      throw error;
    }
  }

  /**
   * Parses LP tokens received from transaction logs
   * @param logs Transaction logs
   * @returns Extracted LP tokens amount
   */
  private parseLpTokensFromLogs(logs: any[]): string {
    try {
      // In a real implementation, we would parse the wasm event logs
      // to find the share (LP tokens) amount from the provide_liquidity operation
      // This is a placeholder implementation
      for (const log of logs) {
        for (const event of log.events) {
          if (event.type === 'wasm') {
            for (const attribute of event.attributes) {
              if (attribute.key === 'share') {
                return attribute.value;
              }
            }
          }
        }
      }
      return '0';
    } catch (error) {
      console.error('Error parsing LP tokens from logs:', error);
      return '0';
    }
  }

  /**
   * Withdraws liquidity from an Astroport pool
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
      info: any;
      amount: string;
    }[];
  }> {
    if (!this.client) {
      throw new Error('Client not initialized. Call initClient first.');
    }

    try {
      // Prepare the withdraw liquidity message
      const withdrawLiquidityMsg = {
        send: {
          contract: lpTokenAddress,
          amount,
          msg: Buffer.from(JSON.stringify({ withdraw_liquidity: {} })).toString('base64')
        }
      };

      // Execute the contract call
      const result = await this.client.execute(
        senderAddress,
        lpTokenAddress,
        withdrawLiquidityMsg,
        'auto',
        'Astroport Withdraw Liquidity'
      );

      // Parse the logs to get the withdrawn assets
      // In a real implementation, we would need to parse the event attributes
      // This is simplified for the basic integration
      const withdrawnAssets = this.parseWithdrawnAssetsFromLogs(result.logs);

      return {
        transactionHash: result.transactionHash,
        withdrawnAssets
      };
    } catch (error) {
      console.error('Error withdrawing liquidity:', error);
      throw error;
    }
  }

  /**
   * Parses withdrawn assets from transaction logs
   * @param logs Transaction logs
   * @returns Extracted withdrawn assets
   */
  private parseWithdrawnAssetsFromLogs(logs: any[]): {info: any; amount: string}[] {
    try {
      // In a real implementation, we would parse the wasm event logs
      // to find the refunded assets from the withdraw_liquidity operation
      // This is a placeholder implementation
      const withdrawnAssets = [];

      // This is just example code, in reality we would need to properly parse the logs
      withdrawnAssets.push({
        info: { native_token: { denom: 'inj' } },
        amount: '0'
      });
      withdrawnAssets.push({
        info: { native_token: { denom: 'usdt' } },
        amount: '0'
      });

      return withdrawnAssets;
    } catch (error) {
      console.error('Error parsing withdrawn assets from logs:', error);
      return [];
    }
  }
}