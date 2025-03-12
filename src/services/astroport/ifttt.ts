import { Action } from '../helix/types';
import { AstroportLiquidityService } from './liquidity';
import { AstroportPoolType, AssetInfo } from './types';

/**
 * Factory for creating Astroport actions for the IFTTT system
 */
export class AstroportActionFactory {
  private liquidityService: AstroportLiquidityService;

  /**
   * Creates a new instance of AstroportActionFactory
   * @param networkType The network type (mainnet or testnet)
   */
  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.liquidityService = new AstroportLiquidityService(networkType);
  }

  /**
   * Creates an action for swapping tokens on Astroport
   * @param description Human-readable description of the swap
   * @param tokenIn Input token info
   * @param tokenOut Output token info
   * @param poolType Pool type to use for the swap
   * @returns An action object compatible with the IFTTT system
   */
  createAstroportSwapAction(
    description: string,
    tokenIn: AssetInfo,
    tokenOut: AssetInfo,
    poolType: AstroportPoolType
  ): Action {
    return {
      description,
      execute: async (parameters: any): Promise<any> => {
        const {
          senderAddress,
          amountIn,
          minAmountOut = "0",
          maxSpread = "0.01" // Default 1% max spread
        } = parameters;

        try {
          // Get pool address for the token pair
          // Note: In a real implementation, we would need to handle creating
          // the asset info objects properly based on token types
          const poolAddress = await this.liquidityService.getPoolAddress(
            tokenIn,
            tokenOut
          );

          // Simulate the swap to get expected return
          const simulation = await this.liquidityService.simulateSwap({
            poolAddress,
            tokenIn,
            amountIn
          });

          console.log(`Simulated swap return: ${simulation.return_amount}`);

          // Check if return amount meets minimum requirements
          if (parseFloat(simulation.return_amount) < parseFloat(minAmountOut)) {
            throw new Error(
              `Insufficient return amount: ${simulation.return_amount} < ${minAmountOut}`
            );
          }

          // In a production implementation, this would execute the actual swap transaction
          // For now, we just log the intent and return a mock response
          console.log(`Would execute swap on pool: ${poolAddress}`);
          console.log(`Input: ${amountIn} of token ${JSON.stringify(tokenIn)}`);
          console.log(`Expected output: ~${simulation.return_amount} of token ${JSON.stringify(tokenOut)}`);

          return {
            success: true,
            txhash: "mock_txhash_" + Date.now(),
            simulatedReturn: simulation.return_amount
          };
        } catch (error) {
          console.error('Error executing Astroport swap action:', error);
          throw error;
        }
      }
    };
  }

  /**
   * Creates a custom Astroport action with a provided execute function
   * @param executeFn Function that executes the action
   * @param description Human-readable description of the action
   * @returns An action object compatible with the IFTTT system
   */
  createCustomAstroportAction(
    executeFn: (params: any) => Promise<any>,
    description: string
  ): Action {
    return {
      execute: executeFn,
      description
    };
  }
}