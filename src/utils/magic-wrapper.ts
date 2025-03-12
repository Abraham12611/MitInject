import { MagicMock } from './magic-mock';

// Define types for Magic SDK
export interface MagicInstance {
  wallet: {
    connectWithUI: () => Promise<string[]>;
    getInfo: () => Promise<any>;
    showUI: () => Promise<void>;
    disconnect: () => Promise<boolean>;
  };
  user: {
    getInfo: () => Promise<any>;
    getMetadata: () => Promise<any>;
    isLoggedIn: () => Promise<boolean>;
    logout: () => Promise<boolean>;
  };
  rpcProvider: {
    request: (params: any) => Promise<any>;
  };
}

// Attempt to import Magic SDK, but catch any errors
let Magic: any;
try {
  // Use dynamic import to prevent build errors
  const magicModule = require('magic-sdk');
  Magic = magicModule.Magic;
} catch (error) {
  console.warn('Failed to import Magic SDK, using mock implementation instead');
  Magic = MagicMock;
}

// Export the Magic constructor
export { Magic };

// Export a factory function to create Magic instances
export function createMagicInstance(apiKey: string, options?: any): MagicInstance {
  try {
    return new Magic(apiKey, options);
  } catch (error) {
    console.warn('Failed to create Magic instance, using mock implementation instead');
    return new MagicMock(apiKey, options);
  }
}