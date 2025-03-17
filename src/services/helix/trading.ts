import {
  PrivateKey,
  MsgCreateSpotMarketOrder,
  SpotOrderBuilder,
  ChainGrpcWasmApi,
  TxGrpcClient,
  TxResponse,
  Msgs
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { OrderDetails, TransactionOptions } from './types'
import { getNetworkConfig, DEFAULT_TRANSACTION_OPTIONS } from './config'

export class HelixTradingService {
  private chainGrpcWasmApi: ChainGrpcWasmApi
  private txClient: TxGrpcClient

  constructor(networkType: 'mainnet' | 'testnet' = 'mainnet') {
    const config = getNetworkConfig(networkType)
    this.chainGrpcWasmApi = new ChainGrpcWasmApi(config.endpoints.grpc)
    this.txClient = new TxGrpcClient(config.endpoints.grpc)
  }

  async createSpotMarketOrder(
    orderDetails: OrderDetails,
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse> {
    try {
      const {
        privateKeyHex,
        marketId,
        orderSide,
        quantity,
        price
      } = orderDetails

      const privateKey = PrivateKey.fromHex(privateKeyHex)
      const injectiveAddress = privateKey.toBech32()
      const publicKey = privateKey.toPublicKey().toBase64()

      const order = SpotOrderBuilder.create({
        marketId,
        subaccountId: injectiveAddress,
        injectiveAddress,
        orderType: 'MARKET',
        orderSide,
        price: new BigNumberInBase(price).toFixed(),
        quantity: new BigNumberInBase(quantity).toFixed(),
      })

      const message = MsgCreateSpotMarketOrder.fromJSON({
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
    } catch (error) {
      console.error('Error creating spot market order:', error)
      throw error
    }
  }

  async createConditionalOrder(
    orderDetails: OrderDetails,
    condition: (price: string) => boolean,
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse> {
    try {
      const currentPrice = await this.getCurrentPrice(orderDetails.marketId)

      if (!condition(currentPrice)) {
        throw new Error('Condition not met for order execution')
      }

      return this.createSpotMarketOrder(orderDetails, options)
    } catch (error) {
      console.error('Error creating conditional order:', error)
      throw error
    }
  }

  private async getCurrentPrice(marketId: string): Promise<string> {
    try {
      const response = await this.chainGrpcWasmApi.fetchContractInfo(marketId)
      return response.data.price || '0'
    } catch (error) {
      console.error('Error fetching current price:', error)
      throw error
    }
  }

  async cancelOrder(
    injectiveAddress: string,
    marketId: string,
    orderId: string,
    options: TransactionOptions = DEFAULT_TRANSACTION_OPTIONS
  ): Promise<TxResponse> {
    try {
      const message = Msgs.createSpotOrder({
        injectiveAddress,
        marketId,
        orderId,
        orderMask: 'CANCEL'
      })

      const { txHash } = await this.txClient.broadcast({
        message,
        options
      })

      return this.txClient.fetchTx(txHash)
    } catch (error) {
      console.error('Error cancelling order:', error)
      throw error
    }
  }
}