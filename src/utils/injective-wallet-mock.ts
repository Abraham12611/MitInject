// This file provides mock implementations for @injectivelabs/wallet-ts Magic strategy
// to be used when the actual implementation is not available or has compatibility issues

export class MagicStrategyMock {
  constructor() {
    console.warn('Using Magic Strategy mock implementation');
  }

  connect = async () => {
    console.warn('Magic Strategy mock: connect called');
    return {
      address: '0x0000000000000000000000000000000000000000',
      chainId: '0x1',
      publicKey: new Uint8Array(32),
    };
  };

  getAddresses = async () => {
    console.warn('Magic Strategy mock: getAddresses called');
    return ['0x0000000000000000000000000000000000000000'];
  };

  signTransaction = async (transaction: any) => {
    console.warn('Magic Strategy mock: signTransaction called');
    return new Uint8Array(64);
  };

  signDirectTransaction = async (transaction: any) => {
    console.warn('Magic Strategy mock: signDirectTransaction called');
    return {
      signature: new Uint8Array(64),
      signed: transaction,
    };
  };

  sendTransaction = async (transaction: any) => {
    console.warn('Magic Strategy mock: sendTransaction called');
    return {
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
  };

  disconnect = async () => {
    console.warn('Magic Strategy mock: disconnect called');
    return true;
  };

  getWalletDeviceType = () => {
    console.warn('Magic Strategy mock: getWalletDeviceType called');
    return 'desktop';
  };
}

export default MagicStrategyMock;