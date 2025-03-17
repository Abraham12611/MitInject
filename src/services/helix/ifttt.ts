import { TxResponse } from '@injectivelabs/sdk-ts'
import { Condition, Action } from './types'
import { HelixMarketService } from './market'
import { HelixTradingService } from './trading'

/**
 * Represents a rule in the If-This-Then-That system
 * that triggers an action when a condition is met
 */
export class IftttRule {
  private condition: Condition
  private action: Action
  private params: any

  /**
   * Creates a new IFTTT rule
   * @param condition The condition to check
   * @param action The action to execute when condition is met
   * @param params Parameters for the action
   */
  constructor(condition: Condition, action: Action, params: any) {
    this.condition = condition
    this.action = action
    this.params = params
  }

  /**
   * Evaluates the condition and executes the action if condition is met
   * @returns The result of the action execution or null if condition not met
   */
  async evaluate(): Promise<any> {
    try {
      const conditionMet = await this.condition.checkCondition()

      if (conditionMet) {
        console.log(`Condition met: ${this.condition.description}`)
        console.log(`Executing action: ${this.action.description}`)
        return await this.action.execute(this.params)
      } else {
        console.log(`Condition not met: ${this.condition.description}`)
        return null
      }
    } catch (error) {
      console.error('Error evaluating IFTTT rule:', error)
      throw error
    }
  }
}

/**
 * Helper class to create common conditions for trading strategies
 */
export class ConditionFactory {
  private marketService: HelixMarketService

  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.marketService = new HelixMarketService(networkType)
  }

  /**
   * Creates a condition that checks if a token's price is above a threshold
   * @param marketId The market ID to check price for
   * @param threshold The price threshold to compare against
   * @returns A condition object
   */
  createPriceAboveCondition(marketId: string, threshold: string): Condition {
    return {
      checkCondition: async (): Promise<boolean> => {
        const currentPrice = await this.marketService.getLastPrice(marketId)
        return parseFloat(currentPrice) > parseFloat(threshold)
      },
      description: `Price is above ${threshold}`
    }
  }

  /**
   * Creates a condition that checks if a token's price is below a threshold
   * @param marketId The market ID to check price for
   * @param threshold The price threshold to compare against
   * @returns A condition object
   */
  createPriceBelowCondition(marketId: string, threshold: string): Condition {
    return {
      checkCondition: async (): Promise<boolean> => {
        const currentPrice = await this.marketService.getLastPrice(marketId)
        return parseFloat(currentPrice) < parseFloat(threshold)
      },
      description: `Price is below ${threshold}`
    }
  }

  /**
   * Creates a custom condition with a provided check function
   * @param checkFn Function that returns a boolean indicating if condition is met
   * @param description Human-readable description of the condition
   * @returns A condition object
   */
  createCustomCondition(
    checkFn: () => Promise<boolean>,
    description: string
  ): Condition {
    return {
      checkCondition: checkFn,
      description
    }
  }
}

/**
 * Helper class to create common actions for trading strategies
 */
export class ActionFactory {
  private tradingService: HelixTradingService

  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    this.tradingService = new HelixTradingService(networkType)
  }

  /**
   * Creates an action that executes a swap between tokens
   * @param description Human-readable description of the swap
   * @returns An action object
   */
  createSwapAction(description: string): Action {
    return {
      execute: async (params): Promise<TxResponse> => {
        return this.tradingService.createSpotMarketOrder(params)
      },
      description
    }
  }

  /**
   * Creates an action that executes a limit order
   * @param description Human-readable description of the limit order
   * @returns An action object
   */
  createLimitOrderAction(description: string): Action {
    return {
      execute: async (params): Promise<TxResponse> => {
        return this.tradingService.createLimitOrder(params)
      },
      description
    }
  }

  /**
   * Creates a custom action with a provided execute function
   * @param executeFn Function that executes the action
   * @param description Human-readable description of the action
   * @returns An action object
   */
  createCustomAction(
    executeFn: (params: any) => Promise<any>,
    description: string
  ): Action {
    return {
      execute: executeFn,
      description
    }
  }
}