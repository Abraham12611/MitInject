import {
  MsgCreateSpotLimitOrder,
  SpotOrderBuilder,
  TxGrpcClient,
  TxResponse,
  PrivateKey
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { LiquidityOrder, TransactionOptions } from './types'
import { getNetworkConfig, DEFAULT_TRANSACTION_OPTIONS } from './config'

export class HelixLiquidityService {
  private txClient: TxGrpcClient

  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    const config = getNetworkConfig(networkType)
    this.txClient = new TxGrpcClient(config.endpoints.grpc)
  }

  async provideLiquidity(
    marketId: string,
    privateKeyHex: string,
    orders: LiquidityOrder[],
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse[]> {
    try {
      const privateKey = PrivateKey.fromHex(privateKeyHex)
      const injectiveAddress = privateKey.toBech32()
      const publicKey = privateKey.toPublicKey().toBase64()

      const orderPromises = orders.map(async (orderDetails) => {
        const order = SpotOrderBuilder.create({
          marketId,
          subaccountId: injectiveAddress,
          injectiveAddress,
          orderType: 'LIMIT',
          orderSide: orderDetails.side,
          price: new BigNumberInBase(orderDetails.price).toFixed(),
          quantity: new BigNumberInBase(orderDetails.quantity).toFixed(),
        })

        const message = MsgCreateSpotLimitOrder.fromJSON({
          sender: injectiveAddress,
          order
        })

        const { txHash } = await this.txClient.broadcast({
          message,
          privateKey,
          publicKey,
          options
        })

        return this.txClient.fetchTx(txHash)
      })

      return Promise.all(orderPromises)
    } catch (error) {
      console.error('Error providing liquidity:', error)
      throw error
    }
  }

  async updateLiquidityOrders(
    marketId: string,
    privateKeyHex: string,
    oldOrders: string[],
    newOrders: LiquidityOrder[],
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse[]> {
    try {
      // Cancel existing orders
      const cancelPromises = oldOrders.map(orderId =>
        this.cancelLiquidityOrder(marketId, privateKeyHex, orderId, options)
      )
      await Promise.all(cancelPromises)

      // Create new orders
      return this.provideLiquidity(marketId, privateKeyHex, newOrders, options)
    } catch (error) {
      console.error('Error updating liquidity orders:', error)
      throw error
    }
  }

  async cancelLiquidityOrder(
    marketId: string,
    privateKeyHex: string,
    orderId: string,
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse> {
    try {
      const privateKey = PrivateKey.fromHex(privateKeyHex)
      const injectiveAddress = privateKey.toBech32()
      const publicKey = privateKey.toPublicKey().toBase64()

      const message = MsgCreateSpotLimitOrder.fromJSON({
        sender: injectiveAddress,
        order: {
          marketId,
          orderId,
          orderMask: 'CANCEL'
        }
      })

      const { txHash } = await this.txClient.broadcast({
        message,
        privateKey,
        publicKey,
        options
      })

      return this.txClient.fetchTx(txHash)
    } catch (error) {
      console.error('Error cancelling liquidity order:', error)
      throw error
    }
  }

  async rebalanceLiquidity(
    marketId: string,
    privateKeyHex: string,
    targetSpread: number,
    baseQuantity: string,
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse[]> {
    try {
      const midPrice = await this.getMidPrice(marketId)
      const spread = targetSpread / 2 // Half spread on each side

      const buyPrice = new BigNumberInBase(midPrice)
        .multipliedBy(1 - spread)
        .toFixed()
      const sellPrice = new BigNumberInBase(midPrice)
        .multipliedBy(1 + spread)
        .toFixed()

      const orders: LiquidityOrder[] = [
        {
          side: 'BUY',
          price: buyPrice,
          quantity: baseQuantity
        },
        {
          side: 'SELL',
          price: sellPrice,
          quantity: baseQuantity
        }
      ]

      return this.provideLiquidity(marketId, privateKeyHex, orders, options)
    } catch (error) {
      console.error('Error rebalancing liquidity:', error)
      throw error
    }
  }

  private async getMidPrice(marketId: string): Promise<string> {
    // Implementation would depend on the market data service
    // This is a placeholder that should be replaced with actual implementation
    throw new Error('getMidPrice not implemented')
  }
}