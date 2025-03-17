import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";
import { createWalletStrategy, WalletStrategyInterface } from "./custom-wallet-strategy";

// Get network configuration from environment
const NETWORK =
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === "mainnet"
    ? Network.MainnetK8s
    : Network.TestnetK8s;

const ETHEREUM_CHAIN_ID =
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === "mainnet"
    ? EthereumChainId.Mainnet
    : EthereumChainId.Goerli;

// Initialize wallet strategy
export const walletStrategy: WalletStrategyInterface = createWalletStrategy({
  chainId: ChainId.Mainnet,
  ethereumOptions: {
    ethereumChainId: ETHEREUM_CHAIN_ID,
    rpcUrl: process.env.NEXT_PUBLIC_INJECTIVE_RPC!,
  }
});

// Only run wallet event handlers on client side
if (typeof window !== 'undefined') {
  try {
    walletStrategy.onAccountChange((account: string) => {
      console.log("Account changed:", account);
      // Trigger any necessary UI updates
    });

    walletStrategy.onChainIdChange((chainId: string) => {
      console.log("Chain changed:", chainId);
      // Handle chain changes if needed
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn("Wallet features are not available:", error.message);
    } else {
      console.warn("Wallet features are not available:", String(error));
    }
  }
}

// Helper functions
export const getInjectiveAddress = async (): Promise<string> => {
  const addresses = await walletStrategy.getAddresses();
  return addresses[0] || '';
};

export const connectInjective = async () => {
  try {
    await walletStrategy.connectWallet();
    return await getInjectiveAddress();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to connect to Injective:", error.message);
    } else {
      console.error("Failed to connect to Injective:", String(error));
    }
    throw error;
  }
};

export const disconnectInjective = async () => {
  try {
    await walletStrategy.disconnectWallet();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to disconnect from Injective:", error.message);
    } else {
      console.error("Failed to disconnect from Injective:", String(error));
    }
    throw error;
  }
};
