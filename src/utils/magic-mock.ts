// This file provides mock implementations for Magic SDK functionality
// to be used when the actual SDK is not available or has compatibility issues

export class MagicMock {
  constructor(apiKey: string, options?: any) {
    console.warn('Using Magic SDK mock implementation');
  }

  // Mock wallet methods
  wallet = {
    connectWithUI: async () => {
      console.warn('Magic SDK mock: connectWithUI called');
      return ['0x0000000000000000000000000000000000000000'];
    },
    getInfo: async () => {
      console.warn('Magic SDK mock: getInfo called');
      return { walletType: 'mock', walletInfo: {} };
    },
    showUI: async () => {
      console.warn('Magic SDK mock: showUI called');
    },
    disconnect: async () => {
      console.warn('Magic SDK mock: disconnect called');
      return true;
    }
  };

  // Mock user methods
  user = {
    getInfo: async () => {
      console.warn('Magic SDK mock: user.getInfo called');
      return { email: 'mock@example.com', publicAddress: '0x0000000000000000000000000000000000000000' };
    },
    getMetadata: async () => {
      console.warn('Magic SDK mock: user.getMetadata called');
      return { email: 'mock@example.com', publicAddress: '0x0000000000000000000000000000000000000000' };
    },
    isLoggedIn: async () => {
      console.warn('Magic SDK mock: user.isLoggedIn called');
      return false;
    },
    logout: async () => {
      console.warn('Magic SDK mock: user.logout called');
      return true;
    }
  };

  // Mock RPC provider
  rpcProvider = {
    request: async (params: any) => {
      console.warn('Magic SDK mock: rpcProvider.request called', params);
      return null;
    }
  };
}

export default MagicMock;