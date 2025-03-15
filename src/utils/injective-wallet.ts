import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkInfo } from "@injectivelabs/networks";
import { WalletStrategy } from "@injectivelabs/wallet-strategy";

// Get network configuration from environment
const NETWORK =
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === "mainnet"
    ? Network.MainnetK8s
    : Network.TestnetK8s;

const ETHEREUM_CHAIN_ID =
  process.env.NEXT_PUBLIC_INJECTIVE_NETWORK === "mainnet"
    ? EthereumChainId.Mainnet
    : EthereumChainId.Goerlis;

// Initialize wallet strategy
export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  ethereumOptions: {
    chainId: ETHEREUM_CHAIN_ID,
    rpc: {
      mainnet: process.env.NEXT_PUBLIC_INJECTIVE_RPC!,
    },
  },
  walletConnectOptions: {
    supportedWallets: [
      "metamask",
      "keplr",
      "leap",
      "cosmostation",
      "walletconnect",
    ],
    disableOptions: {
      trezor: true,
      ledger: true,
      usb: true,
    },
  },
});

// Event handlers
try {
  walletStrategy.onAccountChange((account: string) => {
    console.log("Account changed:", account);
    // Trigger any necessary UI updates
  });

  walletStrategy.onChainChanged((chainId: string) => {
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

// Helper functions
export const getInjectiveAddress = async (): Promise<string> => {
  const addresses = await walletStrategy.getAddresses();
  return addresses[0];
};

export const connectInjective = async () => {
  try {
    await walletStrategy.connect();
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
    await walletStrategy.disconnect();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to disconnect from Injective:", error.message);
    } else {
      console.error("Failed to disconnect from Injective:", String(error));
    }
    throw error;
  }
};
