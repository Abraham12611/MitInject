import { AstroportNetworkConfig } from './types';

/**
 * Network configurations for Astroport on different chains
 */
export const NETWORKS: Record<string, AstroportNetworkConfig> = {
  // Injective Mainnet configuration
  mainnet: {
    network: 'mainnet',
    factoryContract: 'inj1pvcj5r33lh8xf5nlg6sykzrwe7c9px26an32n6', // Example address - replace with actual
    rpcEndpoint: 'https://lcd.injective.network',
    chainId: 'injective-1'
  },
  // Injective Testnet configuration
  testnet: {
    network: 'testnet',
    factoryContract: 'inj1mdmp9j38wd0jt6qsu4yk28g6h7m5h7acgk6gsf', // Example address - replace with actual
    rpcEndpoint: 'https://testnet.lcd.injective.network',
    chainId: 'injective-888'
  }
};

/**
 * Get network configuration for the specified network
 * @param networkType The network type (mainnet or testnet)
 * @returns The network configuration
 */
export const getNetworkConfig = (
  networkType: 'mainnet' | 'testnet' = 'mainnet'
): AstroportNetworkConfig => {
  return NETWORKS[networkType];
};