import { MagicStrategyMock } from './injective-wallet-mock';

// Attempt to import the Magic strategy, but catch any errors
let MagicStrategy: any;
try {
  // Use dynamic import to prevent build errors
  const injectiveWalletTs = require('@injectivelabs/wallet-ts');
  MagicStrategy = injectiveWalletTs.MagicStrategy;
} catch (error) {
  console.warn('Failed to import MagicStrategy, using mock implementation instead');
  MagicStrategy = MagicStrategyMock;
}

import {
  WalletStrategy,
  WalletEvents
} from '@injectivelabs/wallet-ts'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'

// Get network configuration from environmen
const NETWORK = process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === 'mainnet' 
  ? Network.MainnetK8s 
  : Network.TestnetK8s

const ETHEREUM_CHAIN_ID = process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === 'mainnet'
  ? EthereumChainId.Mainnet
  : EthereumChainId.Goerli

// Initialize wallet strategy
export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet, // Will be used for Injective chain
  ethereumOptions: {
    chainId: ETHEREUM_CHAIN_ID,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_INJECTIVE_RPC!,
    }
  }
})

// Event handlers
try {
  walletStrategy.onAccountChange((account: string) => {
    console.log('Account changed:', account)
    // Trigger any necessary UI updates
  })

  walletStrategy.onChainChanged((chainId: string) => {
    console.log('Chain changed:', chainId)
    // Handle chain changes if needed
  })
} catch (error: unknown) {
  if (error instanceof Error) {
    console.warn('Wallet features are not available:', error.message)
  } else {
    console.warn('Wallet features are not available:', String(error))
  }
}

// Helper functions
export const getInjectiveAddress = async (): Promise<string> => {
  const addresses = await walletStrategy.getAddresses()
  return addresses[0]
}

export const connectInjective = async () => {
  try {
    await walletStrategy.connect()
    return await getInjectiveAddress()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to connect to Injective:', error.message)
    } else {
      console.error('Failed to connect to Injective:', String(error))
    }
    throw error
  }
}

export const disconnectInjective = async () => {
  try {
    await walletStrategy.disconnect()
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Failed to disconnect from Injective:', error.message)
    } else {
      console.error('Failed to disconnect from Injective:', String(error))
    }
    throw error
  }
} 