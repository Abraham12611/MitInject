import { Network, getNetworkEndpoints, ChainId } from '@injectivelabs/networks'
import { NetworkConfig } from './types'

export const DEFAULT_GAS_PRICE = '0.01'
export const DEFAULT_GAS_LIMIT = '500000'
export const DEFAULT_BATCH_GAS_LIMIT = '1000000'
export const DEFAULT_BATCH_SIZE = 5

export const getNetworkConfig = (networkType: 'mainnet' | 'testnet'): NetworkConfig => {
  const network = networkType === 'mainnet' ? Network.Mainnet : Network.Testnet
  const endpoints = getNetworkEndpoints(network)
  const chainId = networkType === 'mainnet' ? ChainId.Mainnet : ChainId.Testnet

  return {
    network,
    endpoints: {
      indexer: endpoints.indexer,
      tx: endpoints.tx
    },
    chainId
  }
}

export const DEFAULT_TRANSACTION_OPTIONS = {
  memo: '',
  fee: {
    amount: [
      {
        denom: 'inj',
        amount: DEFAULT_GAS_PRICE,
      },
    ],
    gas: DEFAULT_GAS_LIMIT,
  },
}

export const DEFAULT_BATCH_TRANSACTION_OPTIONS = {
  ...DEFAULT_TRANSACTION_OPTIONS,
  fee: {
    ...DEFAULT_TRANSACTION_OPTIONS.fee,
    gas: DEFAULT_BATCH_GAS_LIMIT,
  },
}