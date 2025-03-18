import { ChainId, EthereumChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";

// Define the wallet strategy interface
export interface WalletStrategyInterface {
  getAddresses(): Promise<string[]>;
  connectWallet(): Promise<void>;
  disconnectWallet(): Promise<void>;
  onAccountChange(callback: (account: string) => void): void;
  onChainIdChange(callback: (chainId: string) => void): void;
}

// Create a simple wallet strategy implementation
export class CustomWalletStrategy implements WalletStrategyInterface {
  private chainId: ChainId;
  private ethereumChainId: EthereumChainId;
  private rpcUrl: string;
  private address: string | null = null;
  private accountChangeCallbacks: ((account: string) => void)[] = [];
  private chainIdChangeCallbacks: ((chainId: string) => void)[] = [];

  constructor(options: {
    chainId: ChainId;
    ethereumOptions: {
      ethereumChainId: EthereumChainId;
      rpcUrl: string;
    };
  }) {
    this.chainId = options.chainId;
    this.ethereumChainId = options.ethereumOptions.ethereumChainId;
    this.rpcUrl = options.ethereumOptions.rpcUrl;
  }

  async getAddresses(): Promise<string[]> {
    if (!this.address) {
      return [];
    }
    return [this.address];
  }

  async connectWallet(): Promise<void> {
    // Simulate connecting to a wallet
    this.address = `inj${Math.random().toString(36).substring(2, 15)}`;
    this.notifyAccountChange();
  }

  async disconnectWallet(): Promise<void> {
    this.address = null;
    this.notifyAccountChange();
  }

  onAccountChange(callback: (account: string) => void): void {
    this.accountChangeCallbacks.push(callback);
  }

  onChainIdChange(callback: (chainId: string) => void): void {
    this.chainIdChangeCallbacks.push(callback);
  }

  private notifyAccountChange(): void {
    if (this.address) {
      this.accountChangeCallbacks.forEach(callback => callback(this.address!));
    }
  }

  private notifyChainIdChange(): void {
    this.chainIdChangeCallbacks.forEach(callback => callback(this.chainId.toString()));
  }
}

// Export a factory function to create a wallet strategy
export function createWalletStrategy(options: {
  chainId: ChainId;
  ethereumOptions: {
    ethereumChainId: EthereumChainId;
    rpcUrl: string;
  };
}): WalletStrategyInterface {
  return new CustomWalletStrategy(options);
}