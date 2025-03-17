import {
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  StreamOperation
} from '@injectivelabs/sdk-ts'
import { BigNumber } from '@injectivelabs/utils'
import { MarketData } from './types'
import { getNetworkConfig } from './config'

export class HelixMarketService {
  private spotApi: IndexerGrpcSpotApi
  private derivativesApi: IndexerGrpcDerivativesApi

  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    const config = getNetworkConfig(networkType)
    this.spotApi = new IndexerGrpcSpotApi(config.endpoints.indexer)
    this.derivativesApi = new IndexerGrpcDerivativesApi(config.endpoints.indexer)
  }

  async fetchMarketData(marketId: string): Promise<MarketData> {
    try {
      const [orderbook, trades, markets] = await Promise.all([
        this.spotApi.fetchOrderbook(marketId),
        this.spotApi.fetchTrades({
          marketId,
          pagination: {
            limit: 10
          }
        }),
        this.spotApi.fetchMarkets()
      ])

      const market = markets.markets.find(m => m.marketId === marketId)

      return {
        orderbook,
        trades,
        market
      }
    } catch (error) {
      console.error('Error fetching market data:', error)
      throw error
    }
  }

  async monitorPriceChanges(
    marketId: string,
    priceThreshold: string,
    onThresholdCrossed: () => void,
    onError?: (error: any) => void
  ) {
    try {
      const stream = await this.spotApi.streamTrades({
        marketIds: [marketId]
      })

      stream.on(StreamOperation.Data, (trade) => {
        console.log('New trade:', trade)

        if (new BigNumber(trade.price).isGreaterThan(priceThreshold)) {
          console.log('Price threshold crossed, triggering action')
          onThresholdCrossed()
        }
      })

      stream.on(StreamOperation.Error, (error) => {
        console.error('Stream error:', error)
        if (onError) {
          onError(error)
        }
      })

      return stream
    } catch (error) {
      console.error('Error setting up price monitoring:', error)
      throw error
    }
  }

  async getLastPrice(marketId: string): Promise<string> {
    try {
      const trades = await this.spotApi.fetchTrades({
        marketId,
        pagination: { limit: 1 }
      })

      if (!trades.trades.length) {
        throw new Error('No trades found for market')
      }

      return trades.trades[0].price
    } catch (error) {
      console.error('Error fetching last price:', error)
      throw error
    }
  }
}