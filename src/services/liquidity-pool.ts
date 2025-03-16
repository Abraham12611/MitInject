import {
  ChainGrpcWasmApi,
  IndexerGrpcSpotApi,
  SpotMarket,
  SpotOrderSide,
  SpotOrderType,
  BigNumberInBase
} from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'
import { walletStrategy } from '@/utils/injective-wallet'

export interface PoolPosition {
  poolId: string
  token0Amount: string
  token1Amount: string
  token0Symbol: string
  token1Symbol: string
  shareOfPool: string
  apr: string
  rewards: string[]
}

export interface PoolMetrics {
  totalLiquidity: string
  volume24h: string
  fees24h: string
  apy: string
  impermanentLoss: string
}

class LiquidityPoolService {
  private wasmApi: ChainGrpcWasmApi
  private spotApi: IndexerGrpcSpotApi

  constructor(network: Network = Network.TestnetK8s) {
    const CHAIN_API = process.env.NEXT_PUBLIC_INJECTIVE_RPC!
    const INDEXER_API = process.env.NEXT_PUBLIC_INJECTIVE_INDEXER!

    this.wasmApi = new ChainGrpcWasmApi(CHAIN_API)
    this.spotApi = new IndexerGrpcSpotApi(INDEXER_API)
  }

  async getPoolMetrics(poolId: string): Promise<PoolMetrics> {
    try {
      const pool = await this.wasmApi.fetchSmartContractState(
        poolId,
        Buffer.from('pool_info').toString('base64')
      )

      const { totalLiquidity, volume24h, fees24h } = JSON.parse(pool.data)

      // Calculate APY based on fees and volume
      const apy = this.calculateAPY(totalLiquidity, fees24h)

      // Calculate impermanent loss based on price changes
      const impermanentLoss = await this.calculateImpermanentLoss(poolId)

      return {
        totalLiquidity,
        volume24h,
        fees24h,
        apy,
        impermanentLoss
      }
    } catch (error) {
      console.error('Failed to fetch pool metrics:', error)
      throw error
    }
  }

  async getUserPoolPositions(address: string): Promise<PoolPosition[]> {
    try {
      const positions = await this.wasmApi.fetchSmartContractState(
        address,
        Buffer.from('user_positions').toString('base64')
      )

      return JSON.parse(positions.data).map((pos: any) => ({
        poolId: pos.pool_id,
        token0Amount: pos.token0_amount,
        token1Amount: pos.token1_amount,
        token0Symbol: pos.token0_symbol,
        token1Symbol: pos.token1_symbol,
        shareOfPool: pos.share_of_pool,
        apr: pos.apr,
        rewards: pos.rewards || []
      }))
    } catch (error) {
      console.error('Failed to fetch user positions:', error)
      throw error
    }
  }

  async addLiquidity(
    poolId: string,
    token0Amount: string,
    token1Amount: string,
    slippageTolerance: number
  ) {
    try {
      const address = await walletStrategy.getAddresses()

      // Create add liquidity message
      const msg = {
        add_liquidity: {
          token0_amount: token0Amount,
          token1_amount: token1Amount,
          min_shares: this.calculateMinShares(token0Amount, token1Amount, slippageTolerance)
        }
      }

      // Execute contract
      const response = await this.wasmApi.executeContract(
        address[0],
        poolId,
        msg,
        { amount: token0Amount, denom: 'inj' }
      )

      return response
    } catch (error) {
      console.error('Failed to add liquidity:', error)
      throw error
    }
  }

  async removeLiquidity(
    poolId: string,
    shareAmount: string,
    minToken0: string,
    minToken1: string
  ) {
    try {
      const address = await walletStrategy.getAddresses()

      // Create remove liquidity message
      const msg = {
        remove_liquidity: {
          share_amount: shareAmount,
          min_token0: minToken0,
          min_token1: minToken1
        }
      }

      // Execute contract
      const response = await this.wasmApi.executeContract(
        address[0],
        poolId,
        msg
      )

      return response
    } catch (error) {
      console.error('Failed to remove liquidity:', error)
      throw error
    }
  }

  private calculateAPY(totalLiquidity: string, fees24h: string): string {
    const annualFees = new BigNumberInBase(fees24h).times(365)
    const apy = annualFees.div(new BigNumberInBase(totalLiquidity)).times(100)
    return apy.toString()
  }

  private async calculateImpermanentLoss(poolId: string): Promise<string> {
    try {
      // Get initial and current prices
      const pool = await this.wasmApi.fetchSmartContractState(
        poolId,
        Buffer.from('pool_info').toString('base64')
      )

      const { initialPrice, currentPrice } = JSON.parse(pool.data)

      // Calculate IL using standard formula
      const priceRatio = new BigNumberInBase(currentPrice)
        .div(new BigNumberInBase(initialPrice))

      const sqrtPrice = priceRatio.sqrt()
      const il = new BigNumberInBase(2)
        .times(sqrtPrice)
        .div(new BigNumberInBase(1).plus(priceRatio))
        .minus(1)
        .times(100)

      return il.toString()
    } catch (error) {
      console.error('Failed to calculate impermanent loss:', error)
      return '0'
    }
  }

  private calculateMinShares(
    token0Amount: string,
    token1Amount: string,
    slippageTolerance: number
  ): string {
    const total = new BigNumberInBase(token0Amount)
      .plus(new BigNumberInBase(token1Amount))
    return total
      .times(new BigNumberInBase(1).minus(slippageTolerance))
      .toString()
  }
}

export const liquidityPoolService = new LiquidityPoolService(
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === 'mainnet'
    ? Network.MainnetK8s
    : Network.TestnetK8s
)