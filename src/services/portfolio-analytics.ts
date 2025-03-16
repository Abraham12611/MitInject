import {
  IndexerGrpcAccountApi,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  ChainGrpcBankApi,
  IndexerGrpcOracleApi,
  SpotMarket,
  DerivativeMarket
} from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'
import { BigNumberInBase } from '@injectivelabs/utils'

// Types
export interface PortfolioAnalytics {
  totalValue: string
  pnl: string
  positions: Position[]
  historicalPerformance: HistoricalData[]
  riskMetrics: RiskMetrics
}

export interface Position {
  marketId: string
  denom: string
  quantity: string
  value: string
  pnl: string
  type: 'spot' | 'derivative'
}

export interface HistoricalData {
  timestamp: number
  value: string
  pnl: string
}

export interface RiskMetrics {
  sharpeRatio: string
  volatility: string
  diversificationScore: string
}

interface PortfolioSnapshot {
  timestamp: number
  value: string
  pnl: string
}

class PortfolioAnalyticsService {
  private accountApi: IndexerGrpcAccountApi
  private spotApi: IndexerGrpcSpotApi
  private derivativesApi: IndexerGrpcDerivativesApi
  private bankApi: ChainGrpcBankApi
  private oracleApi: IndexerGrpcOracleApi

  constructor(network: Network = Network.TestnetK8s) {
    const INDEXER_API = process.env.NEXT_PUBLIC_INJECTIVE_INDEXER!
    const CHAIN_API = process.env.NEXT_PUBLIC_INJECTIVE_RPC!

    this.accountApi = new IndexerGrpcAccountApi(INDEXER_API)
    this.spotApi = new IndexerGrpcSpotApi(INDEXER_API)
    this.derivativesApi = new IndexerGrpcDerivativesApi(INDEXER_API)
    this.bankApi = new ChainGrpcBankApi(CHAIN_API)
    this.oracleApi = new IndexerGrpcOracleApi(INDEXER_API)
  }

  async getPortfolioAnalytics(address: string): Promise<PortfolioAnalytics> {
    try {
      // Fetch portfolio data
      const portfolio = await this.accountApi.fetchPortfolio(address)

      // Fetch market data
      const spotMarketsResponse = await this.spotApi.fetchMarkets()
      const derivativeMarketsResponse = await this.derivativesApi.fetchMarkets()

      const spotMarkets = spotMarketsResponse.markets as SpotMarket[]
      const derivativeMarkets = derivativeMarketsResponse.markets as DerivativeMarket[]

      // Fetch bank balances
      const { balances: bankBalances } = await this.bankApi.fetchBalances(address)

      // Process positions
      const positions = await this.processPositions(
        portfolio,
        spotMarkets,
        derivativeMarkets,
        bankBalances
      )

      // Calculate total value and PNL
      const totalValue = positions.reduce(
        (sum, pos) => sum.plus(new BigNumberInBase(pos.value)),
        new BigNumberInBase(0)
      )

      const totalPnl = positions.reduce(
        (sum, pos) => sum.plus(new BigNumberInBase(pos.pnl)),
        new BigNumberInBase(0)
      )

      // Get historical performance
      const historicalPerformance = await this.calculateHistoricalPerformance(address)

      // Calculate risk metrics
      const riskMetrics = this.calculateRiskMetrics(positions, historicalPerformance)

      return {
        totalValue: totalValue.toString(),
        pnl: totalPnl.toString(),
        positions,
        historicalPerformance,
        riskMetrics
      }
    } catch (error) {
      console.error('Failed to fetch portfolio analytics:', error)
      throw error
    }
  }

  private async processPositions(
    portfolio: any,
    spotMarkets: SpotMarket[],
    derivativeMarkets: DerivativeMarket[],
    bankBalances: any[]
  ): Promise<Position[]> {
    const positions: Position[] = []

    // Process spot positions
    for (const position of portfolio.spotPositions) {
      const market = spotMarkets.find(m => m.marketId === position.marketId)
      if (market) {
        positions.push({
          marketId: position.marketId,
          denom: market.baseToken.denom,
          quantity: position.quantity,
          value: new BigNumberInBase(position.quantity)
            .times(new BigNumberInBase(market.lastPrice))
            .toString(),
          pnl: this.calculatePositionPnl(position, market),
          type: 'spot'
        })
      }
    }

    // Process derivative positions
    for (const position of portfolio.derivativePositions) {
      const market = derivativeMarkets.find(m => m.marketId === position.marketId)
      if (market) {
        positions.push({
          marketId: position.marketId,
          denom: market.quoteDenom,
          quantity: position.quantity,
          value: new BigNumberInBase(position.quantity)
            .times(new BigNumberInBase(market.lastPrice))
            .toString(),
          pnl: this.calculatePositionPnl(position, market),
          type: 'derivative'
        })
      }
    }

    // Process bank balances
    for (const balance of bankBalances) {
      const tokenMetadata = await this.bankApi.fetchDenomMetadata(balance.denom)
      if (tokenMetadata) {
        const oraclePrice = await this.oracleApi.fetchOraclePrice({
          baseSymbol: balance.denom,
          quoteSymbol: 'USDT'
        })
        const price = oraclePrice?.price || '0'
        positions.push({
          marketId: balance.denom,
          denom: balance.denom,
          quantity: balance.amount,
          value: new BigNumberInBase(balance.amount)
            .times(new BigNumberInBase(price))
            .toString(),
          pnl: '0', // Bank balances don't have PNL
          type: 'spot'
        })
      }
    }

    return positions
  }

  private async calculateHistoricalPerformance(
    address: string
  ): Promise<HistoricalData[]> {
    try {
      const { snapshots } = await this.accountApi.fetchPortfolioHistory({
        accountAddress: address,
        daysToInclude: 30
      })
      return snapshots.map((snapshot: PortfolioSnapshot) => ({
        timestamp: snapshot.timestamp,
        value: snapshot.value,
        pnl: snapshot.pnl
      }))
    } catch (error) {
      console.error('Failed to fetch historical performance:', error)
      return []
    }
  }

  private calculateRiskMetrics(
    positions: Position[],
    historicalData: HistoricalData[]
  ): RiskMetrics {
    // Calculate Sharpe Ratio
    const returns = this.calculateReturns(historicalData)
    const averageReturn = this.calculateAverage(returns)
    const volatility = this.calculateVolatility(returns)
    const sharpeRatio = volatility !== 0 ? (averageReturn / volatility).toString() : '0'

    // Calculate portfolio diversification score
    const totalValue = positions.reduce(
      (sum, pos) => sum.plus(new BigNumberInBase(pos.value)),
      new BigNumberInBase(0)
    )

    const weights = positions.map(pos =>
      new BigNumberInBase(pos.value).div(totalValue).toNumber()
    )

    const diversificationScore = this.calculateDiversificationScore(weights)

    return {
      sharpeRatio,
      volatility: volatility.toString(),
      diversificationScore: diversificationScore.toString()
    }
  }

  private calculateReturns(historicalData: HistoricalData[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < historicalData.length; i++) {
      const previousValue = new BigNumberInBase(historicalData[i - 1].value)
      const currentValue = new BigNumberInBase(historicalData[i].value)
      const return_ = currentValue.div(previousValue).minus(1).toNumber()
      returns.push(return_)
    }
    return returns
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0
    const avg = this.calculateAverage(returns)
    const squaredDiffs = returns.map(r => Math.pow(r - avg, 2))
    return Math.sqrt(this.calculateAverage(squaredDiffs))
  }

  private calculateDiversificationScore(weights: number[]): number {
    // Herfindahl-Hirschman Index (HHI) based diversification score
    const hhi = weights.reduce((sum, weight) => sum + Math.pow(weight, 2), 0)
    // Convert HHI to a 0-1 score where 1 is perfectly diversified
    return 1 - hhi
  }

  private calculatePositionPnl(position: any, market: any): string {
    const currentValue = new BigNumberInBase(position.quantity)
      .times(new BigNumberInBase(market.lastPrice))

    const costBasis = new BigNumberInBase(position.quantity)
      .times(new BigNumberInBase(position.entryPrice || market.lastPrice))

    return currentValue.minus(costBasis).toString()
  }
}

export const portfolioAnalytics = new PortfolioAnalyticsService(
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === 'mainnet'
    ? Network.MainnetK8s
    : Network.TestnetK8s
)