import {
  MsgBroadcaster,
} from '@injectivelabs/wallet-core'
import { WalletStrategy } from '@injectivelabs/wallet-strategy'
import { Network } from '@injectivelabs/networks'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import { 
  IndexerGrpcSpotApi, 
  IndexerGrpcDerivativesApi,
  IndexerGrpcAccountApi 
} from '@injectivelabs/sdk-ts'
import { walletStrategy } from './injective-wallet'

// Network configuration
const NETWORK = process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === 'mainnet' 
  ? Network.MainnetK8s 
  : Network.TestnetK8s

// Initialize APIs
export const spotApi = new IndexerGrpcSpotApi(process.env.NEXT_PUBLIC_INJECTIVE_INDEXER!)
export const derivativeApi = new IndexerGrpcDerivativesApi(process.env.NEXT_PUBLIC_INJECTIVE_INDEXER!)
export const accountApi = new IndexerGrpcAccountApi(process.env.NEXT_PUBLIC_INJECTIVE_INDEXER!)

// Message broadcaster for transactions
export const msgBroadcaster = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
  simulateTx: true // Enable transaction simulation
})

// Helper functions for common operations
export const getSpotMarkets = async () => {
  try {
    const { markets } = await spotApi.fetchMarkets()
    return markets
  } catch (error) {
    console.error('Failed to fetch spot markets:', error)
    throw error
  }
}

export const getDerivativeMarkets = async () => {
  try {
    const { markets } = await derivativeApi.fetchMarkets()
    return markets
  } catch (error) {
    console.error('Failed to fetch derivative markets:', error)
    throw error
  }
}

export const getAccountPortfolio = async (address: string) => {
  try {
    const portfolio = await accountApi.fetchAccountPortfolio(address)
    return portfolio
  } catch (error) {
    console.error('Failed to fetch account portfolio:', error)
    throw error
  }
}

// Transaction signing and broadcasting
export const broadcastTransaction = async (msgs: any[]) => {
  try {
    const response = await msgBroadcaster.broadcast({
      msgs,
      injectiveAddress: await walletStrategy.getAddresses()[0]
    })
    return response
  } catch (error) {
    console.error('Failed to broadcast transaction:', error)
    throw error
  }
}

// Market data helpers
export const getMarketOrderbook = async (marketId: string, isDerivative: boolean = false) => {
  try {
    if (isDerivative) {
      const { orderbook } = await derivativeApi.fetchOrderbook(marketId)
      return orderbook
    } else {
      const { orderbook } = await spotApi.fetchOrderbook(marketId)
      return orderbook
    }
  } catch (error) {
    console.error('Failed to fetch orderbook:', error)
    throw error
  }
} 